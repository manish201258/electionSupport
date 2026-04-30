const faqData = require('../data/faqData');

function getFaq(req, res) {
  res.json({ items: faqData });
}

module.exports = { getFaq };
