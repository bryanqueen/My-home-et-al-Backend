const express = require('express');
const router = express.Router();
const suggestionController = require('../controllers/suggestionsController');

router.post('/populate-from-database', suggestionController.populateFromProductandCategories);

module.exports = router