import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EditorShell } from '@/components/editor/EditorShell';
import {
  DEFAULT_SETTINGS,
  EMPTY_RESUME_DATA,
} from '@/lib/types/resume';

export default async function ResumeEditorPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?returnTo=/resume/${params.id}`);
  }

  const { data: resume, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !resume) {
    notFound();
  }

  return (
    <EditorShell
      resumeId={resume.id}
      title={resume.title}
      data={{ ...EMPTY_RESUME_DATA, ...resume.resume_data }}
      settings={{
        ...DEFAULT_SETTINGS,
        ...resume.settings,
        template:
          resume.template ?? DEFAULT_SETTINGS.template,
      }}
    />
  );
}
