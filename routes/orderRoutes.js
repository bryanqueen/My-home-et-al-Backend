const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateUser = require('../middlewares/authenticateUsers')

//public Routes

//Private Routes
router.post('/create-order', authenticateUser, orderController.createOrder)

module.exports = router;