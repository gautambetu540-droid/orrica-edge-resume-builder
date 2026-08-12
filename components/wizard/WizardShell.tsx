'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileText, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';
import { ResumeDocument } from '@/components/templates/ResumeDocument';
import { ResumeImportCard } from './ResumeImportCard';
import { PersonalStep } from './steps/PersonalStep';
import { SummaryStep } from './steps/SummaryStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { ProjectsStep } from './steps/ProjectsStep';
import { MoreStep } from './steps/MoreStep';
import { createClient } from '@/lib/supabase/client';

export interface StepProps {
  data: ResumeData;
  settings: ResumeSettings;
  updateData: (updater: (d: ResumeData) => ResumeData) => void;
  updateSettings: (updater: (s: ResumeSettings) => ResumeSettings) => void;
}

const STEPS = [
  { key: 'personal', label: 'Personal', description: 'Contact details', optional: false, Component: PersonalStep },
  { key: 'experience', label: 'Experience', description: 'Work history', optional: true, Component: ExperienceStep },
  { key: 'education', label: 'Education', description: 'Degrees & study', optional: true, Component: EducationStep },
  { key: 'skills', label: 'Skills', description: 'Your strengths', optional: true, Component: SkillsStep },
  { key: 'projects', label: 'Projects', description: 'Selected work', optional: true, Component: ProjectsStep },
  { key: 'more', label: 'More', description: 'Additional sections', optional: true, Component: MoreStep },
  { key: 'summary', label: 'Summary', description: 'Your professional story', optional: true, Component: SummaryStep },
] as const;

function MiniPreview({ data, settings }: { data: ResumeData; settings: ResumeSettings }) {
  return (
    <div className="flex min-h-[520px] items-start justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 p-6">
      <div className="origin-top scale-[0.42] shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] sm:scale-[0.48]" style={{ width: 794, minHeight: 1123 }}>
        <ResumeDocument data={data} settings={settings} />
      </div>
    </div>
  );
}

