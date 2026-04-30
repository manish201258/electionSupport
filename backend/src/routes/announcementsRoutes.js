const express = require('express');
const { getAnnouncements } = require('../controllers/announcementsController');

const router = express.Router();

router.get('/', getAnnouncements);

module.exports = router;