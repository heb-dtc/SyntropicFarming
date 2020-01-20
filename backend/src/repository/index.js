const { getAll, get } = require('./materialRepository');
const { getAllSpecies, getSpeciesById } = require('./speciesRepository');

const materialRepository = {
    getAll,
    get
}

const speciesRepository = {
    getAllSpecies,
    getSpeciesById
}

module.exports = {
    materialRepository,
    speciesRepository
}