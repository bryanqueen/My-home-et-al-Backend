const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authenticateUser = require('../middlewares/authenticateUsers');


//Private Routes
router.post('/', authenticateUser, addressController.createAddress);
router.get('/', authenticateUser, addressController.getAddresses);
router.put('/', authenticateUser, addressController.editAddress);
router.delete('/', authenticateUser, addressController.deleteAddress);

module.exports = router;