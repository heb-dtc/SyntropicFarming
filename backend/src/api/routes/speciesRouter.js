const router = require('express').Router();
const { getSpecies } = require('../controllers/speciesController');

router.get('/', getSpecies);

module.exports = router;