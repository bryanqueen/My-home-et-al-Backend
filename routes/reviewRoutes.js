const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authenticateUsers');
const reviewController = require('../controllers/reviewController');


//Public Routes
router.post('/', authenticateUser,reviewController.createReview)

module.exports = router;
