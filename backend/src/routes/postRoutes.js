const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostsByUser } = require('../controllers/postController');
const authenticate = require('../middleware/authMiddleware');

// Get all posts (public)
router.get('/posts', getAllPosts);

// Create a new post (for logged-in user)
router.post('/posts', authenticate, createPost);

// Get posts (for logged-in user)
router.get('/posts/user', authenticate, getPostsByUser);

module.exports = router;
