'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ShieldCheck } from 'lucide-react';
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
  ['Heading', 'Contact details', 'personal'], ['Work History', 'Work experience', 'experience'], ['Education', 'Degrees & study', 'education'], ['Skills', 'Your strengths', 'skills'],
  ['Projects', 'Selected work', 'projects'], ['More', 'Additional sections', 'more'], ['Summary', 'Professional story', 'summary'], ['Finalize', 'Review & download', 'finalize'],
] as const;

const HEADINGS = ['What’s the best way for employers to contact you?', 'Tell us about your most recent job', 'Tell us about your education', 'What are your strongest skills?', 'Showcase your best projects', 'Add anything else that strengthens your resume', 'Tell us about your professional journey', 'Your resume is ready to review'];
const SUBTITLES = ['We suggest including an email and phone number.', 'We’ll start there and work backward.', 'Employers quickly scan education. We’ll take care of the formatting.', 'Highlight the skills that make you a strong candidate.', 'Show work that demonstrates your experience and skills.', 'These sections are optional and can be added later.', 'Give employers a quick overview of their experience and strengths.', 'Review the live resume and make any final changes before downloading.'];

function StepContent({ index, props }: { index: number; props: StepProps }) {
  switch (index) {
    case 0: return <PersonalStep {...props} />;
    case 1: return <ExperienceStep {...props} />;
    case 2: return <EducationStep {...props} />;
    case 3: return <SkillsStep {...props} />;
    case 4: return <ProjectsStep {...props} />;
    case 5: return <MoreStep {...props} />;
    case 6: return <SummaryStep {...props} />;
    default: return <div className="space-y-4"><div className="rounded-2xl border border-sky-100 bg-sky-50 p-5"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white"><Check className="h-5 w-5" /></div><div><h2 className="text-lg font-bold text-slate-900">Your resume is ready</h2><p className="mt-1 text-sm leading-6 text-slate-600">Review the live resume preview. You can go back and edit any section before downloading.</p></div></div></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-sm font-bold text-slate-900">Final check</div><p className="mt-1 text-sm leading-6 text-slate-600">Make sure your contact details and most relevant achievements are accurate.</p></div><div className="rounded-xl border border-slate-200 bg-white p-4"><div className="text-sm font-bold text-slate-900">PDF ready</div><p className="mt-1 text-sm leading-6 text-slate-600">The downloaded PDF uses the same data and template shown in the live preview.</p></div></div></div>;
  }
}

function PagePreview({ data, settings, activeSection }: { data: ResumeData; settings: ResumeSettings; activeSection: string }) {
  const documentRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.42);
  const [documentHeight, setDocumentHeight] = useState(1123);

  useEffect(() => {
    const recompute = () => {
      const viewport = viewportRef.current;
      const document = documentRef.current;
      if (!viewport || !document) return;
      const height = Math.max(1123, document.scrollHeight);
      setDocumentHeight(height);
      const widthScale = (viewport.clientWidth - 24) / 794;
      const heightScale = (viewport.clientHeight - 24) / height;
      setScale(Math.max(0.28, Math.min(0.62, widthScale, heightScale)));
    };
    recompute();
    const observer = new ResizeObserver(recompute);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (documentRef.current) observer.observe(documentRef.current);
    window.addEventListener('resize', recompute);
    return () => { observer.disconnect(); window.removeEventListener('resize', recompute); };
  }, [data, settings]);

  return <div className="w-full min-w-0"><div className="mb-3 flex items-center justify-between gap-3"><div><strong className="text-sm text-slate-900">Live Resume Preview</strong><div className="text-[11px] text-slate-500">Updates as you type</div></div><span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold text-sky-600">Live</span></div><div ref={viewportRef} className="relative flex h-[520px] w-full items-start justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-inner sm:h-[590px] lg:h-[650px]"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(14,165,233,.10),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(249,115,22,.08),transparent_32%)]" /><div className="relative shrink-0" style={{ width: 794 * scale, height: Math.min(1123, documentHeight) * scale }}><div ref={documentRef} className="absolute left-0 top-0 origin-top-left" style={{ width: 794, transform: `scale(${scale})`, transformOrigin: 'top left' }}><ResumeDocument data={data} settings={settings} activeSection={activeSection} /></div></div></div></div>;
}

