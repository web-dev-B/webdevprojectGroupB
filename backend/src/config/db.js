const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized:false,
  }
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Connected to database');
  } catch (err) {
    console.error('Error connecting to database', err.message);
  }
};

module.exports = { pool, connectDB };
//dbedit