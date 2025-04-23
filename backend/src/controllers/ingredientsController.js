const { pool } = require('../config/db');

const getAllIngredients = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ingredients ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchIngredients = async (req, res) => {
  const { query } = req.query;
  
  try {
    let result;
    if (query) {
      result = await pool.query(
        'SELECT * FROM ingredients WHERE name ILIKE $1 ORDER BY name LIMIT 10',
        [`%${query}%`]
      );
    } else {
      result = await pool.query('SELECT * FROM ingredients ORDER BY name LIMIT 10');
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllIngredients,
  searchIngredients
};