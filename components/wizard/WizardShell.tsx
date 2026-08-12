'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, FileText, Palette, ShieldCheck, Sparkles, Upload, UserRound } from 'lucide-react';
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
    <div className="oe-preview-frame flex min-h-[520px] items-start justify-center overflow-hidden rounded-2xl p-6">
      <div className="origin-top scale-[0.42] shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] sm:scale-[0.48]" style={{ width: 794, minHeight: 1123 }}>
        <ResumeDocument data={data} settings={settings} />
      </div>
    </div>
  );
}

function QuickStart({ accountName }: { accountName: string }) {
  return (
    <section className="oe-quick-start mb-4 overflow-hidden rounded-[24px] p-3 sm:mb-6 sm:rounded-[28px] sm:p-4" aria-label="Quick start">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 px-1 sm:px-2">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-orange-600 sm:text-[10px]">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shadow-[0_0_0_5px_rgba(249,115,22,.08)]" />
            {accountName ? `Welcome back, ${accountName.split(' ')[0]}` : 'Start your resume'}
          </div>
          <h2 className="mt-1 text-base font-bold tracking-[-0.025em] text-neutral-950 sm:text-lg">Choose the fastest way to begin.</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:min-w-[520px] sm:grid-cols-3">
          <a href="#resume-import" className="oe-quick-action group">
            <span className="oe-quick-icon bg-orange-50 text-orange-600"><Upload className="h-4 w-4" /></span>
            <span className="oe-quick-copy"><strong>Scan resume</strong><small>PDF import</small></span>
          </a>
          <Link href="/templates" className="oe-quick-action group">
            <span className="oe-quick-icon bg-violet-50 text-violet-600"><Palette className="h-4 w-4" /></span>
            <span className="oe-quick-copy"><strong>Templates</strong><small>Pick a style</small></span>
          </Link>
          <a href="#resume-builder" className="oe-quick-action group">
            <span className="oe-quick-icon bg-emerald-50 text-emerald-600"><Sparkles className="h-4 w-4" /></span>
            <span className="oe-quick-copy"><strong>Build with AI</strong><small>Write smarter</small></span>
          </a>
        </div>
      </div>
    </section>
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
    void loadUser();
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      const user = session?.user;
      const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '';
      setAccountName(name.trim());
    });
    return () => { active = false; subscription.subscription.unsubscribe(); };
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

  const firstName = accountName.split(' ')[0] || accountName;

  return (
    <div className="oe-wizard-shell min-h-dvh overflow-x-hidden text-neutral-950">
      <div className="oe-glow-orb orange left-[3%] top-28 h-40 w-40" />
      <div className="oe-glow-orb violet right-[2%] top-52 h-52 w-52" />
      <header className="oe-wizard-header oe-glass-nav sticky top-0 z-40">
        <div className="mx-auto flex h-[58px] max-w-7xl items-center gap-2.5 px-3 sm:h-16 sm:gap-4 sm:px-6 lg:px-8">
          <a href="/" className="shrink-0" aria-label="Orrica Edge home"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[22px] w-auto sm:h-7" /></a>
          <div className="hidden h-5 w-px bg-neutral-200 sm:block" />
          <div className="min-w-0 flex-1"><div className="truncate text-[10px] font-bold text-neutral-900 sm:text-xs">Create your resume</div><div className="hidden truncate text-[10px] text-neutral-400 sm:block">Build, scan, choose a template and preview everything before saving.</div></div>
          <div className="ml-auto flex shrink-0 items-center">
            {accountName ? (
              <div className="oe-account-chip flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-white/80 px-1.5 py-1 shadow-sm backdrop-blur-xl sm:max-w-[220px] sm:gap-2 sm:px-2.5 sm:py-1.5" title={accountName}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-700 sm:h-8 sm:w-8"><UserRound className="h-3.5 w-3.5" /></span>
                <div className="min-w-0 leading-none"><div className="max-w-[78px] truncate text-[9px] font-bold text-neutral-800 sm:max-w-[150px] sm:text-[11px]">{firstName}</div><div className="mt-0.5 text-[7px] font-medium text-emerald-600 sm:text-[9px]">Signed in</div></div>
              </div>
            ) : <div className="hidden items-center gap-2 text-[10px] font-medium text-neutral-400 sm:flex"><ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Private by default</div>}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <QuickStart accountName={accountName} />
        <div id="resume-import" className="mx-auto mb-4 max-w-5xl scroll-mt-20 sm:mb-6"><ResumeImportCard updateData={updateData} /></div>
        <div id="resume-builder" className="grid gap-4 scroll-mt-20 lg:grid-cols-[220px_minmax(0,1fr)_390px] lg:gap-6">
          <aside className="hidden lg:block"><div className="sticky top-24"><div className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Build your resume</div><div className="space-y-1">{STEPS.map((item, index) => { const active = index === stepIndex; const completed = index < stepIndex; return <div key={item.key} className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 ${active ? 'oe-glass shadow-sm' : 'hover:bg-white/55'}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${completed ? 'bg-emerald-50 text-emerald-600' : active ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'border border-neutral-200 bg-white/80 text-neutral-400'}`}>{completed ? <Check className="h-3.5 w-3.5" /> : index + 1}</span><div className="min-w-0"><div className={`text-xs font-semibold ${active ? 'text-orange-700' : 'text-neutral-700'}`}>{item.label}</div><div className="mt-0.5 truncate text-[10px] text-neutral-400">{item.description}</div></div></div>; })}</div><div className="oe-glass-pulse mt-6 rounded-2xl p-4"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Sparkles className="h-4 w-4" /></div><div className="mt-3 text-xs font-semibold">AI summary is ready</div><p className="mt-1 text-[10px] leading-5 text-neutral-400">Add your real experience and let AI turn it into a concise, truthful summary.</p></div></div></aside>

          <section className="min-w-0">
            <div className="mb-4 flex items-end justify-between gap-3 sm:mb-5 sm:gap-4"><div className="min-w-0"><div className="text-[9px] font-bold uppercase tracking-[0.18em] text-orange-600 sm:text-[10px]">Step {stepIndex + 1} of {STEPS.length}</div><h1 className="mt-1 text-[28px] font-semibold leading-[1.08] tracking-[-0.035em] text-neutral-950 sm:text-3xl">{step.label}</h1><p className="mt-1.5 text-[12px] leading-5 text-neutral-500 sm:text-sm">{step.optional ? 'Optional — skip it now and add it later.' : 'Required to get started.'}</p></div><div className="hidden shrink-0 items-center gap-2 rounded-full border border-white/80 bg-white/65 px-3 py-1.5 text-[10px] font-medium text-neutral-400 shadow-sm backdrop-blur sm:flex"><FileText className="h-3.5 w-3.5" /> Live A4 preview</div></div>
            <div className="oe-wizard-panel rounded-[22px] p-4 sm:rounded-3xl sm:p-7"><StepComponent data={data} settings={settings} updateData={updateData} updateSettings={updateSettings} /></div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/80 bg-white/60 px-3.5 py-2.5 text-[10px] text-neutral-400 shadow-sm backdrop-blur sm:mt-5 sm:px-4 sm:py-3 sm:text-[11px] lg:hidden"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> Your changes are kept while you build.</div>
            <div className="sticky bottom-2 z-30 mt-3 flex items-center gap-2 rounded-[18px] border border-white/80 bg-white/80 p-2 shadow-[0_20px_55px_-28px_rgba(15,23,42,.45)] backdrop-blur-2xl sm:static sm:mt-5 sm:gap-3 sm:rounded-2xl sm:p-3 sm:shadow-none"><Button variant="ghost" onClick={goBack} disabled={stepIndex === 0} className="h-10 rounded-xl px-3 text-xs font-semibold sm:h-11 sm:px-4 sm:text-sm"><ArrowLeft className="mr-1 h-3.5 w-3.5 sm:mr-1.5 sm:h-4 sm:w-4" /> Back</Button><div className="flex-1" />{step.optional && <Button variant="outline" onClick={goNext} disabled={finishing} className="h-10 rounded-xl bg-white/70 px-3 text-xs font-semibold sm:h-11 sm:px-4 sm:text-sm">Skip</Button>}<Button onClick={goNext} disabled={finishing} className="oe-3d-button h-10 min-w-[112px] rounded-xl px-4 text-xs font-semibold sm:h-11 sm:min-w-[130px] sm:px-5 sm:text-sm">{isLast ? (finishing ? 'Saving…' : <><Check className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Finish</>) : <>Continue <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" /></>}</Button></div>
          </section>

          <aside className="hidden lg:block"><div className="sticky top-24"><div className="mb-3 flex items-center justify-between"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Live preview</div><span className="rounded-full bg-white/70 px-2 py-1 text-[9px] font-bold text-neutral-400 shadow-sm">A4</span></div><MiniPreview data={data} settings={settings} /></div></aside>
        </div>
      </main>

      <style jsx global>{`
        @media (max-width: 767px) {
          .oe-wizard-shell { min-height: 100svh; }
          .oe-wizard-header { height: 56px; }
          .oe-wizard-header > div { height: 56px !important; padding-left: 12px !important; padding-right: 10px !important; gap: 8px !important; }
          .oe-wizard-header img { height: 21px !important; }
          .oe-account-chip { max-width: 105px !important; padding: 4px 7px 4px 4px !important; gap: 5px !important; }
          .oe-account-chip > span { width: 27px !important; height: 27px !important; }
          .oe-account-chip > span svg { width: 13px !important; height: 13px !important; }
          .oe-account-chip > div > div:first-child { font-size: 8.5px !important; max-width: 58px !important; }
          .oe-account-chip > div > div:last-child { font-size: 6.5px !important; }
          .oe-wizard-shell > main { padding: 9px 10px 24px !important; }
          .oe-quick-start { margin-bottom: 9px !important; padding: 10px !important; border-radius: 19px !important; box-shadow: 0 16px 40px -34px rgba(15,23,42,.4), inset 0 1px 0 rgba(255,255,255,.95); }
          .oe-quick-start > div { gap: 8px !important; }
          .oe-quick-start > div > div:first-child { padding: 0 2px !important; }
          .oe-quick-start h2 { margin-top: 2px !important; font-size: 15px !important; line-height: 1.16 !important; }
          .oe-quick-start .grid { width: 100% !important; gap: 5px !important; }
          .oe-quick-action { min-height: 67px !important; padding: 7px 4px !important; gap: 4px !important; border-radius: 14px !important; flex-direction: column; justify-content: center; text-align: center; }
          .oe-quick-icon { width: 30px !important; height: 30px !important; border-radius: 9px !important; }
          .oe-quick-copy { display: flex !important; flex-direction: column !important; align-items: center !important; min-width: 0 !important; line-height: 1.05 !important; }
          .oe-quick-action strong { display: block !important; font-size: 8.5px !important; line-height: 1.1 !important; white-space: nowrap !important; }
          .oe-quick-action small { display: block !important; margin-top: 2px !important; font-size: 6.5px !important; line-height: 1.1 !important; white-space: nowrap !important; }
          #resume-import { margin-bottom: 10px !important; }
          #resume-builder { gap: 8px !important; }
          #resume-builder > section > div:first-child { margin-bottom: 8px !important; }
          #resume-builder > section h1 { font-size: 26px !important; line-height: 1.02 !important; }
          #resume-builder > section .oe-wizard-panel { border-radius: 18px !important; padding: 14px !important; box-shadow: 0 20px 52px -42px rgba(15,23,42,.38), inset 0 1px 0 rgba(255,255,255,.95); }
          #resume-builder > section .oe-wizard-panel input, #resume-builder > section .oe-wizard-panel textarea, #resume-builder > section .oe-wizard-panel select { font-size: 15px !important; }
          #resume-builder > section > .sticky { bottom: 7px !important; margin-top: 9px !important; border-radius: 15px !important; padding: 6px !important; background: rgba(255,255,255,.92) !important; backdrop-filter: blur(22px) saturate(160%); -webkit-backdrop-filter: blur(22px) saturate(160%); box-shadow: 0 16px 42px -24px rgba(15,23,42,.35) !important; }
        }
      `}</style>
    </div>
  );
}
