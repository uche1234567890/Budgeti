const express = require("express");
const router = express.Router();
const {
  loginUser,
  signupUser,
  verifyEmail,
  editUser,
  initiatePasswordReset,
  resetPassword,
  uploadProfilePicture,
  upload,
  loginLimiter,
} = require("../controllers/userController");
const userAuth = require("../middlewares/userAuthMiddleware");

// Login Route with rate limiter
router.post("/login", loginLimiter, loginUser);

// Sign-up Route
router.post("/signup", signupUser);

// Email verification route
router.get("/verify-email/:token", verifyEmail);

// Edit user details route
router.patch("/edit", userAuth, editUser);

// Initiate password reset route
router.post("/initiate-password-reset", initiatePasswordReset);

// Reset password route
router.post("/reset-password", resetPassword);

// Upload profile picture
router.patch(
  "/profile-picture",
  userAuth,
  upload.single("image"),
  uploadProfilePicture
);

module.exports = router;