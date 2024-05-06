const express = require('express');
const {Router} = express;
const router = Router();
const productController = require('../controllers/productController');
const authenticateUser = require('../middlewares/authenticateUsers');
const authenticateAdmin = require('../middlewares/authenticateAdmin')

//Private Routes
router.post('/', authenticateAdmin, productController.createSingleProduct);
router.post('/', authenticateAdmin, productController.bulkCreateProduct);
router.put('/:id', authenticateAdmin, productController.editProduct);
router.delete('/:id', authenticateAdmin, productController.deleteProduct)


//Public Routes
router.get('/:id', productController.viewProductsByCategory);
router.get('/:id', productController.getSingleProductDetails);
router.get()


module.exports = router;