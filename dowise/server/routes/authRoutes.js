// server/routes/authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

function sign(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: "Missing fields" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already used" });
    const u = await User.create({ name, email, password });
    const token = sign(u);
    res.status(201).json({ token, user: { id: u._id, name: u.name, email: u.email, role: u.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await u.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    const token = sign(u);
    res.json({ token, user: { id: u._id, name: u.name, email: u.email, role: u.role } });
  } catch (e) {
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
