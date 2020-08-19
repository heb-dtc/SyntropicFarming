const { pool } = require('./database');

exports.getAllLocations = async () => {
    const res = await pool.query('SELECT * from climates')
    return res.rows;
}