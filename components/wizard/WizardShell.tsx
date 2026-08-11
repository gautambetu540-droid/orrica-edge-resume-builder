'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileText, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';
import { ResumeDocument } from '@/components/templates/ResumeDocument';
import { PersonalStep } from './steps/PersonalStep';
import { SummaryStep } from './steps/SummaryStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { ProjectsStep } from './steps/ProjectsStep';
import { MoreStep } from './steps/MoreStep';

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
    <div className="flex h-full min-h-[520px] items-start justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 p-6">
      <div className="origin-top scale-[0.42] shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] sm:scale-[0.48]" style={{ width: 794, minHeight: 1123 }}>
        <ResumeDocument data={data} settings={settings} />
      </div>
    </div>
  );
}

export function WizardShell({ data, settings, updateData, updateSettings, onFinish, finishing }: StepProps & { onFinish: () => void; finishing?: boolean }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const StepComponent = step.Component;

  function goNext() {
    if (step.key === 'personal') {
      const { fullName, phone, email } = data.personalInfo;
      if (!fullName?.trim() || !phone?.trim() || !email?.trim()) {
        toast({
          title: 'Complete your contact details',
          description: 'Full Name, Phone, and Email are required before continuing.',
          variant: 'error',
        });
        return;
      }
    }

    if (isLast) {
      onFinish();
      return;
    }

    setStepIndex((current) => current + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    setStepIndex((current) => Math.max(0, current - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-950">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <a href="/" className="shrink-0" aria-label="Orrica Edge home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-7 w-auto" />
          </a>
          <div className="h-5 w-px bg-neutral-200" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-neutral-900">Create your resume</div>
            <div className="text-[10px] text-neutral-400">Your progress is saved in this browser</div>
          </div>
          <div className="ml-auto flex items-center gap-2 text-[10px] font-medium text-neutral-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Private by default
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)_390px] lg:px-8 lg:py-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Build your resume</div>
            <div className="space-y-1">
              {STEPS.map((item, index) => {
                const active = index === stepIndex;
                const completed = index < stepIndex;
                return (
                  <div key={item.key} className={`flex items-center gap-3 rounded-xl px-3 py-3 ${active ? 'bg-orange-50' : ''}`}>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${completed ? 'bg-emerald-50 text-emerald-600' : active ? 'bg-orange-500 text-white' : 'bg-white border border-neutral-200 text-neutral-400'}`}>
                      {completed ? <Check className="h-3.5 w-3.5" /> : index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className={`text-xs font-semibold ${active ? 'text-orange-700' : 'text-neutral-700'}`}>{item.label}</div>
                      <div className="mt-0.5 truncate text-[10px] text-neutral-400">{item.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Sparkles className="h-4 w-4" /></div>
              <div className="mt-3 text-xs font-semibold">Make it stronger with AI</div>
              <p className="mt-1 text-[10px] leading-5 text-neutral-400">Once your resume is saved, you can improve summaries, bullets and job matching with AI.</p>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">Step {stepIndex + 1} of {STEPS.length}</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">{step.label}</h1>
              <p className="mt-1 text-sm text-neutral-500">{step.optional ? 'Optional — skip it now and add it later.' : 'Required to get started.'}</p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[10px] font-medium text-neutral-400 sm:flex">
              <FileText className="h-3.5 w-3.5" /> Live preview
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.35)] sm:p-7">
            <StepComponent data={data} settings={settings} updateData={updateData} updateSettings={updateSettings} />
          </div>

          <div className="mt-5 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[11px] text-neutral-400 lg:hidden">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Your changes are kept while you build.
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4">
            <Button variant="ghost" onClick={goBack} disabled={stepIndex === 0} className="h-11 rounded-xl px-4 text-sm font-semibold">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Button>
            <div className="flex-1" />
            {step.optional && (
              <Button variant="outline" onClick={goNext} disabled={finishing} className="h-11 rounded-xl px-4 text-sm font-semibold">
                Skip
              </Button>
            )}
            <Button onClick={goNext} disabled={finishing} className="h-11 min-w-[130px] rounded-xl px-5 text-sm font-semibold shadow-sm">
              {isLast ? (
                finishing ? 'Saving…' : <><Check className="mr-1.5 h-4 w-4" /> Finish</>
              ) : (
                <>Continue <ArrowRight className="ml-1.5 h-4 w-4" /></>
              )}
            </Button>
          </div>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Live preview</div>
              <span className="text-[10px] text-neutral-400">A4</span>
            </div>
            <MiniPreview data={data} settings={settings} />
          </div>
        </aside>
      </main>
    </div>
  );
}
