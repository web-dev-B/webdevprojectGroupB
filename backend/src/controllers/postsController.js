const { pool } = require('../config/db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../frontend/assets', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).single('image');

const createPost = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const accountId = req.user.account_id;
    
    const { name, type, serves, prep_time, cook_time, instructions } = req.body;
    const imagePath = req.file ? `../../assets/uploads/${req.file.filename}` : null;
    
    let ingredients = [];
    if (req.body.ingredients) {
      try {
        ingredients = JSON.parse(req.body.ingredients);
      } catch (e) {
        console.error('Error parsing ingredients:', e);
      }
    }
    
    const recipeResult = await client.query(
      'INSERT INTO posts (name, type, serves, prep_time, cook_time, instructions, image_path, ingredients, account_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_post',
      [name, type, serves, prep_time, cook_time, instructions, imagePath, ingredients, accountId]
    );
    
    const postId = recipeResult.rows[0].id_post;
    
    if (ingredients && Array.isArray(ingredients)) {
      for (const ingredientName of ingredients) {
        let ingredientId;
        const existingIngredient = await client.query(
          'SELECT id_ingredient FROM ingredients WHERE name = $1',
          [ingredientName]
        );
        
        if (existingIngredient.rows.length > 0) {
          ingredientId = existingIngredient.rows[0].id_ingredient;
        } else {
          const newIngredient = await client.query(
            'INSERT INTO ingredients (name) VALUES ($1) RETURNING id_ingredient',
            [ingredientName]
          );
          ingredientId = newIngredient.rows[0].id_ingredient;
        }
        
        await client.query(
          'INSERT INTO post_ingredients (post_id, ingredient_id) VALUES ($1, $2)',
          [postId, ingredientId]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      postId
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  } finally {
    client.release();
  }
};

const getAllPosts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts'); //ORDER BY created_at DESC
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  
  console.log(`Fetching posts for user ID: ${id}`); // Debugging: log user ID

  try {
    // Ensure the field name matches your table's schema
    const recipeResult = await pool.query('SELECT * FROM posts WHERE account_id = $1', [id]);
    
    if (recipeResult.rows.length === 0) {
      console.log('No posts found for user ID:', id); // Debugging: log when no posts are found
      return res.status(404).json({ error: 'No posts found for this user' });
    }
    
    const recipe = recipeResult.rows;
    console.log('Posts fetched:', recipe); // Debugging: log the fetched posts
    
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  upload,
  createPost,
  getAllPosts,
  getPostById
};