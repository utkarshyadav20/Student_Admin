const jwt = require('jsonwebtoken');
require('dotenv').config();
const pool = require('../db');

module.exports = async function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, auth denied' });

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { jti } = decoded;

    const blacklistResult = await pool.query(
      'SELECT * FROM jwt_blacklist WHERE jti = $1',
      [jti]
    );

    if (blacklistResult.rows.length > 0) {
      return res.status(401).json({ msg: 'Token has been revoked. Please log in again.' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid'});
  }
};
