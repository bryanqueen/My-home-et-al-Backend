const express = require('express');
const router = express.Router();
const authenticateUser = require('../middlewares/authenticateUsers')

//Private Route
router.post('/wallet')

module.exports = router