'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WizardShell } from '@/components/wizard/WizardShell';
import { ImportResumeCard } from '@/components/wizard/ImportResumeCard';
import { useDraftResume } from '@/lib/hooks/useDraftResume';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/components/ui/toaster';
import type { ResumeData } from '@/lib/types/resume';

export default function NewResumePage() {
  const router = useRouter();
  const { data, settings, updateData, updateSettings } = useDraftResume();
  const [finishing, setFinishing] = useState(false);

  function handleImported(imported: ResumeData) {
    updateData(() => imported);
  }

  async function handleFinish() {
    setFinishing(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?returnTo=/resume/new&reason=save');
        return;
      }

      const title = data.personalInfo.fullName ? `${data.personalInfo.fullName} Resume` : 'Untitled Resume';
      const createRes = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const createJson = await createRes.json();
      if (!createRes.ok) throw new Error(createJson.error || 'Could not create resume');

      const id = createJson.resume.id;
      const patchRes = await fetch(`/api/resume/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, resume_data: data, template: settings.template, settings }),
      });
      if (!patchRes.ok) throw new Error('Could not save your resume content');

      if (typeof window !== 'undefined') window.localStorage.removeItem('orrica_edge_draft_v1');
      router.push(`/resume/${id}`);
    } catch (err) {
      toast({ title: 'Could not finish your resume', description: (err as Error).message, variant: 'error' });
      setFinishing(false);
    }
  }

  return (
    <div className="min-h-dvh bg-white">
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <ImportResumeCard onImported={handleImported} />
      </div>
      <WizardShell
        data={data}
        settings={settings}
        updateData={updateData}
        updateSettings={updateSettings}
        onFinish={handleFinish}
        finishing={finishing}
      />
    </div>
  );
}
