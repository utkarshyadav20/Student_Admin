const pool = require('../db');

const tokenCheck=(async(req,res)=>{
     try {
        const { jti } = req.user;
    
        const blacklistResult = await pool.query(
          'SELECT * FROM jwt_blacklist WHERE jti = $1',
          [jti]
        );
        if (blacklistResult.rows.length > 0) {
          return res.status(401).json({ msg: 'Token has been revoked. Please log in again.' });
        }
    
        res.status(200).json({ msg: 'Token is valid' });
      } catch (err) {
        console.error('Error checking token blacklist:', err.message);
        res.status(500).json({ msg: 'Internal server error' });
      }
})

module.exports={tokenCheck}