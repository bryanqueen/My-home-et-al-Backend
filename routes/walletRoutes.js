const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authenticateUser = require('../middlewares/authenticateUsers')

//Private Route
router.get('/', walletController.getWallet);
// router.post('/create', authenticateUser, walletController.createWallet)
// router.get('/transactions', authenticateUser, walletController.getWalletTransactions);
module.exports = router;