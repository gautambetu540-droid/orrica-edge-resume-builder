import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = await createClient();
  const withNames = await supabase
    .from('feedback')
    .select('id, candidate_name, rating, feedback, created_at')
    .neq('feedback', '')
    .order('created_at', { ascending: false })
    .limit(6);

  if (!withNames.error) {
    return NextResponse.json({
      feedback: (withNames.data ?? []).map((item) => ({
        ...item,
        candidateName: item.candidate_name?.trim() || '',
      })),
    });
  }

  // Keep the public testimonials working if the optional display-name migration
  // has not been applied to the database yet.
  const fallback = await supabase
    .from('feedback')
    .select('id, rating, feedback, created_at')
    .neq('feedback', '')
    .order('created_at', { ascending: false })
    .limit(6);

  if (fallback.error) {
    console.error('public feedback fetch error:', fallback.error);
    return NextResponse.json({ feedback: [] });
  }

  return NextResponse.json({
    feedback: (fallback.data ?? []).map((item) => ({ ...item, candidateName: '' })),
  });
}
