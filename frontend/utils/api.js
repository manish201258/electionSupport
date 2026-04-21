const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

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
  const response = await fetch(
    `${API_BASE_URL}/api/timeline?region=${encodeURIComponent(region)}`
  );
  return parseJson(response);
}

export async function fetchFaq() {
  const response = await fetch(`${API_BASE_URL}/api/faq`);
  return parseJson(response);
}

export async function fetchSteps() {
  const response = await fetch(`${API_BASE_URL}/api/steps`);
  return parseJson(response);
}

export async function askAssistant(message, region = '') {
  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, region }),
  });
  return parseJson(response);
}
