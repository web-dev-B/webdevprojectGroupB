const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getHomePage, getUserInfo } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getUserInfo);
router.get('/auth', getHomePage);

module.exports = router;