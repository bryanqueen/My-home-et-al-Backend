const express =  require('express');
const router = express.Router();
const adminWalletController = require('../controllers/adminWalletController');
const authenticateAdmin = require('../middlewares/authenticateAdmin');

//Private Route
router.post('/create', authenticateAdmin, adminWalletController.createWallet)

module.exports = router;