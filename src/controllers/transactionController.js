const Transaction = require("../models/Transaction");
const Account = require("../models/Account");

// Get all transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("category", "name type")
      .populate("subCategory", "name")
      .populate("account", "name type")
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new transaction
exports.addTransaction = async (req, res) => {
  try {
    const { amount, type, category, subCategory, account, description, date } =
      req.body;

    // Create transaction
    const transaction = new Transaction({
      amount,
      type,
      category,
      subCategory,
      account,
      description,
      date: date || Date.now(),
    });

    // Update account balance
    const accountToUpdate = await Account.findById(account);
    accountToUpdate.balance += type === "income" ? amount : -amount;
    await accountToUpdate.save();

    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get transactions by date range
exports.getTransactionsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const transactions = await Transaction.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate("category", "name type")
      .populate("subCategory", "name")
      .populate("account", "name type")
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get transaction summary
exports.getTransactionSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const summary = await Transaction.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            type: "$type",
            category: "$category",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id.category",
          foreignField: "_id",
          as: "category",
        },
      },
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update account balance
    const account = await Account.findById(transaction.account);
    account.balance -=
      transaction.type === "income" ? transaction.amount : -transaction.amount;
    await account.save();

    await transaction.remove();
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
