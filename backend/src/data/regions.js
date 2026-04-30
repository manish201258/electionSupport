const supportedRegions = ['national', 'rajasthan', 'maharashtra', 'karnataka'];

function normalizeRegion(region) {
  if (typeof region !== 'string') {
    return 'national';
  }

  const normalized = region.trim().toLowerCase();
  return supportedRegions.includes(normalized) ? normalized : 'national';
}

function isSupportedRegion(region) {
  return supportedRegions.includes(normalizeRegion(region));
}

module.exports = {
  supportedRegions,
  normalizeRegion,
  isSupportedRegion,
};