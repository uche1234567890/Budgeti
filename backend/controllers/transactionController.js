const Transaction = require("../models/transactionModel");
const Category = require("../models/categoryModel");
const moment = require("moment");

// Create a transaction
const createTransaction = async (req, res) => {
  const userId = req.user._id;
  const { type, amount, description, category } = req.body;

  try {
    let transaction;

    if (type === "income") {
      // For income transactions, allow the category field to be optional
      transaction = new Transaction({
        type,
        amount,
        description,
        user: userId,
      });
    } else {
      // For expense transactions, require the category field
      if (!category) {
        return res
          .status(400)
          .json({ error: "Category is required for expense transactions" });
      }

      transaction = new Transaction({
        type,
        amount,
        category,
        description,
        user: userId,
      });
    }

    await transaction.save();
    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: userId,
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Update a transaction
const updateTransaction = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { type, amount, category, description } = req.body;

  try {
    let transaction = await Transaction.findOne({ _id: id, user: userId });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (transaction.type !== type) {
      return res
        .status(404)
        .json({ message: "Cannot update different transaction type" });
    }

    if (type === "expense" && !category) {
      return res
        .status(400)
        .json({ message: "Category is required for expenses" });
    }

    if (category && type === "expense") {
      const categoryExists = await Category.findOne({
        _id: category,
        user: userId,
      });
      if (!categoryExists) {
        return res.status(404).json({ message: "Category not found" });
      }
    }

    transaction.type = type || transaction.type;
    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.description = description || transaction.description;

    await transaction.save();

    res
      .status(200)
      .json({ message: "Transaction updated successfully", transaction });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// List all transactions for a user
const listTransactions = async (req, res) => {
  const userId = req.user._id;

  try {
    const transactions = await Transaction.find({ user: userId }).populate(
      "category",
      "name icon budgetAmount"
    );
    res.status(200).json({ transactions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get transactions by month for a user
const getTransactionsByMonth = async (req, res) => {
  const userId = req.user._id;
  const { monthYear } = req.params;

  try {
    const isValidFormat = moment(monthYear, "MM-YYYY", true).isValid();
    if (!isValidFormat) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use MM-YYYY." });
    }
    const startDate = moment
      .utc(monthYear, "MM-YYYY")
      .startOf("month")
      .toDate();
    const endDate = moment.utc(monthYear, "MM-YYYY").endOf("month").toDate();

    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("category", "name icon budgetAmount");

    if (transactions.length === 0) {
      return res.status(200).json({
        transactions: [],
        message: `No transactions are recorded in the month of ${monthYear}`,
      });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Get transactions by day for a user
const getTransactionsByDay = async (req, res) => {
  const userId = req.user._id;
  const { dayMonthYear } = req.params;

  try {
    const isValidFormat = moment(dayMonthYear, "DD-MM-YYYY", true).isValid();
    if (!isValidFormat) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use DD-MM-YYYY." });
    }
    const startDate = moment
      .utc(dayMonthYear, "DD-MM-YYYY")
      .startOf("day")
      .toDate();
    const endDate = moment
      .utc(dayMonthYear, "DD-MM-YYYY")
      .endOf("day")
      .toDate();

    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("category", "name icon budgetAmount");

    if (transactions.length === 0) {
      return res.status(200).json({
        transactions: [],
        message: `No transactions are recorded on ${dayMonthYear}`,
      });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
// Get transactions by year for a user
const getTransactionsByYear = async (req, res) => {
  const userId = req.user._id;
  const { year } = req.params;

  try {
    const isValidFormat = moment(year, "YYYY", true).isValid();
    if (!isValidFormat) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY." });
    }
    const startDate = moment.utc(year, "YYYY").startOf("year").toDate();
    const endDate = moment.utc(year, "YYYY").endOf("year").toDate();

    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }).populate("category", "name icon budgetAmount");

    if (transactions.length === 0) {
      return res.status(200).json({
        transactions: [],
        message: `No transactions are recorded in the year ${year}`,
      });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
module.exports = {
  createTransaction,
  deleteTransaction,
  updateTransaction,
  listTransactions,
  getTransactionsByMonth,
  getTransactionsByDay,
  getTransactionsByYear,
};