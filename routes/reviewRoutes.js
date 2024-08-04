const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authenticateUsers');
const reviewController = require('../controllers/reviewController');

//Public Routes
router.get('/:id', reviewController.getReviews);

//Private
router.post('/:id', authenticateUser, reviewController.createReview)

module.exports = router;