export function OrricaResumeWizard({ data, settings, updateData, updateSettings, onFinish, finishing }: StepProps & { onFinish: () => void; finishing?: boolean }) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const last = index === STEPS.length - 1;
  const completion = Math.round((index / (STEPS.length - 1)) * 100);
  const next = () => {
    if (index === 0) {
      const { fullName, phone, email } = data.personalInfo;
      if (!fullName?.trim() || !phone?.trim() || !email?.trim()) { toast({ title: 'Complete your contact details', description: 'Full Name, Phone, and Email are required before continuing.', variant: 'error' }); return; }
    }
    if (last) return onFinish();
    setIndex((i) => i + 1);
  };
  const back = () => setIndex((i) => Math.max(0, i - 1));

  return <div className="oe-resume-wizard h-[100dvh] min-h-0 overflow-hidden bg-white text-slate-900">
    <aside className="oe-resume-sidebar fixed inset-y-0 left-0 z-40 hidden w-[238px] overflow-hidden border-r border-slate-200 bg-white px-4 py-5 md:block"><div className="flex h-full min-h-0 flex-col"><div className="px-2 text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">Build your resume</div><div className="relative mt-5 space-y-1"><div className="absolute left-[27px] top-5 bottom-5 w-px bg-slate-200" />{STEPS.map(([label, description], i) => { const active = i === index; const complete = i < index; return <button key={label} type="button" disabled={i > index} onClick={() => i <= index && setIndex(i)} className={`relative z-10 flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors ${active ? 'bg-sky-50' : 'hover:bg-slate-50'} disabled:cursor-default disabled:opacity-60`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold ${active ? 'border-sky-500 bg-sky-500 text-white' : complete ? 'border-sky-500 bg-white text-sky-600' : 'border-slate-300 bg-white text-slate-500'}`}>{complete ? <Check className="h-3.5 w-3.5" /> : i + 1}</span><span className="min-w-0"><strong className={`block text-[13px] leading-4 ${active ? 'text-slate-900' : 'text-slate-600'}`}>{label}</strong><small className="mt-0.5 block truncate text-[10px] text-slate-400">{description}</small></span></button>; })}</div><div className="mt-6 border-t border-slate-200 pt-4"><div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[.08em] text-slate-400"><span>Resume completeness</span><span className="text-sky-600">{completion}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-sky-500 transition-all duration-300" style={{ width: `${Math.max(2, completion)}%` }} /></div></div><nav className="mt-auto space-y-1.5 border-t border-slate-200 pt-4 text-[10px] font-semibold text-slate-500"><a href="/terms" className="block hover:text-sky-600">Terms & Conditions</a><a href="/privacy" className="block hover:text-sky-600">Privacy Policy</a><a href="/accessibility" className="block hover:text-sky-600">Accessibility</a><a href="/about" className="block hover:text-sky-600">Contact Us</a><div className="pt-1 text-[9px] font-normal text-slate-400">© 2026 Orrica Edge</div></nav></div></aside>

    <div className="oe-resume-workspace h-[100dvh] min-h-0 min-w-0 overflow-y-auto overflow-x-hidden md:ml-[238px]"><header className="sticky top-0 z-30 flex h-[64px] shrink-0 items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6"><a href="/" className="shrink-0" aria-label="Orrica Edge home"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[27px] w-auto" /></a><div className="ml-4 hidden h-6 w-px bg-slate-200 sm:block" /><div className="ml-4 hidden min-w-0 sm:block"><div className="text-xs font-bold text-slate-900">Resume Builder</div><div className="text-[10px] text-slate-400">Build your resume step by step</div></div><div className="ml-auto flex items-center gap-3 text-[11px] text-slate-500 sm:gap-5"><span className="hidden items-center gap-1.5 font-semibold text-emerald-600 sm:flex"><ShieldCheck className="h-4 w-4" /> Saved privately</span><span>Step {index + 1} of {STEPS.length}</span><a href="/" className="font-bold text-slate-800 hover:text-sky-600">Exit</a></div></header>
      <div className="oe-resume-workspace-content grid min-w-0 grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_400px]"><main className="min-w-0 bg-white"><div className="px-4 pb-6 pt-6 sm:px-8 sm:pt-9 lg:px-10"><div className="mx-auto w-full max-w-[820px]"><button type="button" onClick={back} disabled={index === 0} className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-600 disabled:invisible"><ArrowLeft className="h-3.5 w-3.5" /> Go Back</button><div className="text-[10px] font-bold uppercase tracking-[.14em] text-sky-600">{step[0]}</div><h1 className="mt-2 max-w-[760px] text-[27px] font-bold leading-[1.12] tracking-[-.025em] text-slate-900 sm:text-[34px]">{HEADINGS[index]}</h1><p className="mt-2 max-w-[680px] text-[14px] leading-6 text-slate-500 sm:text-[15px]">{SUBTITLES[index]}</p>{index === 0 && <p className="mt-3 text-[11px] text-slate-400">* indicates a required field</p>}<div className="mt-6 pb-2">{StepContent({ index, props: { data, settings, updateData, updateSettings } })}</div></div></div><div className="flex min-h-[70px] items-center gap-2 border-t border-slate-200 bg-white px-4 py-4 sm:px-8 lg:px-10"><div className="mx-auto flex w-full max-w-[820px] items-center gap-2"><Button variant="ghost" onClick={back} disabled={index === 0} className="h-11 rounded-lg border border-slate-200 px-4 font-bold text-slate-800 hover:bg-slate-50"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button><div className="flex-1" />{index > 0 && !last && <Button variant="outline" onClick={next} disabled={finishing} className="h-11 rounded-lg border border-slate-200 px-5 font-bold text-slate-800 hover:border-sky-400 hover:bg-sky-50">Skip</Button>}<Button onClick={next} disabled={finishing} className="h-11 min-w-[138px] rounded-lg bg-sky-500 px-5 font-bold text-white shadow-none hover:bg-sky-600">{last ? (finishing ? 'Saving…' : 'Download Resume') : <>Next: {STEPS[index + 1]?.[0] ?? 'Finish'} <ArrowRight className="ml-1.5 h-4 w-4" /></>}</Button></div></div></main><aside className="oe-resume-preview min-w-0 border-t border-slate-200 bg-slate-50 px-3 py-5 sm:px-5 lg:border-l lg:border-t-0"><PagePreview data={data} settings={settings} activeSection={step[2]} /></aside></div>
    </div>

    <style jsx global>{`
      .oe-resume-wizard,.oe-resume-wizard *{font-family:"Proxima Nova",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif}
      .oe-resume-wizard h1,.oe-resume-wizard h2,.oe-resume-wizard h3,.oe-resume-wizard strong,.oe-resume-wizard button,.oe-resume-wizard label{font-weight:700}
      .oe-resume-wizard input,.oe-resume-wizard textarea,.oe-resume-wizard select{min-height:50px;border-color:#dfe5ec!important;border-radius:9px!important;background:#fff!important;color:#111827!important;box-shadow:none!important;font-size:16px!important}
      .oe-resume-wizard input:focus,.oe-resume-wizard textarea:focus,.oe-resume-wizard select:focus{border-color:#0EA5E9!important;box-shadow:0 0 0 3px rgba(14,165,233,.12)!important;outline:none!important}
      @media (max-width:1023px){.oe-resume-wizard{height:auto;min-height:100dvh;overflow:visible}.oe-resume-workspace{height:auto;min-height:100dvh;overflow-y:auto}.oe-resume-preview{order:2}.oe-resume-wizard main{min-height:0}}
      @media (max-width:639px){.oe-resume-wizard h1{font-size:25px;line-height:1.15}.oe-resume-wizard .oe-resume-preview{padding:14px 12px 28px}.oe-resume-wizard input,.oe-resume-wizard textarea,.oe-resume-wizard select{font-size:16px!important}}
    `}</style>
  </div>;
}
