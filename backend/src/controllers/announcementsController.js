const announcementsData = require('../data/announcementsData');

function getAnnouncements(req, res) {
  const region = (req.query.region || 'national').toLowerCase();

  const items = announcementsData
    .filter((item) => item.region === 'national' || item.region === region)
    .map((item) => ({ ...item }))
    .sort((a, b) => a.title.localeCompare(b.title));

  res.json({ items, selectedRegion: region });
}

module.exports = { getAnnouncements };