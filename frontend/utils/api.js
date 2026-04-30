const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const apiCache = new Map();

async function withCache(cacheKey, loader, ttlMs = 2 * 60 * 1000) {
  const now = Date.now();
  const cached = apiCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.promise;
  }

  const promise = loader().catch((error) => {
    apiCache.delete(cacheKey);
    throw error;
  });

  apiCache.set(cacheKey, { expiresAt: now + ttlMs, promise });
  return promise;
}

async function parseJson(response) {
  if (!response.ok) {
    let message = 'Request failed';
    try {
      const data = await response.json();
      message = data.error || message;
    } catch {
      // Ignore JSON parse failures for non-JSON error responses.
    }
    throw new Error(message);
  }
  return response.json();
}

export async function fetchTimeline(region = 'national') {
  const key = `timeline:${region}`;
  return withCache(key, async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/timeline?region=${encodeURIComponent(region)}`
    );
    return parseJson(response);
  });
}

export async function fetchFaq() {
  return withCache('faq', async () => {
    const response = await fetch(`${API_BASE_URL}/api/faq`);
    return parseJson(response);
  });
}

export async function fetchSteps() {
  return withCache('steps', async () => {
    const response = await fetch(`${API_BASE_URL}/api/steps`);
    return parseJson(response);
  });
}

export async function askAssistant(message, region = '') {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, region }),
  });
  return parseJson(response);
}

export function __clearApiCacheForTests() {
  apiCache.clear();
}
