const express = require('express');
const router = express.Router();
const { upload, createPost, getAllPosts, getPostById } = require('../controllers/postsController');

router.post('/', upload, createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);

module.exports = router;