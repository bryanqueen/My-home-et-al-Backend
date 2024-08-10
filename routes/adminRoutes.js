const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const upload = require('../config/multer')

//Public Routes
router.post('/sign-up', adminController.signUp);
router.post('/sign-in', adminController.signIn);


//Private routes
router.post('/create-admin', upload.single('admin-image'), authenticateAdmin, adminController.createEmployeeAdmin);
router.get('/get-admins', authenticateAdmin, adminController.getAllEmployeeAdmins);
router.get('/:id', authenticateAdmin, adminController.getSingleAdminDetails);
router.delete('/:id', authenticateAdmin, adminController.deleteEmployeeAdmin);
router.put('/:id', upload.single('admin-image'), authenticateAdmin, adminController.updateEmployeeAdminDetails);
router.patch('/activate/:id', authenticateAdmin, adminController.activateEmployeeAdmin);
router.patch('/deactivate/:id', authenticateAdmin, adminController.deactivateEmployeeAdmin);

//Extended Routes(private)

router.get('/all-users/:id', authenticateAdmin, adminController.getSingleUserDetails);


module.exports = router;