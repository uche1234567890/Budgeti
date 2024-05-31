const express = require("express");
const router = express.Router();
const {
  loginUser,
  signupUser,
  verifyEmail,
} = require("../controllers/userController");

//Login Route
router.post("/login", loginUser);

//Sign-up Route
router.post("/signup", signupUser);

//Email verification route
router.get("/verify-email/:token", verifyEmail);

module.exports = router;