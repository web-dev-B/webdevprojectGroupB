const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createPost, getAllPosts, getPostsByUser } = require('../controllers/postController');

// Get all posts (public)
router.get('/post', getAllPosts);

// Create a new post (for logged-in user)
router.post('/', auth, createPost);

// Get posts (for logged-in user)
router.get('/posts/user', auth, getPostsByUser);

module.exports = router;
