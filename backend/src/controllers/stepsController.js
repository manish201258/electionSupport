const stepsData = require('../data/stepsData');

function getSteps(req, res) {
  const sorted = [...stepsData].sort((a, b) => a.step_no - b.step_no);
  res.json({ items: sorted });
}

module.exports = { getSteps };
