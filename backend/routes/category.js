const express = require("express");
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const userAuth = require("../middlewares/userAuthMiddleware");

// Get all categories for a user
router.get("/get-all", userAuth, getCategories);

// Create a new category
router.post("/create", userAuth, createCategory);

// Update a category
router.patch("/update", userAuth, updateCategory);

// Delete a category
router.delete("/delete", userAuth, deleteCategory);

module.exports = router;