export function WizardShell({ data, settings, updateData, updateSettings, onFinish, finishing }: StepProps & { onFinish: () => void; finishing?: boolean }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [accountName, setAccountName] = useState('');
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const StepComponent = step.Component;

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '';
      setAccountName(name.trim());
    }

    loadUser();
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const user = session?.user;
      const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '';
      setAccountName(name.trim());
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  function goNext() {
    if (step.key === 'personal') {
      const { fullName, phone, email } = data.personalInfo;
      if (!fullName?.trim() || !phone?.trim() || !email?.trim()) {
        toast({ title: 'Complete your contact details', description: 'Full Name, Phone, and Email are required before continuing.', variant: 'error' });
        return;
      }
    }
    if (isLast) { onFinish(); return; }
    setStepIndex((current) => current + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    setStepIndex((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-dvh bg-[#fafaf9] text-neutral-950">
      <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[60px] max-w-7xl items-center gap-2.5 px-3 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
          <a href="/" className="shrink-0" aria-label="Orrica Edge home">
            <img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-6 w-auto sm:h-7" />
          </a>
          <div className="hidden h-5 w-px bg-neutral-200 sm:block" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-semibold text-neutral-900 sm:text-xs">Create your resume</div>
            <div className="hidden truncate text-[10px] text-neutral-400 sm:block">Your progress is saved in this browser</div>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {accountName ? (
              <div className="flex max-w-[158px] items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-1.5 py-1 shadow-[0_8px_28px_-18px_rgba(15,23,42,.3)] sm:max-w-[220px] sm:gap-2 sm:px-2.5 sm:py-1.5" title={accountName}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-700 sm:h-7 sm:w-7"><UserRound className="h-3.5 w-3.5" /></span>
                <div className="min-w-0 leading-none">
                  <div className="truncate text-[10px] font-bold text-neutral-800 sm:text-[11px]">{accountName}</div>
                  <div className="mt-0.5 text-[8px] font-medium text-emerald-600 sm:text-[9px]">Signed in</div>
                </div>
              </div>
            ) : (
              <div className="hidden items-center gap-2 text-[10px] font-medium text-neutral-400 sm:flex"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Private by default</div>
            )}
            {accountName && <div className="hidden items-center gap-2 text-[10px] font-medium text-neutral-400 lg:flex"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Private by default</div>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto mb-4 max-w-4xl sm:mb-6">
          <ResumeImportCard updateData={updateData} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)_390px] lg:gap-6">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Build your resume</div>
              <div className="space-y-1">
                {STEPS.map((item, index) => {
                  const active = index === stepIndex;
                  const completed = index < stepIndex;
                  return <div key={item.key} className={`flex items-center gap-3 rounded-xl px-3 py-3 ${active ? 'bg-orange-50' : ''}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${completed ? 'bg-emerald-50 text-emerald-600' : active ? 'bg-orange-500 text-white' : 'border border-neutral-200 bg-white text-neutral-400'}`}>{completed ? <Check className="h-3.5 w-3.5" /> : index + 1}</span><div className="min-w-0"><div className={`text-xs font-semibold ${active ? 'text-orange-700' : 'text-neutral-700'}`}>{item.label}</div><div className="mt-0.5 truncate text-[10px] text-neutral-400">{item.description}</div></div></div>;
                })}
              </div>
              <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Sparkles className="h-4 w-4" /></div><div className="mt-3 text-xs font-semibold">Make it stronger with AI</div><p className="mt-1 text-[10px] leading-5 text-neutral-400">Once your resume is saved, improve summaries, bullets and job matching with AI.</p></div>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5 sm:gap-4">
              <div className="min-w-0">
                <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-orange-600 sm:text-[10px]">Step {stepIndex + 1} of {STEPS.length}</div>
                <h1 className="mt-1 text-[28px] font-semibold leading-[1.08] tracking-[-0.035em] text-neutral-950 sm:text-3xl">{step.label}</h1>
                <p className="mt-1.5 text-[12px] leading-5 text-neutral-500 sm:text-sm">{step.optional ? 'Optional — skip it now and add it later.' : 'Required to get started.'}</p>
              </div>
              <div className="hidden shrink-0 items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[10px] font-medium text-neutral-400 sm:flex"><FileText className="h-3.5 w-3.5" /> Live preview</div>
            </div>

            <div className="rounded-[20px] border border-neutral-200/90 bg-white p-4 shadow-[0_20px_55px_-38px_rgba(15,23,42,.38)] sm:rounded-2xl sm:p-7">
              <StepComponent data={data} settings={settings} updateData={updateData} updateSettings={updateSettings} />
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-neutral-200/80 bg-white px-3.5 py-2.5 text-[10px] text-neutral-400 sm:mt-5 sm:px-4 sm:py-3 sm:text-[11px] lg:hidden">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> Your changes are kept while you build.
            </div>

            <div className="sticky bottom-2 z-30 mt-3 flex items-center gap-2 rounded-[18px] border border-neutral-200/90 bg-white/95 p-2 shadow-[0_20px_55px_-28px_rgba(15,23,42,.45)] backdrop-blur-xl sm:static sm:mt-5 sm:gap-3 sm:rounded-2xl sm:p-3 sm:shadow-none">
              <Button variant="ghost" onClick={goBack} disabled={stepIndex === 0} className="h-10 rounded-xl px-3 text-xs font-semibold sm:h-11 sm:px-4 sm:text-sm"><ArrowLeft className="mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" /> Back</Button>
              <div className="flex-1" />
              {step.optional && <Button variant="outline" onClick={goNext} disabled={finishing} className="h-10 rounded-xl px-3 text-xs font-semibold sm:h-11 sm:px-4 sm:text-sm">Skip</Button>}
              <Button onClick={goNext} disabled={finishing} className="h-10 min-w-[112px] rounded-xl px-4 text-xs font-semibold shadow-sm sm:h-11 sm:min-w-[130px] sm:px-5 sm:text-sm">{isLast ? (finishing ? 'Saving…' : <><Check className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Finish</>) : <>Continue <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /></>}</Button>
            </div>
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="mb-3 flex items-center justify-between"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Live preview</div><span className="text-[10px] text-neutral-400">A4</span></div>
              <MiniPreview data={data} settings={settings} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
