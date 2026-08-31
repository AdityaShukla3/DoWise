// server/tests/routes/auth.test.js
const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const authRoutes = require("../../routes/authRoutes");
const User = require("../../models/User");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
  process.env.JWT_SECRET = "testsecret";
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("Auth Routes", () => {
  it("should signup a new user and return OTP sent message", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("OTP sent to email");
    expect(res.body.email).toBe("test@example.com");

    const user = await User.findOne({ email: "test@example.com" });
    expect(user).toBeTruthy();
    expect(user.isVerified).toBe(false);
    expect(user.otp).toBeDefined();
  });

  it("should not signup with missing fields", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      email: "test@example.com",
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing fields");
  });

  it("should verify OTP successfully", async () => {
    const user = await User.create({
      name: "OTP User",
      email: "otp@example.com",
      password: "password123",
      otp: "123456",
      otpExpires: new Date(Date.now() + 10000),
      isVerified: false
    });

    const res = await request(app).post("/api/auth/verify-otp").send({
      email: "otp@example.com",
      otp: "123456"
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("otp@example.com");

    const updatedUser = await User.findOne({ email: "otp@example.com" });
    expect(updatedUser.isVerified).toBe(true);
    expect(updatedUser.otp).toBeUndefined();
  });

  it("should fail OTP verification with invalid OTP", async () => {
    await User.create({
      name: "OTP User",
      email: "otp2@example.com",
      password: "password123",
      otp: "123456",
      otpExpires: new Date(Date.now() + 10000),
      isVerified: false
    });

    const res = await request(app).post("/api/auth/verify-otp").send({
      email: "otp2@example.com",
      otp: "000000"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid or expired OTP");
  });

  it("should login a verified user", async () => {
    await User.create({
      name: "Login User",
      email: "login@example.com",
      password: "password123",
      isVerified: true
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123"
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should not login an unverified user", async () => {
    await User.create({
      name: "Login User",
      email: "unverified@example.com",
      password: "password123",
      isVerified: false
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "unverified@example.com",
      password: "password123"
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Please verify your email first");
  });
});
