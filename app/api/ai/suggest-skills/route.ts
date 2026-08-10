import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAI, AI_MODEL } from '@/lib/ai/client';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  experience: z.array(z.record(z.any())).default([]),
  projects: z.array(z.record(z.any())).default([]),
  education: z.array(z.record(z.any())).default([]),
  existingSkills: z.array(z.string()).default([]),
  targetRole: z.string().optional().default(''),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const rateKey =
      user?.id ??
      req.headers.get('x-forwarded-for') ??
      'anonymous';

    const { allowed, retryAfterMs } = checkRateLimit(
      `suggest-skills:${rateKey}`
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
      experience,
      projects,
      education,
      existingSkills,
      targetRole,
    } = parsed.data;

    if (!experience.length && !projects.length) {
      return NextResponse.json(
        {
          error:
            'Add at least one experience or project entry so suggestions can be grounded in your real background.',
        },
        { status: 400 }
      );
    }

    const openai = getOpenAI();

    const completion =
      await openai.chat.completions.create({
        model: AI_MODEL,
        temperature: 0.3,
        response_format: {
          type: 'json_object',
        },
        messages: [
          {
            role: 'system',
            content: `Suggest resume skills that are clearly evidenced by the person's actual experience, projects, and education text — never invent skills with no textual evidence.

These are SUGGESTIONS for the user to confirm, not facts to assert.

Return ONLY JSON:

{
  "technical": string[],
  "soft": string[],
  "tools": string[]
}

Do not repeat any skill already in "existingSkills".
Keep each list to at most 8 items.`,
          },
          {
            role: 'user',
            content: `Target role: ${
              targetRole || '(not specified)'
            }

Existing skills already listed:
${JSON.stringify(existingSkills)}

Experience:
${JSON.stringify(experience, null, 2)}

Projects:
${JSON.stringify(projects, null, 2)}

Education:
${JSON.stringify(education, null, 2)}`,
          },
        ],
        max_tokens: 600,
      });

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

    let result: unknown;

    try {
      result = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          error:
            'AI returned an unexpected format. Please try again.',
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error('suggest-skills error:', err);

    return NextResponse.json(
      {
        error:
          'Something went wrong suggesting skills. Please try again.',
      },
      { status: 500 }
    );
  }
}
