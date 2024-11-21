const express = require('express');
const {Router} = express;
const router = Router();
const productController = require('../controllers/productController');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const upload = require('../config/multer');


//Private Routes
router.post('/create-product', authenticateAdmin, upload.array('images', 10), productController.createSingleProduct);
router.post('/bulk-create', authenticateAdmin, productController.bulkCreateProduct);
router.post('/bulk-publish', authenticateAdmin, productController.bulkPublishProduct);
router.get('/all-products', authenticateAdmin, productController.fetchAllProducts)
router.delete('/bulk-delete', authenticateAdmin, productController.bulkDeleteProducts);
router.put('/:id', upload.array('images', 10), authenticateAdmin, productController.editProduct);
router.delete('/:id', authenticateAdmin, productController.deleteProduct);


//Public Routes
router.get('/category/:id', productController.viewProductsByCategory);
router.get('/:id', productController.getSingleProductDetails);
router.post('/index-products', productController.indexAllProducts);
router.post('/add-subcat', productController.updateSubCategories);
router.get('/advanced-search', productController.advancedSearchForProduct);


//Test Route



module.exports = router;