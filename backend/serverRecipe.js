// server.js
const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Configure the app
const app = express();
const port = process.env.PORT || 3000;

// Configure PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'recipe_website',
  password: 'root',
  port: 5432,
});

// Connect to PostgreSQL
pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// Configure file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../frontend/assets', 'uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/user', 'createRecipe.html'));
});

// API Routes
// 1. Create a new recipe
app.post('/api/posts', upload.single('image'), async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { name, serves, prep_time, cook_time, instructions,  } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Parse ingredients from JSON string
    let ingredients = [];
    if (req.body.ingredients) {
      try {
        ingredients = JSON.parse(req.body.ingredients);
      } catch (e) {
        console.error('Error parsing ingredients:', e);
      }
    }
    
    // Insert recipe with ingredients array
    const recipeResult = await client.query(
      'INSERT INTO posts (name, serves, prep_time, cook_time, instructions, image_path, ingredients) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_post',
      [name, serves, prep_time, cook_time, instructions, imagePath, ingredients]
    );
    
    const postId = recipeResult.rows[0].id_post;
    
    // This maintains the relationship for searching and ensures all ingredients are in the database
    if (ingredients && Array.isArray(ingredients)) {
      for (const ingredientName of ingredients) {
        // Check if ingredient exists
        let ingredientId;
        const existingIngredient = await client.query(
          'SELECT id_ingredient FROM ingredients WHERE name = $1',
          [ingredientName]
        );
        
        if (existingIngredient.rows.length > 0) {
          ingredientId = existingIngredient.rows[0].id_ingredient;
        } else {
          // Insert new ingredient
          const newIngredient = await client.query(
            'INSERT INTO ingredients (name) VALUES ($1) RETURNING id_ingredient',
            [ingredientName]
          );
          ingredientId = newIngredient.rows[0].id_ingredient;
        }
        
        // Link recipe with ingredient
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
});

// 2. Get all recipes
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Get a specific recipe
app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get recipe details
    const recipeResult = await pool.query('SELECT * FROM posts WHERE id_post = $1', [id]);
    
    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const recipe = recipeResult.rows[0];
    
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. Get all ingredients (for autocomplete)
app.get('/api/ingredients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ingredients ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. Search ingredients (for better autocomplete performance)
app.get('/api/ingredients/search', async (req, res) => {
  const { query } = req.query;
  
  try {
    let result;
    if (query) {
      // Search for ingredients that match the query
      result = await pool.query(
        'SELECT * FROM ingredients WHERE name ILIKE $1 ORDER BY name LIMIT 10',
        [`%${query}%`]
      );
    } else {
      // Return the first 10 ingredients if no query is provided
      result = await pool.query('SELECT * FROM ingredients ORDER BY name LIMIT 10');
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});