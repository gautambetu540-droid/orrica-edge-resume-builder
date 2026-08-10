import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'You must be signed in.' },
      { status: 401 }
    );
  }

  const { data: original, error: fetchError } = await supabase
    .from('resumes')
    .select('title, resume_data, template, settings')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (fetchError || !original) {
    return NextResponse.json(
      { error: 'Resume not found.' },
      { status: 404 }
    );
  }

  const { data: quota, error: quotaError } =
    await supabase.rpc('consume_resume_quota', {
      p_user_id: user.id,
    });

  if (quotaError) {
    console.error('resume quota error:', quotaError);

    return NextResponse.json(
      {
        error:
          'Could not check today’s resume limit. Please try again.',
      },
      { status: 500 }
    );
  }

  const quotaRow = Array.isArray(quota) ? quota[0] : quota;

  if (!quotaRow?.allowed) {
    return NextResponse.json(
      {
        error:
          'Daily limit reached. You can create up to 2 resumes per day.',
      },
      { status: 429 }
    );
  }

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      title: `${original.title} (Copy)`,
      resume_data: original.resume_data,
      template: original.template,
      settings: original.settings,
    })
    .select()
    .single();

  if (error) {
    console.error('duplicate resume error:', error);

    return NextResponse.json(
      { error: 'Could not duplicate this resume.' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      resume: data,
      quota: quotaRow,
    },
    { status: 201 }
  );
}
