import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  DEFAULT_SETTINGS,
  EMPTY_RESUME_DATA,
} from '@/lib/types/resume';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'You must be signed in to view your resumes.' },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from('resumes')
    .select(
      'id, title, template, updated_at, created_at, resume_data'
    )
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('list resumes error:', error);

    return NextResponse.json(
      { error: 'Could not load your resumes.' },
      { status: 500 }
    );
  }

  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
  }).format(new Date());

  const { data: usage } = await supabase
    .from('resume_daily_usage')
    .select('resume_count, usage_date')
    .eq('user_id', user.id)
    .eq('usage_date', today)
    .maybeSingle();

  const used = usage?.resume_count ?? 0;

  return NextResponse.json({
    resumes: data,
    quota: {
      used,
      remaining: Math.max(0, 2 - used),
      limit: 2,
      usage_date: today,
    },
  });
}

const CreateSchema = z.object({
  title: z.string().min(1).max(120).default('Untitled Resume'),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'You must be signed in to create a resume.' },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));

  const parsed = CreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
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
        quota: {
          used: quotaRow?.used ?? 2,
          remaining: 0,
          usage_date: quotaRow?.usage_date,
        },
      },
      { status: 429 }
    );
  }

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      resume_data: EMPTY_RESUME_DATA,
      template: DEFAULT_SETTINGS.template,
      settings: DEFAULT_SETTINGS,
    })
    .select()
    .single();

  if (error) {
    console.error('create resume error:', error);

    return NextResponse.json(
      { error: 'Could not create a new resume.' },
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
