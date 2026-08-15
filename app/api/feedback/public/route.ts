import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  // Public feedback is optional. Preview deployments may not have Supabase
  // environment variables configured, so never let this endpoint crash the page.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ feedback: [] }, { status: 200 });
  }

  try {
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

    // Keep public testimonials working if the optional display-name migration
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
  } catch (error) {
    console.error('public feedback service unavailable:', error);
    return NextResponse.json({ feedback: [] }, { status: 200 });
  }
}
