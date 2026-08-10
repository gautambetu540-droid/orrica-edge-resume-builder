import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAI, AI_MODEL } from '@/lib/ai/client';
import { CORE_RULES, jsonOnlyInstruction } from '@/lib/ai/prompts';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  personalInfo: z.record(z.any()),
  summary: z.string().optional().default(''),
  experience: z.array(z.record(z.any())).default([]),
  education: z.array(z.record(z.any())).default([]),
  skills: z.array(z.record(z.any())).default([]),
  projects: z.array(z.record(z.any())).default([]),
  certifications: z.array(z.record(z.any())).default([]),
  languages: z.array(z.record(z.any())).default([]),
  achievements: z.array(z.record(z.any())).default([]),
  targetRole: z.string().optional().default(''),
});

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Allow anonymous drafting (per spec: users can start before registering),
    // but rate-limit by IP if unauthenticated.
    const rateKey = user?.id ?? req.headers.get('x-forwarded-for') ?? 'anonymous';
    const { allowed, retryAfterMs } = checkRateLimit(`generate-resume:${rateKey}`);
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

    const input = parsed.data;

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `${CORE_RULES}\n\n${jsonOnlyInstruction(
            `{
  "summary": string,
  "experience": [{ "id": string, "achievements": string[] }],
  "skillSuggestions": { "technical": string[], "soft": string[], "tools": string[] }
}`
          )}\n\nOnly rewrite/polish the "achievements" for experience entries whose id is provided. Do not fabricate skills the user hasn't implied through their actual experience/projects — "skillSuggestions" should be things clearly evidenced by their input, for them to confirm, not invented.`,
        },
        {
          role: 'user',
          content: `Here is the user's real resume data. Improve the professional summary and turn each experience entry's raw "responsibilities" text into 2-4 strong, ATS-friendly achievement bullet points, without inventing facts or metrics.\n\nTarget role: ${
            input.targetRole || '(not specified)'
          }\n\nData:\n${JSON.stringify(input, null, 2)}`,
        },
      ],
      max_tokens: 1800,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: 'AI did not return a result. Please try again.' }, { status: 502 });
    }

    let result: unknown;
    try {
      result = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'AI returned an unexpected format. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error('generate-resume error:', err);
    return NextResponse.json({ error: 'Something went wrong generating your resume. Please try again.' }, { status: 500 });
  }
}
