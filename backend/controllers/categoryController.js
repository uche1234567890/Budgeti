const Category = require("../models/categoryModel");

// Get all categories for a user
const getCategories = async (req, res) => {
  const userId = req.user._id;
  try {
    const categories = await Category.find({ user: userId });
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  const { name, icon } = req.body;
  const userId = req.user._id;
  try {
    const category = new Category({ name, icon, user: userId });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { categoryId, name, icon } = req.body;
  const userId = req.user._id;
  try {
    const category = await Category.findOneAndUpdate(
      { _id: categoryId, user: userId },
      { name, icon },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { categoryId } = req.body;
  const userId = req.user._id;
  try {
    const category = await Category.findOneAndDelete({
      _id: categoryId,
      user: userId,
    });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};