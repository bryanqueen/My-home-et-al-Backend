const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

//Public Routes
router.post('/', newsletterController.submitEmailForNewsLetter)


module.exports = router;