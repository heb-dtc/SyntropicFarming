const router = require('express').Router();
const { getMaterials, addMaterial } = require('../controllers/materialController');

router.get('/', getMaterials);
router.get('/add', addMaterial);

module.exports = router;