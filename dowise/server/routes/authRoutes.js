// server/routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const router = express.Router();

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false
}));

router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  authController.googleCallback
);

router.post("/signup", authController.signup);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);

module.exports = router;
