const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// Get all budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find()
      .populate("category", "name type")
      .sort({ startDate: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new budget
exports.createBudget = async (req, res) => {
  try {
    const {
      category,
      amount,
      period,
      startDate,
      endDate,
      notificationThreshold,
    } = req.body;
    const budget = new Budget({
      category,
      amount,
      period,
      startDate,
      endDate,
      notificationThreshold,
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update budget spending
exports.updateBudgetSpending = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const transactions = await Transaction.find({
      category: budget.category,
      date: { $gte: budget.startDate, $lte: budget.endDate },
      type: "expense",
    });

    const currentSpending = transactions.reduce(
      (total, trans) => total + trans.amount,
      0
    );
    budget.currentSpending = currentSpending;

    // Check if spending exceeds threshold
    const spendingPercentage = (currentSpending / budget.amount) * 100;
    if (
      spendingPercentage >= budget.notificationThreshold &&
      !budget.isNotified
    ) {
      budget.isNotified = true;
      // Here you would typically trigger a notification
      // For now, we'll just include it in the response
      res.locals.notification = {
        message: `Budget alert: Spending has reached ${spendingPercentage.toFixed(
          1
        )}% of the budget`,
        threshold: budget.notificationThreshold,
        budgetId: budget._id,
      };
    }

    await budget.save();
    res.json({
      budget,
      notification: res.locals.notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get budget status
exports.getBudgetStatus = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id).populate(
      "category",
      "name type"
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    const transactions = await Transaction.find({
      category: budget.category,
      date: { $gte: budget.startDate, $lte: budget.endDate },
      type: "expense",
    });

    const status = {
      budget,
      totalSpent: transactions.reduce(
        (total, trans) => total + trans.amount,
        0
      ),
      remainingAmount: budget.amount - budget.currentSpending,
      spendingPercentage: (
        (budget.currentSpending / budget.amount) *
        100
      ).toFixed(1),
      transactions: transactions,
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
