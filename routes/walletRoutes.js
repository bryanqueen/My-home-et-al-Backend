const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authenticateUser = require('../middlewares/authenticateUsers')

//Private Route
router.post('/create', authenticateUser, walletController.createWallet)
router.get('/', authenticateUser, walletController.getWallet);
router.get('/transactions', authenticateUser, walletController.getWalletTransactions);
module.exports = router;