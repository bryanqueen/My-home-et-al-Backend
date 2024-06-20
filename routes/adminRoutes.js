const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateAdmin = require('../middlewares/authenticateAdmin');

//Public Routes
router.post('/sign-up', adminController.signUp);
router.post('/sign-in', adminController.signIn);


//Private routes
router.post('/create-admin', authenticateAdmin, adminController.createEmployeeAdmin);
router.get('/get-admins', authenticateAdmin, adminController.getAllEmployeeAdmins);
router.get('/admins/:id', authenticateAdmin, adminController.getSingleAdminDetails);
router.delete('/:id', authenticateAdmin, adminController.deleteEmployeeAdmin);
router.put('/:id', authenticateAdmin, adminController.updateEmployeeAdminDetails);

//Extended Routes(private)
router.get('/all-users', authenticateAdmin, adminController.fetchAllUsers)


module.exports = router;