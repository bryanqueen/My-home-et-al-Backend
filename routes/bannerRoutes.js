const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { postBanner,
     updateBanner,
     getBanner,
     getOneBanner,
     deleteBanner } = require('../controllers/bannerController');
const upload = require('../config/multer')

router.post('/', authenticateAdmin, upload.single('banner'), postBanner);
router.put('/update/:id', authenticateAdmin, upload.single('banner'), updateBanner)
router.get('/all', authenticateAdmin, getBanner);
router.get('/:id', authenticateAdmin, getOneBanner);
router.delete('/delete/:id', authenticateAdmin, deleteBanner);


module.exports = router