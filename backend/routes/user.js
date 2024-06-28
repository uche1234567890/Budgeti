const express = require("express");
const router = express.Router();
const {
  editUser,
  uploadProfilePicture,
  upload,
} = require("../controllers/userController");
const userAuth = require("../middlewares/userAuthMiddleware");

// Edit user details route
router.patch("/edit/:id", userAuth, editUser);

// Upload profile picture
router.patch(
  "/profile-picture",
  userAuth,
  upload.single("image"),
  uploadProfilePicture
);

module.exports = router;
