const { pool } = require('./database');

exports.getAllProcesses = async () => {
    const res = await pool.query('SELECT * from processes')
    return res.rows;
}