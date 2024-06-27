const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const productCategoryController = require('../controllers/productCategoryController');
const upload = require('../config/multer');

//Public Routes
router.get('/categories', productCategoryController.getProductCategories);
router.get('/top-categories', productCategoryController.getTopProductCategories);

//Private Routes
router.post('/', authenticateAdmin, upload.single('category-image'), productCategoryController.createProductCategory);
router.put('/edit-category/:id', authenticateAdmin, upload.single('category-image'), productCategoryController.editProductCategory);


module.exports = router;