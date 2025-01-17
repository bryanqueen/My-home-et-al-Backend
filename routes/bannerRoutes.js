const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { postBanner, updateBanner } = require('../controllers/bannerController');
const upload = require('../config/multer')

router.post('/', authenticateAdmin, upload.single('banner'), postBanner);
router.put('/update/:id', authenticateAdmin, upload.single('banner'), updateBanner)


module.exports = router