const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Get all accounts
router.get('/', accountController.getAccounts);

// Create new account
router.post('/', accountController.createAccount);

// Update account
router.put('/:id', accountController.updateAccount);

// Delete account
router.delete('/:id', accountController.deleteAccount);

// Get account balance history
router.get('/:id/balance-history', accountController.getAccountBalanceHistory);

module.exports = router; 