// server/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

function sign(user) {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) return res.status(400).json({ message: "Missing fields" });
    
    let u = await User.findOne({ email });
    if (u) {
      if (u.isVerified) {
        return res.status(400).json({ message: "Email already used" });
      } else {
        // Unverified user trying again, update password and name
        u.name = name;
        u.password = password;
      }
    } else {
      u = new User({ name, email, password });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    u.otp = otp;
    u.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await u.save();

    // Send OTP email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "DoWise - Verify Your Email",
          text: `Your OTP for DoWise is: ${otp}. It will expire in 10 minutes.`
        });
      } catch (err) {
        console.error("Email send failed:", err);
      }
    } else {
      console.log(`[DEV MODE] OTP for ${email} is ${otp}`);
    }

    res.status(201).json({ message: "OTP sent to email", email: u.email });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Signup failed" });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Missing fields" });

    const u = await User.findOne({ email });
    if (!u) return res.status(400).json({ message: "User not found" });
    if (u.isVerified) return res.status(400).json({ message: "Already verified" });

    if (u.otp !== otp || new Date() > u.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    u.isVerified = true;
    u.otp = undefined;
    u.otpExpires = undefined;
    await u.save();

    const token = sign(u);
    res.json({ token, user: { id: u._id, name: u.name, email: u.email, role: u.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    
    if (!u) return res.status(400).json({ message: "Invalid credentials" });
    if (!u.isVerified && !u.googleId) return res.status(400).json({ message: "Please verify your email first" });
    
    const ok = await u.comparePassword(password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });
    
    const token = sign(u);
    res.json({ token, user: { id: u._id, name: u.name, email: u.email, role: u.role } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.googleCallback = (req, res) => {
  const token = sign(req.user);
  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${token}`);
};
