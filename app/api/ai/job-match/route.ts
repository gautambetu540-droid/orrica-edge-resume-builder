import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAI, AI_MODEL } from '@/lib/ai/client';
import { checkRateLimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const RequestSchema = z.object({
  resumeData: z.record(z.any()),
  jobDescription: z
    .string()
    .min(20, 'Paste the full job description (at least 20 characters).'),
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
      `job-match:${rateKey}`
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

    const { resumeData, jobDescription } = parsed.data;

    const openai = getOpenAI();

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      temperature: 0.2,
      response_format: {
        type: 'json_object',
      },
      messages: [
        {
          role: 'system',
          content: `You are an ATS (Applicant Tracking System) matching analyst. Compare the resume against the job description honestly and return ONLY JSON matching:

{
  "matchScore": number (0-100),
  "missingKeywords": string[],
  "skillsToHighlight": string[],
  "sectionsToImprove": string[],
  "recommendedChanges": string[]
}

Rules:

- "skillsToHighlight" must only include skills/experience the resume ALREADY shows evidence of — never suggest claiming something absent.
- "recommendedChanges" must never tell the user to claim experience, skills, or qualifications they don't have. Only suggest rewording, reordering, or emphasizing existing content, or honestly note a gap.
- Be realistic with matchScore; do not inflate it.`,
        },
        {
          role: 'user',
          content: `Resume data:
${JSON.stringify(resumeData, null, 2)}

Job description:
"""
${jobDescription}
"""`,
        },
      ],
      max_tokens: 1200,
    });

    const raw = completion.choices[0]?.message?.content;

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
    console.error('job-match error:', err);

    return NextResponse.json(
      {
        error:
          'Something went wrong analyzing this job description. Please try again.',
      },
      { status: 500 }
    );
  }
}
