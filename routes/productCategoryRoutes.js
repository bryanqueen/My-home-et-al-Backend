const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const productCategoryController = require('../controllers/productCategoryController');

//Public Routes

//Private Routes
router.post('/', authenticateAdmin, productCategoryController.createProductCategory)

module.exports = router;