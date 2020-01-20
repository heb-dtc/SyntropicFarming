const { pool } = require('./database');

exports.getAllSpecies = async () => {
    const res = await pool.query('SELECT * from species')
    return res.rows;
}

exports.getSpeciesById = (id) => {
    return `species with id ${id}`
}