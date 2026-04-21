const express = require('express');
const { getSteps } = require('../controllers/stepsController');

const router = express.Router();

router.get('/', getSteps);

module.exports = router;
