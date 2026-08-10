// SERVER-ONLY. Never import this from a client component — it reads the
// secret OPENAI_API_KEY. All AI calls must go through /api/ai/* route
// handlers, which run on the server.
import 'server-only';
import OpenAI from 'openai';

let _client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured on the server.');
  }
  if (!_client) {
    _client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _client;
}

export const AI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
