import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ResumeDocument } from '@/components/templates/ResumeDocument';
import {
  DEFAULT_SETTINGS,
  EMPTY_RESUME_DATA,
} from '@/lib/types/resume';

// This route is intentionally chrome-free: no header, no nav, no editor UI.
// Puppeteer navigates here (forwarding the user's auth cookies) to render
// the resume exactly as the live preview shows it, then converts to PDF.
export default async function PrintPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: resume, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !resume) notFound();

  const data = {
    ...EMPTY_RESUME_DATA,
    ...resume.resume_data,
  };

  const settings = {
    ...DEFAULT_SETTINGS,
    ...resume.settings,
    template:
      resume.template ?? DEFAULT_SETTINGS.template,
  };

  // NOTE: no <html>/<body> here — those come from the root layout
  // (app/layout.tsx), which already loads the Inter font and provides the
  // print CSS in globals.css. We just render the bare document.
  return (
    <div
      style={{
        margin: 0,
        background: 'white',
        minHeight: '100vh',
      }}
    >
      <ResumeDocument
        data={data}
        settings={settings}
        forPrint
      />
    </div>
  );
}
