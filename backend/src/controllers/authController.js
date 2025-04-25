const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
require('dotenv').config();

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await pool.query(
      'SELECT * FROM account WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO account (username, email, password) VALUES ($1, $2, $3) RETURNING username, email, password',
      [username, email, hashedPassword]
    );

    const payload = {
      user: {
        account_id: newUser.rows[0].account_id,
        username: newUser.rows[0].username,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      'SELECT * FROM account WHERE email = $1',
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = {
      user: {
        account_id: user.rows[0].account_id,
        username: user.rows[0].username,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getHomePage = async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT account_id, username, email FROM account WHERE account_id = $1',
      [req.user.account_id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT account_id, username, email FROM account WHERE account_id = $1',
      [req.user.account_id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


module.exports = {
  registerUser,
  loginUser,
  getHomePage,
  getUserInfo
};