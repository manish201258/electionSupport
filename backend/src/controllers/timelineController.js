const timelineData = require('../data/timelineData');
const { normalizeRegion, supportedRegions } = require('../data/regions');

function getTimeline(req, res) {
  const region = normalizeRegion(req.query.region);

  if (
    typeof req.query.region === 'string' &&
    !supportedRegions.includes(req.query.region.trim().toLowerCase())
  ) {
    return res.status(400).json({
      error: `Unsupported region. Use one of: ${supportedRegions.join(', ')}`,
    });
  }

  const data = timelineData
    .filter((item) => item.region === 'national' || item.region === region)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  res.json({ items: data, selectedRegion: region });
}

module.exports = { getTimeline };
