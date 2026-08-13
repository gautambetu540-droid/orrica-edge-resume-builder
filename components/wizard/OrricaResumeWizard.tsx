'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';
import { ResumeDocument } from '@/components/templates/ResumeDocument';
import { PersonalStep } from './steps/PersonalStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { EducationStep } from './steps/EducationStep';
import { SkillsStep } from './steps/SkillsStep';
import { ProjectsStep } from './steps/ProjectsStep';
import { MoreStep } from './steps/MoreStep';
import { SummaryStep } from './steps/SummaryStep';

export interface StepProps {
  data: ResumeData;
  settings: ResumeSettings;
  updateData: (u: (d: ResumeData) => ResumeData) => void;
  updateSettings: (u: (s: ResumeSettings) => ResumeSettings) => void;
}

const STEPS = [
  ['Personal', 'Contact details'],
  ['Experience', 'Work history'],
  ['Education', 'Degrees & study'],
  ['Skills', 'Your strengths'],
  ['Projects', 'Selected work'],
  ['More', 'Additional sections'],
  ['Summary', 'Professional story'],
  ['Finalize', 'Review & download'],
] as const;

function StepContent({ index, props }: { index: number; props: StepProps }) {
  switch (index) {
    case 0: return <PersonalStep {...props} />;
    case 1: return <ExperienceStep {...props} />;
    case 2: return <EducationStep {...props} />;
    case 3: return <SkillsStep {...props} />;
    case 4: return <ProjectsStep {...props} />;
    case 5: return <MoreStep {...props} />;
    case 6: return <SummaryStep {...props} />;
    default:
      return (
        <div className="oe-finalize space-y-4">
          <div className="rounded-xl border border-[#f8d8c6] bg-[#fff8f3] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f47c3c] text-white"><Check className="h-5 w-5" /></div>
              <div>
                <h2 className="text-lg font-bold text-[#111827]">Your resume is ready</h2>
                <p className="mt-1 text-sm leading-6 text-[#667085]">Review the live A4 preview before downloading. You can still go back and edit any section.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#e6e7eb] bg-white p-4"><div className="text-sm font-bold text-[#230939]">Tip</div><p className="mt-1 text-sm leading-6 text-[#667085]">Keep the most relevant achievements visible and remove anything that does not support your target role.</p></div>
            <div className="rounded-xl border border-[#e6e7eb] bg-white p-4"><div className="text-sm font-bold text-[#230939]">PDF ready</div><p className="mt-1 text-sm leading-6 text-[#667085]">The final PDF uses the same resume data and template shown in the live preview.</p></div>
          </div>
        </div>
      );
  }
}

