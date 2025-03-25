const pool = require('../config/db');

exports.getUserById = (id) => {
  return pool.query('SELECT * FROM users WHERE id = $1', [id]);
};

exports.getUserByEmail = (email) => {
  return pool.query('SELECT * FROM users WHERE email = $1', [email]);
};

exports.createUser = (name, email, password) => {
  return pool.query(
    'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *',
    [name, email, password]
  );
};