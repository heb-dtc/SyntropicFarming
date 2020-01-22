const { getAll, get } = require('./materialRepository');
const { getAllSpecies, getSpeciesById } = require('./speciesRepository');
const { getAllLocations } = require('./locationRepository');
const { getAllProcesses } = require('./processRepository');

const materialRepository = {
    getAll,
    get
}

const speciesRepository = {
    getAllSpecies,
    getSpeciesById
}

const processRepository = {
    getAllProcesses
}

const locationRepository = {
    getAllLocations
}

module.exports = {
    materialRepository,
    speciesRepository,
    processRepository,
    locationRepository
}