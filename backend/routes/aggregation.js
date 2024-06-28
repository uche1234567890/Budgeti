const express = require("express");
const router = express.Router();
const {
  sumCategoryBudget,
  sumMonthlyExpenses,
  sumYearlyExpenses,
  sumMonthlyIncome,
  sumYearlyIncome,
  sumMonthlyExpensesByCategory,
  sumYearlyExpensesByCategory
} = require("../controllers/aggregationController");
const userAuth = require("../middlewares/userAuthMiddleware");

// Summation of budgetAmount from all categories for a user
router.get("/sum-category-budget", userAuth, sumCategoryBudget);

// Summation of all expense transaction amounts by a user in a month
router.get("/sum-monthly-expenses/:monthYear", userAuth, sumMonthlyExpenses);

// Summation of all expense transaction amounts by a user in a year
router.get("/sum-yearly-expenses/:year", userAuth, sumYearlyExpenses);

// Summation of all income transaction amounts by a user in a month
router.get("/sum-monthly-income/:monthYear", userAuth, sumMonthlyIncome);

// Summation of all income transaction amounts by a user in a year
router.get("/sum-yearly-income/:year", userAuth, sumYearlyIncome);

// Summation of all expense transaction per category by a user in a month
router.get("/sum-monthly-expenses-by-category/:monthYear", userAuth, sumMonthlyExpensesByCategory);

// Summation of all expense transaction per category by a user in a year
router.get("/sum-yearly-expenses-by-category/:year", userAuth, sumYearlyExpensesByCategory);

module.exports = router;