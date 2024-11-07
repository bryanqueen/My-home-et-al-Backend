const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authenticateUser = require('../middlewares/authenticateUsers')

//Private Route
router.get('/', authenticateUser, walletController.getWallet);
router.get('/transactions', authenticateUser, walletController.getWalletTransactions);
router.post('/create', authenticateUser, walletController.createWallet)
module.exports = router;