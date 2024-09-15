const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authenticateUsers');
const paymentController = require('../controllers/paymentController');

//Private Route
router.post('/wallet', authenticateUser, paymentController.makeWalletPayment );
router.put('/spay', authenticateUser, paymentController.UpdateOrderStatusWithSpayorRexpay);
router.post('/rexpay/initiate', paymentController.initiateRexpayPayment);

module.exports = router