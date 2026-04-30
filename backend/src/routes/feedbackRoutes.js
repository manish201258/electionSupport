const express = require('express');
const { createFeedback, getFeedback } = require('../controllers/feedbackController');

const router = express.Router();

router.get('/', getFeedback);
router.post('/', createFeedback);

module.exports = router;