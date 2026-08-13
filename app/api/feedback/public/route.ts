import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('feedback')
    .select('id, rating, feedback, created_at')
    .eq('is_featured', true)
    .neq('feedback', '')
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('public feedback fetch error:', error);
    return NextResponse.json({ feedback: [] });
  }

  return NextResponse.json({ feedback: data ?? [] });
}
