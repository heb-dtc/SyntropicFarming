const router = require('express').Router();
const { getLocations } = require('../controllers/locationController');

router.get('/', getLocations);

module.exports = router;