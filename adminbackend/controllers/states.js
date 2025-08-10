const pool = require('../db');

const getStates = (async (req, res) => {

    try {
        const { countryId } = req.query;
        const statesQuery = 'SELECT * FROM tbl_states WHERE "countryId"=$1 '
        const states = await pool.query(statesQuery, [countryId]);
        res.json({
            states: states.rows
        })
    } catch (err) {
        console.error('DATABASE ERROR in GET  /States', err);
        res.status(500).json({ msg: 'Server error while fetching states', error: err.message });

    }
})
module.exports={getStates};
