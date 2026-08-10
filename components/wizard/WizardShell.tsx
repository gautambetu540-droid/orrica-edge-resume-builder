'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';
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
  { key: 'personal', label: 'Personal', optional: false, Component: PersonalStep },
  { key: 'experience', label: 'Experience', optional: true, Component: ExperienceStep },
  { key: 'education', label: 'Education', optional: true, Component: EducationStep },
  { key: 'skills', label: 'Skills', optional: true, Component: SkillsStep },
  { key: 'projects', label: 'Projects', optional: true, Component: ProjectsStep },
  { key: 'more', label: 'More', optional: true, Component: MoreStep },
  { key: 'summary', label: 'Summary', optional: true, Component: SummaryStep },
] as const;

export function WizardShell({
  data,
  settings,
  updateData,
  updateSettings,
  onFinish,
  finishing,
}: StepProps & { onFinish: () => void; finishing?: boolean }) {
  const [stepIndex, setStepIndex] = useState(0);
  const isLast = stepIndex === STEPS.length - 1;
  const step = STEPS[stepIndex];
  const StepComponent = step.Component;

  function goNext() {
    if (step.key === 'personal') {
      const { fullName, phone, email } = data.personalInfo;
      if (!fullName?.trim() || !phone?.trim() || !email?.trim()) {
        toast({
          title: 'A few required fields are missing',
          description: 'Full Name, Phone, and Email are required before you continue.',
          variant: 'error',
        });
        return;
      }
    }
    if (isLast) {
      onFinish();
    } else {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function goBack() {
    setStepIndex((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-dvh bg-secondary/40 pb-28">
      {/* Progress indicator */}
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-5 w-auto" />
            <span className="text-xs text-muted-foreground">
              Step {stepIndex + 1} of {STEPS.length + 1}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[...STEPS, { key: 'finish', label: 'Finish' }].map((s, i) => (
              <div
                key={s.key}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= stepIndex ? 'bg-primary' : 'bg-neutral-200'
                }`}
              />
            ))}
          </div>
          <div className="hidden sm:flex justify-between mt-1.5 text-[11px] text-muted-foreground">
            {[...STEPS, { key: 'finish', label: 'Finish' }].map((s, i) => (
              <span key={s.key} className={i === stepIndex ? 'text-primary font-medium' : ''}>
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">{step.label}</h1>
        <p className="text-muted-foreground text-sm mb-6">
          {step.optional ? 'Optional — you can skip this and add it later.' : 'Required to get started.'}
        </p>
        <StepComponent data={data} settings={settings} updateData={updateData} updateSettings={updateSettings} />
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" onClick={goBack} disabled={stepIndex === 0} className="flex-none">
            Back
          </Button>
          <div className="flex-1" />
          {step.optional && (
            <Button variant="outline" onClick={goNext} disabled={finishing}>
              Skip
            </Button>
          )}
          <Button onClick={goNext} disabled={finishing} className="min-w-[120px]">
            {isLast ? (
              finishing ? (
                'Finishing…'
              ) : (
                <>
                  <Check className="h-4 w-4" /> Finish
                </>
              )
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
