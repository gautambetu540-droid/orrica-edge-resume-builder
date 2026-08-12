import 'server-only';

/** Gemini-backed compatibility client used by all server-side resume AI routes. */
type ChatRequest = {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' | 'text' };
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
};

type GeminiResponse = {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
  error?: { message?: string; status?: string; code?: number };
};

let configured = false;

function getApiKey() {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new Error('GEMINI_API_KEY is not configured on the server.');
  return key;
}

export const AI_MODEL = process.env.GEMINI_RESUME_MODEL || process.env.GEMINI_MODEL || 'gemini-3.6-flash';

async function generateContent(request: ChatRequest) {
  const apiKey = getApiKey();
  const configuredModel = (request.model || AI_MODEL).replace(/^models\//, '').trim();
  const models = [configuredModel, 'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash'].filter((x, i, a) => x && a.indexOf(x) === i);
  const systemMessage = request.messages.find((message) => message.role === 'system');
  const contents = request.messages.filter((message) => message.role !== 'system').map((message) => ({ role: message.role === 'assistant' ? 'model' : 'user', parts: [{ text: message.content }] }));
  if (!contents.length) contents.push({ role: 'user', parts: [{ text: '' }] });

  // Gemini 3.x rejects deprecated sampling parameters such as temperature.
  // Do not send temperature/top_p/top_k; maxOutputTokens remains supported.
  const generationConfig: Record<string, unknown> = { maxOutputTokens: request.max_tokens ?? 1200 };
  if (request.response_format?.type === 'json_object') generationConfig.responseMimeType = 'application/json';

  let lastMessage = 'Gemini API request failed.';
  for (const model of models) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({ systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined, contents, generationConfig }),
      cache: 'no-store', signal: AbortSignal.timeout(25000),
    });
    const data = (await response.json().catch(() => ({}))) as GeminiResponse;
    if (response.ok) {
      const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim();
      if (text) return { choices: [{ message: { content: text } }] };
      lastMessage = `Gemini returned no text${data.candidates?.[0]?.finishReason ? ` (${data.candidates[0].finishReason})` : ''}.`;
    } else {
      lastMessage = data.error?.message || `Gemini API request failed with status ${response.status}.`;
      if (![400, 404, 429, 500, 502, 503].includes(response.status)) break;
    }
  }
  throw new Error(`Gemini API error: ${lastMessage}`);
}

export function getOpenAI() {
  if (!configured) { getApiKey(); configured = true; }
  return { chat: { completions: { create: generateContent } } };
}
