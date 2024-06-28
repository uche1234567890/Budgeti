const express = require("express");
const router = express.Router();
const {
  loginUser,
  signupUser,
  verifyEmail,
  initiatePasswordReset,
  resetPassword,
  loginLimiter,
} = require("../controllers/userController");

// Login Route with rate limiter
router.post("/login", loginLimiter, loginUser);

// Sign-up Route
router.post("/signup", signupUser);

// Email verification route
router.get("/verify-email/:token", verifyEmail);

// Initiate password reset route
router.post("/initiate-password-reset", initiatePasswordReset);

// Reset password route
router.post("/reset-password", resetPassword);

module.exports = router;