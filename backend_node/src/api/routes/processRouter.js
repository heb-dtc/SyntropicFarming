const router = require('express').Router();
const { getProcesses } = require('../controllers/processController');

router.get('/', getProcesses);

module.exports = router;