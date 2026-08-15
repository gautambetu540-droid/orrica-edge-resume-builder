import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const FeedbackSchema = z.object({
  resumeId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  feedback: z.string().trim().max(1200).optional().default(''),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const body = await req.json().catch(() => null);
  const parsed = FeedbackSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid feedback.' }, { status: 400 });
  }

  if (parsed.data.resumeId && user) {
    const { data: ownedResume } = await supabase
      .from('resumes')
      .select('id')
      .eq('id', parsed.data.resumeId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (!ownedResume) {
      return NextResponse.json({ error: 'Resume not found.' }, { status: 404 });
    }
  }

  let candidateName = '';
  if (parsed.data.resumeId && user) {
    const { data: resume } = await supabase
      .from('resumes')
      .select('resume_data')
      .eq('id', parsed.data.resumeId)
      .eq('user_id', user.id)
      .maybeSingle();
    const personalInfo = (resume?.resume_data as { personalInfo?: { fullName?: string } } | null)?.personalInfo;
    candidateName = personalInfo?.fullName?.trim() ?? '';
  }

  let { error } = await supabase.from('feedback').insert({
    user_id: user?.id ?? null,
    resume_id: parsed.data.resumeId ?? null,
    candidate_name: candidateName,
    rating: parsed.data.rating,
    feedback: parsed.data.feedback,
  });

  // Keep feedback submission working on databases that have not yet received
  // the optional candidate_name migration.
  if (error && /candidate_name|column.*does not exist/i.test(error.message ?? '')) {
    ({ error } = await supabase.from('feedback').insert({
      user_id: user?.id ?? null,
      resume_id: parsed.data.resumeId ?? null,
      rating: parsed.data.rating,
      feedback: parsed.data.feedback,
    }));
  }

  if (error) {
    console.error('feedback insert error:', error);
    return NextResponse.json({ error: 'Could not save feedback.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
