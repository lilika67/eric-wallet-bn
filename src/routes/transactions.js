const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Get all transactions
router.get("/", transactionController.getTransactions);

// Add new transaction
router.post("/", transactionController.addTransaction);

// Get transactions by date range
router.get("/date-range", transactionController.getTransactionsByDateRange);

// Get transaction summary
router.get("/summary", transactionController.getTransactionSummary);

// Delete transaction
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
