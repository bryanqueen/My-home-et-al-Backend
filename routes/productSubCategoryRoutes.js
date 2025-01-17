const express = require ('express');
const router = express.Router();
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { createProductSubCategory,
        getProductSubCategory,
        getOneSubCategory,
        updateSubCategory, 
        deleteSubCategory } = require('../controllers/productSubCategoryController');
        
const upload = require('../config/multer');

// Admin routes
router.post('/create', authenticateAdmin, upload.single('subCategoryImage'), createProductSubCategory)
router.put('/update/:id', authenticateAdmin, upload.single('subCategoryImage'), updateSubCategory)
router.delete('/delete/:id', authenticateAdmin, deleteSubCategory)


// public routes
router.get('/all', getProductSubCategory)
router.get('/:id', getOneSubCategory)



module.exports = router;