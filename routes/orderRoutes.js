const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateUser = require('../middlewares/authenticateUsers');
const authenticateAdmin = require('../middlewares/authenticateAdmin');




//Private Routes
router.post('/create-order', authenticateUser, orderController.createOrder);;
router.get('/purchase-history', authenticateUser, orderController.getUserPurchaseHistory);
router.put('/update-status', authenticateAdmin, orderController.updateOrderStatusToCompleted )

//public Routes
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getSingleOrder);

module.exports = router;