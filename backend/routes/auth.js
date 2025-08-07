const express = require('express');
const router = express.Router();
const { signup, login } = require('../controller/auth');

router.post('/login', login);  // POST request for login
router.post('/signup', signup);  // POST request for signup

module.exports = router;
