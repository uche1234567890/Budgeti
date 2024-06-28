const Category = require("../models/categoryModel");
const Transaction = require("../models/transactionModel");
const moment = require("moment");

// 1. Summation of budgetAmount from all categories for a user
const sumCategoryBudget = async (req, res) => {
  const userId = req.user._id;
  try {
    const categories = await Category.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, totalBudget: { $sum: "$budgetAmount" } } },
    ]);
    const totalBudget = categories.length > 0 ? categories[0].totalBudget : 0;
    res.status(200).json({ totalBudget });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// 2. Summation of all expense transaction amounts by a user in a month
const sumMonthlyExpenses = async (req, res) => {
  const userId = req.user._id;
  const { monthYear } = req.params;

  try {
    const startDate = moment
      .utc(monthYear, "MM-YYYY")
      .startOf("month")
      .toDate();
    const endDate = moment.utc(monthYear, "MM-YYYY").endOf("month").toDate();

    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
    ]);
    const totalExpenses =
      transactions.length > 0 ? transactions[0].totalExpenses : 0;
    res.status(200).json({ totalExpenses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// 3. Summation of all expense transaction amounts by a user in a year
const sumYearlyExpenses = async (req, res) => {
  const userId = req.user._id;
  const { year } = req.params;

  try {
    const startDate = moment.utc(year, "YYYY").startOf("year").toDate();
    const endDate = moment.utc(year, "YYYY").endOf("year").toDate();

    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
    ]);
    const totalExpenses =
      transactions.length > 0 ? transactions[0].totalExpenses : 0;
    res.status(200).json({ totalExpenses });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// 4. Summation of all income transaction amounts by a user in a month
const sumMonthlyIncome = async (req, res) => {
  const userId = req.user._id;
  const { monthYear } = req.params;

  try {
    const startDate = moment
      .utc(monthYear, "MM-YYYY")
      .startOf("month")
      .toDate();
    const endDate = moment.utc(monthYear, "MM-YYYY").endOf("month").toDate();

    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "income",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
    ]);
    const totalIncome =
      transactions.length > 0 ? transactions[0].totalIncome : 0;
    res.status(200).json({ totalIncome });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// 5. Summation of all income transaction amounts by a user in a year
const sumYearlyIncome = async (req, res) => {
  const userId = req.user._id;
  const { year } = req.params;

  try {
    const startDate = moment.utc(year, "YYYY").startOf("year").toDate();
    const endDate = moment.utc(year, "YYYY").endOf("year").toDate();

    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "income",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: null, totalIncome: { $sum: "$amount" } } },
    ]);
    const totalIncome =
      transactions.length > 0 ? transactions[0].totalIncome : 0;
    res.status(200).json({ totalIncome });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// 6. Summation of all expense transaction per category by a user in a month
const sumMonthlyExpensesByCategory = async (req, res) => {
  const userId = req.user._id;
  const { monthYear } = req.params;

  try {
    const startDate = moment
      .utc(monthYear, "MM-YYYY")
      .startOf("month")
      .toDate();
    const endDate = moment.utc(monthYear, "MM-YYYY").endOf("month").toDate();

    const expenses = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          categoryId: "$category._id",
          name: "$category.name",
          icon: "$category.icon",
          budgetAmount: "$category.budgetAmount",
          totalAmount: 1,
        },
      },
    ]);
    if (expenses.length === 0) {
      return res.status(200).json({
        message: `No transactions are recorded in the month of ${monthYear}`,
      });
    }

    res.status(200).json(expenses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// 7. Summation of all expense transaction per category by a user in a year
const sumYearlyExpensesByCategory = async (req, res) => {
  const userId = req.user._id;
  const { year } = req.params;

  try {
    const startDate = moment.utc(year, "YYYY").startOf("year").toDate();
    const endDate = moment.utc(year, "YYYY").endOf("year").toDate();

    const expenses = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          categoryId: "$category._id",
          name: "$category.name",
          icon: "$category.icon",
          totalAmount: 1,
        },
      },
    ]);

    if (expenses.length === 0) {
      return res.status(200).json({
        message: `No transactions are recorded in the year ${year}`,
      });
    }

    res.status(200).json(expenses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// 8. Forecast next month's expense
const forecastNextMonthExpense = async (req, res) => {
  const userId = req.user._id;
  const currentDate = moment.utc();

  const currentYear = currentDate.year();
  const startDate = moment.utc(currentYear, "YYYY").startOf("year").toDate();
  const endDate = currentDate.endOf("month").toDate();

  try {
    // Get total expenses for the current year
    const transactions = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      { $group: { _id: null, totalExpenses: { $sum: "$amount" } } },
    ]);
    const totalExpenses = transactions.length > 0 ? transactions[0].totalExpenses : 0;

    // Get the number of months with expense entries in the current year
    const monthCount = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    const monthCountValue = monthCount.length > 0 ? monthCount[0].count : 0;

    // Calculate projected expense for the next month
    const projectedExpense = monthCountValue > 0 ? totalExpenses / monthCountValue : 0;

    res.status(200).json({ projectedExpense });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  sumCategoryBudget,
  sumMonthlyExpenses,
  sumYearlyExpenses,
  sumMonthlyIncome,
  sumYearlyIncome,
  sumMonthlyExpensesByCategory,
  sumYearlyExpensesByCategory,
  forecastNextMonthExpense,
};