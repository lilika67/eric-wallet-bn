const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

// Get all accounts
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().sort({ name: 1 });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new account
exports.createAccount = async (req, res) => {
  try {
    const { name, type, balance, currency, description, color, icon } =
      req.body;
    const account = new Account({
      name,
      type,
      balance,
      currency,
      description,
      color,
      icon,
    });
    await account.save();
    res.status(201).json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update account
exports.updateAccount = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    account.name = name || account.name;
    account.description = description || account.description;
    account.color = color || account.color;
    account.icon = icon || account.icon;

    await account.save();
    res.json(account);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Check if account has transactions
    const hasTransactions = await Transaction.exists({ account: account._id });
    if (hasTransactions) {
      return res
        .status(400)
        .json({ message: "Cannot delete account with transactions" });
    }

    await account.remove();
    res.json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get account balance history
exports.getAccountBalanceHistory = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const account = await Account.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const transactions = await Transaction.find({
      account: account._id,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: 1 });

    let balance = account.balance;
    const balanceHistory = transactions.map((transaction) => {
      balance +=
        transaction.type === "expense"
          ? -transaction.amount
          : transaction.amount;
      return {
        date: transaction.date,
        balance,
        transaction,
      };
    });

    res.json(balanceHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
