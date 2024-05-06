const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const authenticateUser = require('../middlewares/authenticateUsers');

//Public Routes
router.post('/sign-up', userController.signUp);
router.post('/sign-in', userController.signIn);

//Private Routes
router.get('/:id',authenticateUser, userController.viewAccountProfile);
router.put('/edit-account', authenticateUser, userController.editAccountProfile);
router.delete('/delete-account', authenticateUser, userController.deleteAccount)

module.exports = router