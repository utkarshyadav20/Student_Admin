 const pool = require('../db');
 
 const logout=(async(req,res)=>{
     try {
    const { jti, exp } = req.user;

    const expiresAt = new Date(exp * 1000);

    await pool.query(
      'INSERT INTO jwt_blacklist (jti, expires_at) VALUES ($1, $2)',
      [jti, expiresAt]
    );

    res.status(200).json({ msg: 'Successfully logged out' });
  }

  catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ msg: 'Server error during logout' });
  }
 })

 module.exports={
    logout
 }