const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

// Get all budgets
router.get("/", budgetController.getBudgets);

// Create new budget
router.post("/", budgetController.createBudget);

// Update budget spending
router.put("/:id/spending", budgetController.updateBudgetSpending);

// Get budget status
router.get("/:id/status", budgetController.getBudgetStatus);

module.exports = router;
