import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getOpenAI, AI_MODEL } from '@/lib/ai/client';
import { CORE_RULES } from '@/lib/ai/prompts';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  jobTitle: z.string().optional().default(''),
  company: z.string().optional().default(''),
  rawText: z.string().min(1, 'rawText is required'),
  targetRole: z.string().optional().default(''),
  count: z.number().int().min(2).max(6).optional().default(4),
});

export async function POST(req: NextRequest) {
  try {
    // Supabase server client
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Rate limit per authenticated user, otherwise per IP
    const rateKey =
      user?.id ??
      req.headers.get('x-forwarded-for') ??
      'anonymous';

    const { allowed, retryAfterMs } = checkRateLimit(
      `generate-bullets:${rateKey}`
    );

    if (!allowed) {
      return NextResponse.json(
        {
          error:
            'Too many requests. Please wait a moment and try again.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              Math.ceil((retryAfterMs ?? 1000) / 1000)
            ),
          },
        }
      );
    }

    // Parse request body
    const body = await req.json();

    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid request body.',
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      jobTitle,
      company,
      rawText,
      targetRole,
      count,
    } = parsed.data;

    // OpenAI
    const openai = getOpenAI();

    const completion =
      await openai.chat.completions.create({
        model: AI_MODEL,
        temperature: 0.45,
        response_format: {
          type: 'json_object',
        },
        messages: [
          {
            role: 'system',
            content: `${CORE_RULES}

Return ONLY JSON:
{ "bullets": string[] }

Produce exactly ${count} bullet points.

Rules:
- Each bullet should start with a strong action verb
- Do not fabricate metrics
- Each bullet must be a single sentence
- Do not add trailing punctuation`,
          },
          {
            role: 'user',
            content: `Role: ${jobTitle || '(unspecified)'} at ${
              company || '(unspecified)'
            }${
              targetRole
                ? `\nTailor toward target role: ${targetRole}`
                : ''
            }

Raw responsibilities/notes from the user:
"""
${rawText}
"""`,
          },
        ],
        max_tokens: 500,
      });

    // Get AI response
    const raw =
      completion.choices[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        {
          error:
            'AI did not return a result. Please try again.',
        },
        { status: 502 }
      );
    }

    // Parse AI JSON
    let parsedResult: {
      bullets?: string[];
    };

    try {
      parsedResult = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          error:
            'AI returned an unexpected format. Please try again.',
        },
        { status: 502 }
      );
    }

    // Validate bullets
    if (!Array.isArray(parsedResult.bullets)) {
      return NextResponse.json(
        {
          error:
            'AI returned an unexpected format. Please try again.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      bullets: parsedResult.bullets,
    });
  } catch (err) {
    console.error('generate-bullets error:', err);

    return NextResponse.json(
      {
        error:
          'Something went wrong generating bullet points. Please try again.',
      },
      { status: 500 }
    );
  }
}
