function buildSystemPrompt() {
  return [
    'You are an election education assistant.',
    'Explain in simple language and step-by-step.',
    'Use India election context only.',
    'Use accurate India voting terms: EVM and VVPAT (not paper ballot for standard elections).',
    'Do not invent exact legal rules or dates; if uncertain, tell user to verify on official ECI/NVSP sources.',
    'Keep answers concise and practical.',
    'Output format: short heading, then numbered steps (1., 2., 3.), then one-line source guidance.',
    'If user asks unrelated political propaganda, redirect to neutral educational guidance.',
  ].join(' ');
}

function fallbackAnswer(userMessage) {
  const lower = userMessage.toLowerCase();

  if (lower.includes('eligibility') || lower.includes('age')) {
    return [
      'Eligibility in India is simple:',
      '1. You must be an Indian citizen.',
      '2. You must be 18 years or older.',
      '3. Your name must be on the electoral roll of your constituency.',
      '4. If missing, apply through the voter services portal before the deadline.',
    ].join('\n');
  }

  if (lower.includes('how to vote') || lower.includes('voting process')) {
    return [
      'Voting process in easy steps:',
      '1. Verify your name on the voter list.',
      '2. Visit your assigned polling booth with valid ID.',
      '3. Complete identity verification by polling staff.',
      '4. Cast your vote on EVM and verify VVPAT.',
      '5. Collect voter slip updates and follow official result announcements.',
    ].join('\n');
  }

  return [
    'Election process in India (high level):',
    '1. Election schedule is announced by ECI.',
    '2. Candidates file nominations and scrutiny happens.',
    '3. Campaigning takes place within legal limits.',
    '4. Citizens vote at polling booths on election day.',
    '5. Votes are counted and results are declared.',
  ].join('\n');
}

function trustedDirectAnswer(userMessage) {
  const lower = userMessage.toLowerCase();

  if (lower.includes('how to vote') || lower.includes('voting process')) {
    return [
      'Voting in India: Step-by-step',
      '1. Check your name in the electoral roll before election day.',
      '2. Go to your assigned polling station with valid photo ID (EPIC or approved document).',
      '3. Polling staff verifies your identity and marks your finger with indelible ink.',
      '4. Cast your vote on the EVM by pressing your chosen candidate button.',
      '5. Verify the candidate slip shown briefly on VVPAT screen.',
      '6. Exit after voting and follow official ECI updates for results.',
      'Source guidance: Verify latest instructions on ECI and NVSP portals.',
    ].join('\n');
  }

  if (lower.includes('eligibility') || lower.includes('who can vote') || lower.includes('age')) {
    return [
      'Voter eligibility in India',
      '1. You must be an Indian citizen.',
      '2. You must be 18 years or older on the qualifying date.',
      '3. Your name must be included in the electoral roll of your constituency.',
      '4. If details are missing or incorrect, apply for correction before deadlines.',
      'Source guidance: Check rules on ECI and NVSP portals.',
    ].join('\n');
  }

  if (lower.includes('timeline') || lower.includes('election process')) {
    return [
      'Election process timeline in India',
      '1. Election schedule announcement by ECI.',
      '2. Candidate nomination filing.',
      '3. Scrutiny and withdrawal period.',
      '4. Campaign period under Model Code of Conduct.',
      '5. Polling day voting through EVM/VVPAT.',
      '6. Counting of votes and result declaration.',
      'Source guidance: Refer to official ECI notifications for exact dates.',
    ].join('\n');
  }

  return null;
}

async function callAiAssistant(userMessage) {
  const direct = trustedDirectAnswer(userMessage);
  if (direct) {
    return direct;
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl =
    process.env.GROQ_BASE_URL || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = process.env.GROQ_MODEL || process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    return fallbackAnswer(userMessage);
  }

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API failed with status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    return text || fallbackAnswer(userMessage);
  } catch (error) {
    return `${fallbackAnswer(userMessage)}\n\nNote: Live AI service is currently unavailable, so this response is from local guidance.`;
  }
}

module.exports = { callAiAssistant };
