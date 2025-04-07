const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getHomePage } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/auth', getHomePage);

module.exports = router;