function PagePreview({ data, settings }: { data: ResumeData; settings: ResumeSettings }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (!documentRef.current) return;
      setPages(Math.max(1, Math.ceil(documentRef.current.scrollHeight / 1123)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (documentRef.current) observer.observe(documentRef.current);
    return () => observer.disconnect();
  }, [data, settings]);

  useEffect(() => setPage((p) => Math.min(p, pages)), [pages]);

  const move = (next: number) => {
    const target = Math.max(1, Math.min(pages, next));
    setPage(target);
    viewportRef.current?.scrollTo({ top: (target - 1) * 560, behavior: 'smooth' });
  };

  return (
    <div className="sticky top-24">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <strong className="text-sm text-[#230939]">Live A4 Preview</strong>
          <div className="text-xs text-[#667085]">Updates as you type</div>
        </div>
        <span className="rounded-full border border-[#e6e7eb] bg-white px-3 py-1 text-[10px] font-bold text-[#230939]">Page {page} of {pages}</span>
      </div>
      <div ref={viewportRef} className="oe-preview h-[calc(100dvh-178px)] min-h-[560px] overflow-auto border border-[#e6e7eb] bg-[#f0f0f0] p-4">
        <div ref={documentRef} className="origin-top-left" style={{ width: 794, minHeight: 1123, transform: 'scale(.42)', marginBottom: '-650px' }}>
          <ResumeDocument data={data} settings={settings} />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center gap-3">
        <button aria-label="Previous resume page" type="button" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e6e7eb] bg-white text-[#230939] disabled:opacity-30" disabled={page === 1} onClick={() => move(page - 1)}><ChevronLeft className="h-4 w-4" /></button>
        <span className="min-w-10 text-center text-[10px] font-bold text-[#230939]">{page} / {pages}</span>
        <button aria-label="Next resume page" type="button" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e6e7eb] bg-white text-[#230939] disabled:opacity-30" disabled={page === pages} onClick={() => move(page + 1)}><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

export function OrricaResumeWizard({ data, settings, updateData, updateSettings, onFinish, finishing }: StepProps & { onFinish: () => void; finishing?: boolean }) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const last = index === STEPS.length - 1;

  const headings = [
    'Personal information',
    'Work experience',
    'Education',
    'Skills',
    'Projects',
    'Additional sections',
    'Professional summary',
    'Your resume is ready',
  ];
  const subtitles = [
    'Tell us how employers can reach you.',
    'Add your professional experience, starting with your most recent role.',
    'Add your academic background.',
    'Highlight the skills that make you a strong candidate.',
    'Showcase projects that demonstrate your experience and skills.',
    'Add anything else that strengthens your resume.',
    'Give employers a quick overview of your experience and strengths.',
    'Review your resume before downloading it.',
  ];

  const next = () => {
    if (index === 0) {
      const { fullName, phone, email } = data.personalInfo;
      if (!fullName?.trim() || !phone?.trim() || !email?.trim()) {
        toast({ title: 'Complete your contact details', description: 'Full Name, Phone, and Email are required before continuing.', variant: 'error' });
        return;
      }
    }
    if (last) return onFinish();
    setIndex((i) => i + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="oe-resume-wizard min-h-dvh bg-white text-[#000000]">
      <header className="flex h-[68px] items-center border-b border-[#f0f0f0] bg-white px-5 sm:px-7">
        <a href="/" className="shrink-0" aria-label="Orrica Edge home"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[28px] w-auto" /></a>
        <div className="ml-auto flex items-center gap-4 text-xs text-[#667085] sm:gap-6">
          <strong className="hidden text-[#230939] sm:block">Orrica Edge Resume Builder</strong>
          <span>Step {index + 1} of {STEPS.length}</span>
          <span className="hidden items-center gap-1.5 font-bold text-[#1f7a4f] sm:flex"><ShieldCheck className="h-4 w-4" /> Saved privately</span>
          <a href="/" className="font-bold text-[#230939] hover:text-[#f47c3c]">Exit</a>
        </div>
      </header>

      <div className="grid min-h-[calc(100dvh-68px)] grid-cols-[232px_minmax(0,1fr)]">
        <aside className="oe-sidebar flex flex-col border-r border-[#f0f0f0] bg-white p-4 sm:p-5">
          <div className="mb-5 px-2 text-[11px] font-bold uppercase tracking-[.08em] text-[#230939]">Build your resume</div>
          <div className="relative space-y-1">
            <div className="absolute left-[26px] top-5 bottom-5 w-px bg-[#e7e8eb]" />
            {STEPS.map(([label, description], i) => {
              const active = i === index;
              const complete = i < index;
              return (
                <button key={label} type="button" disabled={i > index} onClick={() => i <= index && setIndex(i)} className={`relative z-10 flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors ${active ? 'bg-[#fff1e8] text-[#230939]' : 'text-[#4b5563] hover:bg-[#fafafa]'} disabled:opacity-45`}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white text-[11px] font-bold ${active ? 'border-[#f47c3c] bg-[#f47c3c] text-white' : complete ? 'border-[#f47c3c] text-[#f47c3c]' : 'border-[#d9dce1] text-[#7a8190]'}`}>{complete && !active ? <Check className="h-3.5 w-3.5" /> : i + 1}</span>
                  <span className="min-w-0"><strong className="block text-[13px] leading-4">{label}</strong><small className="mt-0.5 block text-[10px] text-[#8a919d]">{description}</small></span>
                </button>
              );
            })}
          </div>
          <div className="mt-6 border-t border-[#f0f0f0] pt-4">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-[#667085]"><span>Progress</span><span className="text-[#f47c3c]">{Math.round((index / (STEPS.length - 1)) * 100)}%</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f0f0f0]"><div className="h-full rounded-full bg-[#f47c3c] transition-all" style={{ width: `${Math.round((index / (STEPS.length - 1)) * 100)}%` }} /></div>
          </div>
          <nav className="mt-auto space-y-2 pt-6 text-[10px] font-semibold text-[#667085]"><a href="/terms" className="block hover:text-[#f47c3c]">Terms & Conditions</a><a href="/privacy" className="block hover:text-[#f47c3c]">Privacy Policy</a><a href="/accessibility" className="block hover:text-[#f47c3c]">Accessibility</a><a href="/about" className="block hover:text-[#f47c3c]">Contact Us</a></nav>
        </aside>

        <main className="min-w-0 bg-white">
          <div className="grid min-h-[calc(100dvh-68px)] grid-cols-[minmax(520px,1fr)_390px]">
            <section className="px-6 pb-24 pt-8 sm:px-10 sm:pt-11 lg:px-12">
              <div className="max-w-[820px]">
                <span className="text-[11px] font-bold uppercase tracking-[.1em] text-[#f47c3c]">{step[0]}</span>
                <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-[-.02em] text-[#000000] sm:text-[34px]">{headings[index]}</h1>
                <p className="mt-2 max-w-[700px] text-[15px] leading-6 text-[#667085]">{subtitles[index]}</p>
                <div className="mt-7 max-w-[800px]">{StepContent({ index, props: { data, settings, updateData, updateSettings } })}</div>
                <div className="oe-action mt-8 flex items-center gap-2 border-t border-[#f0f0f0] pt-5">
                  <Button variant="ghost" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} className="h-11 rounded-lg border border-[#e5e7eb] px-4 font-bold text-[#230939] hover:bg-[#fff8f3]"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button>
                  <div className="flex-1" />
                  {index > 0 && index < STEPS.length - 1 && <Button variant="outline" onClick={() => setIndex((i) => i + 1)} className="h-11 rounded-lg border border-[#e5e7eb] px-5 font-bold text-[#230939] hover:border-[#f47c3c] hover:bg-[#fff8f3]">Skip</Button>}
                  <Button onClick={next} disabled={finishing} className="h-11 min-w-[132px] rounded-lg bg-[#f47c3c] px-5 font-bold text-white shadow-none hover:bg-[#e5682e]">{last ? (finishing ? 'Saving…' : 'Download Resume') : <>Continue <ArrowRight className="ml-1.5 h-4 w-4" /></>}</Button>
                </div>
              </div>
            </section>
            <aside className="border-l border-[#f0f0f0] bg-[#fafafa] px-4 pb-8 pt-6 sm:px-[18px]"><PagePreview data={data} settings={settings} /></aside>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .oe-resume-wizard, .oe-resume-wizard * { font-family:"Proxima Nova", Arial, sans-serif; }
        .oe-resume-wizard h1, .oe-resume-wizard h2, .oe-resume-wizard h3, .oe-resume-wizard strong, .oe-resume-wizard button, .oe-resume-wizard label { font-weight:700; }
        .oe-resume-wizard input, .oe-resume-wizard textarea, .oe-resume-wizard select { min-height:52px; border-color:#e3e5e8 !important; border-radius:10px !important; background:#fff !important; color:#000 !important; box-shadow:none !important; font-size:16px !important; }
        .oe-resume-wizard input:focus, .oe-resume-wizard textarea:focus, .oe-resume-wizard select:focus { border-color:#f47c3c !important; box-shadow:0 0 0 3px rgba(244,124,60,.12) !important; }
        .oe-resume-wizard input::placeholder, .oe-resume-wizard textarea::placeholder { color:#98a2b3 !important; opacity:1 !important; }
        @media(max-width:900px){
          .oe-sidebar{display:none}.oe-resume-wizard>div{display:block;min-height:auto}.oe-resume-wizard main>div{display:block;min-height:auto}.oe-resume-wizard main aside{border:0;border-top:1px solid #f0f0f0;padding:20px 14px 28px}.oe-resume-wizard section{padding:24px 16px 96px}.oe-resume-wizard section h1{font-size:26px}.oe-resume-wizard .oe-action{position:fixed;left:0;right:0;bottom:0;z-index:50;margin:0;padding:10px 14px calc(10px + env(safe-area-inset-bottom));background:rgba(255,255,255,.97);border-top:1px solid #f0f0f0}.oe-resume-wizard .oe-preview{height:620px;min-height:0}
        }
        @media(max-width:560px){.oe-resume-wizard header{padding:0 14px}.oe-resume-wizard section h1{font-size:24px}.oe-resume-wizard .oe-preview{height:580px}.oe-resume-wizard .oe-action button{min-height:46px}.oe-resume-wizard main aside{padding-left:10px;padding-right:10px}}
      `}</style>
    </div>
  );
}
