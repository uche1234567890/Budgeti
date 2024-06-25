const express = require("express");
const router = express.Router();
const {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  listTransactions,
  getTransactionsByMonth,
} = require("../controllers/transactionController");
const userAuth = require("../middlewares/userAuthMiddleware");

// Create a new transaction
router.post("/create", userAuth, createTransaction);

// Update a transaction
router.patch("/update/:id", userAuth, updateTransaction);

// Delete a transaction
router.delete("/delete/:id", userAuth, deleteTransaction);

// Get all transactions
router.get("/list-all", userAuth, listTransactions);

// Get transactions by month
router.get("/by-month/:monthYear", userAuth, getTransactionsByMonth);

module.exports = router;