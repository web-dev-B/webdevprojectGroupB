const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  console.log('[AUTH MIDDLEWARE] Running...');
  
  const token = req.header('x-auth-token') || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
  console.log('[AUTH MIDDLEWARE] Token:', token);

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};