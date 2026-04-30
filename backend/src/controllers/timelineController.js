const timelineData = require('../data/timelineData');

function getTimeline(req, res) {
  const region = (req.query.region || 'national').toLowerCase();

  const data = timelineData
    .filter((item) => item.region === 'national' || item.region === region)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  res.json({ items: data, selectedRegion: region });
}

module.exports = { getTimeline };
