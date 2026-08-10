import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAI, AI_MODEL } from '@/lib/ai/client';
import { CORE_RULES } from '@/lib/ai/prompts';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  personalInfo: z.record(z.any()),
  experience: z.array(z.record(z.any())).default([]),
  education: z.array(z.record(z.any())).default([]),
  skills: z.array(z.record(z.any())).default([]),
  targetRole: z.string().optional().default(''),
  tone: z.enum(['professional', 'concise', 'ats']).optional().default('professional'),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const rateKey = user?.id ?? req.headers.get('x-forwarded-for') ?? 'anonymous';
    const { allowed, retryAfterMs } = checkRateLimit(`generate-summary:${rateKey}`);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment and try again.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((retryAfterMs ?? 1000) / 1000)) } }
      );
    }

    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request body.', details: parsed.error.flatten() }, { status: 400 });
    }

    const { personalInfo, experience, education, skills, targetRole, tone } = parsed.data;

    if (!experience.length && !education.length) {
      return NextResponse.json(
        { error: 'Add at least one work experience or education entry before generating a summary.' },
        { status: 400 }
      );
    }

    const toneInstruction = {
      professional: 'Write in a confident, professional tone.',
      concise: 'Write a tight, concise 2-sentence summary.',
      ats: 'Write in ATS-friendly language, front-loading relevant keywords from the person\u2019s actual background.',
    }[tone];

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: `${CORE_RULES}\n\nWrite a 3-4 sentence professional resume summary. Output ONLY the summary text.`,
        },
        {
          role: 'user',
          content: `${toneInstruction}${targetRole ? ` Tailor it toward this target role: ${targetRole}.` : ''}\n\nPerson's background (use only these facts):\n${JSON.stringify(
            { personalInfo, experience, education, skills },
            null,
            2
          )}`,
        },
      ],
      max_tokens: 300,
    });

    const summary = completion.choices[0]?.message?.content?.trim();
    if (!summary) {
      return NextResponse.json({ error: 'AI did not return a result. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ summary });
  } catch (err) {
    console.error('generate-summary error:', err);
    return NextResponse.json({ error: 'Something went wrong generating your summary. Please try again.' }, { status: 500 });
  }
}
