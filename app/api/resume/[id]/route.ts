import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Resume not found.' }, { status: 404 });
  }

  return NextResponse.json({ resume: data });
}

const UpdateSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  resume_data: z.record(z.any()).optional(),
  template: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request body.', details: parsed.error.flatten() }, { status: 400 });
  }

  // Empty patch is a no-op success (avoids unnecessary error surfacing from autosave races).
  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const { data, error } = await supabase
    .from('resumes')
    .update(parsed.data)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error || !data) {
    console.error('update resume error:', error);
    return NextResponse.json({ error: 'Could not save your changes.' }, { status: 500 });
  }

  // Best-effort version snapshot; failure here should never block the save.
  if (parsed.data.resume_data) {
    supabase
      .from('resume_versions')
      .insert({ resume_id: params.id, resume_data: parsed.data.resume_data })
      .then(({ error: vErr }) => {
        if (vErr) console.error('version snapshot error:', vErr);
      });
  }

  return NextResponse.json({ resume: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });
  }

  const { error } = await supabase.from('resumes').delete().eq('id', params.id).eq('user_id', user.id);

  if (error) {
    console.error('delete resume error:', error);
    return NextResponse.json({ error: 'Could not delete this resume.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
