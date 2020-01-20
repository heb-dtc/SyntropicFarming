const { pool } = require('./database');

exports.getAll = async () => {
    const res = await pool.query('SELECT * from materials')
    return res.rows;
}

exports.get = (id) => {
    return `material with id ${id}`
}