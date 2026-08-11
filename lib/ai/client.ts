import 'server-only';

/**
 * Gemini-backed compatibility client.
 *
 * The existing AI route handlers use the OpenAI chat-completions shape. Keeping
 * that small interface here lets all resume AI features (generate, rewrite,
 * summary, bullets, skills and job match) use the Gemini API without changing
 * every route at once.
 */

type ChatRequest = {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' | 'text' };
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
  error?: {
    message?: string;
    status?: string;
    code?: number;
  };
};

let configured = false;

function getApiKey() {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  return key;
}

export const AI_MODEL =
  process.env.GEMINI_RESUME_MODEL ||
  process.env.GEMINI_MODEL ||
  'gemini-3.6-flash';

async function generateContent(request: ChatRequest) {
  const apiKey = getApiKey();
  const model = request.model || AI_MODEL;

  const systemMessage = request.messages.find(
    (message) => message.role === 'system'
  );

  const contents = request.messages
    .filter((message) => message.role !== 'system')
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

  // Gemini expects at least one user content item.
  if (!contents.length) {
    contents.push({
      role: 'user',
      parts: [{ text: '' }],
    });
  }

  const generationConfig: Record<string, unknown> = {
    temperature: request.temperature ?? 0.4,
    maxOutputTokens: request.max_tokens ?? 1200,
  };

  if (request.response_format?.type === 'json_object') {
    generationConfig.responseMimeType = 'application/json';
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: systemMessage
          ? {
              parts: [{ text: systemMessage.content }],
            }
          : undefined,
        contents,
        generationConfig,
      }),
      cache: 'no-store',
    }
  );

  const data = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    const message =
      data.error?.message ||
      `Gemini API request failed with status ${response.status}.`;

    throw new Error(`Gemini API error: ${message}`);
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();

  if (!text) {
    const finishReason = data.candidates?.[0]?.finishReason;
    throw new Error(
      `Gemini returned no text${finishReason ? ` (${finishReason})` : ''}.`
    );
  }

  return {
    choices: [
      {
        message: {
          content: text,
        },
      },
    ],
  };
}

/**
 * Backward-compatible name used by the existing /api/ai routes.
 * It is now Gemini-backed, not OpenAI-backed.
 */
export function getOpenAI() {
  if (!configured) {
    getApiKey();
    configured = true;
  }

  return {
    chat: {
      completions: {
        create: generateContent,
      },
    },
  };
}
