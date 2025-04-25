const express = require('express');
const router = express.Router();
const { upload, createPost, getAllPosts, getPostById } = require('../controllers/postsController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, upload, createPost);
router.get('/', getAllPosts);
router.get('/user/:id', getPostById);

module.exports = router;