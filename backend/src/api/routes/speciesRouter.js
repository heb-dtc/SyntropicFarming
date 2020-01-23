const router = require('express').Router();
const {getSpecies, getSpeciesSchema} = require('../controllers/speciesController');

router
    .get('/', getSpecies)
    .get('/schema/:speciesId', getSpeciesSchema);

module.exports = router;