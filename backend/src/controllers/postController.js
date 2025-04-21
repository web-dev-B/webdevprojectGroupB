const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createPost = async (req, res) => {
    try {
      const { recipeName, type, serves, prep, cook, image, ingredients, instruction } = req.body;
  
      const user = req.user; 
  
      const newPost = await pool.query(
        'INSERT INTO post (recipeName, type, serves, prep, cook, image, ingredients, instruction, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [recipeName, type, serves, prep, cook, image, ingredients, instruction, user.account_id]
      );
  
      res.status(201).json({
        msg: 'Post created successfully!',
        username: req.user.username,
        post: newPost.rows[0],
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };
  

const getAllPosts = async (req, res) => {
  try {
    const posts = await pool.query('SELECT * FROM post');
    res.json(posts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getPostsByUser = async (req, res) => {
  try {
    const user = req.user;
    const posts = await pool.query('SELECT * FROM post WHERE account_id = $1', [user.account_id]);
    res.json(posts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostsByUser,
};
