const pool = require('../db');

const getCountries=(async(req,res)=>{
    try{
            const countriesQuery='SELECT * FROM tbl_countries';

            const countries=await pool.query(countriesQuery);
            res.json({
                countries:countries.rows
            })

    }catch(err){
        console.error('DATABASE ERROR in GET  /countires', err);
        res.status(500).json({ msg: 'Server error while fetching countries', error: err.message });
    }
})

module.exports={getCountries}
