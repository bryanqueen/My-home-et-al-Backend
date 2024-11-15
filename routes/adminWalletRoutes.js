const express =  require('express');
const router = express.Router();
const adminWalletController = require('../controllers/adminWalletController');
const authenticateAdmin = require('../middlewares/authenticateAdmin');

//Private Route
router.post('/create', authenticateAdmin, adminWalletController.createWallet);
router.get('/', authenticateAdmin, adminWalletController.getAdminWalletDetails);
router.get('/transactions', authenticateAdmin, adminWalletController.getAdminWalletTransactions);
router.post('/withdraw', authenticateAdmin, adminWalletController.withdraw);
router.get('/sales', authenticateAdmin, adminWalletController.getTotalSales);
router.get('/revenue', authenticateAdmin, adminWalletController.getTotalRevenue);
router.get('/withdrawals', authenticateAdmin, adminWalletController.getTotalWithdrawal);

module.exports = router;