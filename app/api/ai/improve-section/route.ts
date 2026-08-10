import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAI, AI_MODEL } from '@/lib/ai/client';
import { CORE_RULES } from '@/lib/ai/prompts';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const ACTIONS = [
  'rewrite',
  'make-professional',
  'make-concise',
  'ats-optimize',
  'generate-bullets',
  'make-ats-friendly',
  'shorten',
  'fix-grammar',
] as const;

const RequestSchema = z.object({
  section: z.enum(['summary', 'experience', 'project']),
  content: z.string().min(1, 'content is required'),
  action: z.enum(ACTIONS),
  targetRole: z.string().optional().default(''),
  context: z.string().optional().default(''),
});

const ACTION_INSTRUCTIONS: Record<(typeof ACTIONS)[number], string> = {
  rewrite:
    'Rewrite this content to be clearer and more compelling, preserving every fact exactly.',

  'make-professional':
    'Rewrite this in a more polished, professional tone suitable for a corporate resume.',

  'make-concise':
    'Make this significantly more concise while keeping all facts and key points.',

  'ats-optimize':
    'Rewrite this to be ATS-friendly: use standard section language, avoid graphics-dependent phrasing, and naturally include relevant keywords already implied by the content.',

  'generate-bullets':
    'Convert this into 2-5 strong, achievement-oriented bullet points starting with action verbs. Return each bullet on its own line, no numbering, no bullet characters.',

  'make-ats-friendly':
    'Rewrite as ATS-friendly bullet points, one per line, using standard resume phrasing and industry-relevant keywords already implied by the content.',

  shorten:
    'Shorten this to roughly half its current length while preserving the key facts.',

  'fix-grammar':
    'Fix grammar, spelling, and punctuation only. Do not change the meaning, tone, or facts.',
};

export async function POST(req: NextRequest) {
  try {
    // IMPORTANT: createClient() is async
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const rateKey =
      user?.id ??
      req.headers.get('x-forwarded-for') ??
      'anonymous';

    const { allowed, retryAfterMs } = checkRateLimit(
      `improve-section:${rateKey}`
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
      section,
      content,
      action,
      targetRole,
      context,
    } = parsed.data;

    const instruction = ACTION_INSTRUCTIONS[action];

    const openai = getOpenAI();

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content: `${CORE_RULES}

You are editing the "${section}" section of a resume.

Output ONLY the improved text.
Do not add a preamble.
Do not use quotes.
Do not add explanations.`,
        },
        {
          role: 'user',
          content: `${instruction}
${
  targetRole
    ? `Target role: ${targetRole}\n`
    : ''
}${
  context
    ? `Context: ${context}\n`
    : ''
}
Original content:
"""
${content}
"""`,
        },
      ],
      max_tokens: 700,
    });

    const improved =
      completion.choices[0]?.message?.content?.trim();

    if (!improved) {
      return NextResponse.json(
        {
          error:
            'AI did not return a result. Please try again.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      original: content,
      improved,
    });
  } catch (err) {
    console.error('improve-section error:', err);

    return NextResponse.json(
      {
        error:
          'Something went wrong improving this section. Please try again.',
      },
      { status: 500 }
    );
  }
}
