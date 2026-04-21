const express = require('express');
const { getTimeline } = require('../controllers/timelineController');

const router = express.Router();

router.get('/', getTimeline);

module.exports = router;
