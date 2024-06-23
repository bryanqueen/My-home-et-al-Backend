const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authenticateUser = require('../middlewares/authenticateUsers')

//Private Route
router.post('/create/:id', walletController.createWallet)

module.exports = router;