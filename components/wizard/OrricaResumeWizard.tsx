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
  ['Heading', 'Contact details'], ['Work History', 'Work experience'], ['Education', 'Degrees & study'], ['Skills', 'Your strengths'],
  ['Projects', 'Selected work'], ['More', 'Additional sections'], ['Summary', 'Professional story'], ['Finalize', 'Review & download'],
] as const;

const HEADINGS = [
  'What’s the best way for employers to contact you?', 'Tell us about your most recent job', 'Tell us about your education',
  'What are your strongest skills?', 'Showcase your best projects', 'Add anything else that strengthens your resume',
  'Tell us about your professional journey', 'Your resume is ready to review',
];

const SUBTITLES = [
  'We suggest including an email and phone number.', 'We’ll start there and work backward.',
  'Employers quickly scan education. We’ll take care of the formatting.', 'Highlight the skills that make you a strong candidate.',
  'Show work that demonstrates your experience and skills.', 'These sections are optional and can be added later.',
  'Give employers a quick overview of their experience and strengths.', 'Review the live resume and make any final changes before downloading.',
];

function StepContent({ index, props }: { index: number; props: StepProps }) {
  switch (index) {
    case 0: return <PersonalStep {...props} />;
    case 1: return <ExperienceStep {...props} />;
    case 2: return <EducationStep {...props} />;
    case 3: return <SkillsStep {...props} />;
    case 4: return <ProjectsStep {...props} />;
    case 5: return <MoreStep {...props} />;
    case 6: return <SummaryStep {...props} />;
    default: return <div className="space-y-4"><div className="rounded-2xl border border-[#f8d8c6] bg-[#fff8f3] p-5"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f47c3c] text-white"><Check className="h-5 w-5" /></div><div><h2 className="text-lg font-bold text-[#230939]">Your resume is ready</h2><p className="mt-1 text-sm leading-6 text-[#667085]">Review the live resume preview. You can go back and edit any section before downloading.</p></div></div></div><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-[#e6e7eb] bg-white p-4"><div className="text-sm font-bold text-[#230939]">Final check</div><p className="mt-1 text-sm leading-6 text-[#667085]">Make sure your contact details and most relevant achievements are accurate.</p></div><div className="rounded-xl border border-[#e6e7eb] bg-white p-4"><div className="text-sm font-bold text-[#230939]">PDF ready</div><p className="mt-1 text-sm leading-6 text-[#667085]">The downloaded PDF uses the same data and template shown in the live preview.</p></div></div></div>;
  }
}

function PagePreview({ data, settings }: { data: ResumeData; settings: ResumeSettings }) {
  const documentRef = useRef<HTMLDivElement>(null); const [pages, setPages] = useState(1); const [page, setPage] = useState(1); const scale = 0.43;
  useEffect(() => { const measure = () => { if (documentRef.current) setPages(Math.max(1, Math.ceil(documentRef.current.scrollHeight / 1123))); }; measure(); const observer = new ResizeObserver(measure); if (documentRef.current) observer.observe(documentRef.current); return () => observer.disconnect(); }, [data, settings]);
  useEffect(() => setPage((p) => Math.min(p, pages)), [pages]);
  return <div className="flex h-full min-h-0 flex-col"><div className="mb-3 flex shrink-0 items-center justify-between"><div><strong className="text-sm text-[#230939]">Live Resume Preview</strong><div className="text-[11px] text-[#667085]">Updates as you type</div></div></div><div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-[#dedfe2] bg-[#ececec] p-3"><div className="relative h-full w-full overflow-hidden"><div ref={documentRef} className="absolute left-1/2 top-2 origin-top-left shadow-[0_18px_45px_-22px_rgba(15,23,42,.5)]" style={{ width: 794, minHeight: 1123, transform: `translateX(-50%) translateY(-${(page - 1) * 1123 * scale}px) scale(${scale})` }}><ResumeDocument data={data} settings={settings} /></div></div></div><div className="mt-3 flex shrink-0 items-center justify-center gap-3"><button aria-label="Previous resume page" type="button" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e6e7eb] bg-white text-[#230939] disabled:opacity-30" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}><ChevronLeft className="h-4 w-4" /></button><span className="min-w-12 text-center text-[10px] font-bold text-[#230939]">Page {page} of {pages}</span><button aria-label="Next resume page" type="button" className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e6e7eb] bg-white text-[#230939] disabled:opacity-30" disabled={page === pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}><ChevronRight className="h-4 w-4" /></button></div></div>;
}

export function OrricaResumeWizard({ data, settings, updateData, updateSettings, onFinish, finishing }: StepProps & { onFinish: () => void; finishing?: boolean }) {
  const [index, setIndex] = useState(0); const step = STEPS[index]; const last = index === STEPS.length - 1; const completion = Math.round((index / (STEPS.length - 1)) * 100);
  const next = () => { if (index === 0) { const { fullName, phone, email } = data.personalInfo; if (!fullName?.trim() || !phone?.trim() || !email?.trim()) { toast({ title: 'Complete your contact details', description: 'Full Name, Phone, and Email are required before continuing.', variant: 'error' }); return; } } if (last) return onFinish(); setIndex((i) => i + 1); };
  const back = () => setIndex((i) => Math.max(0, i - 1));
  return <div className="oe-resume-wizard h-[100dvh] min-h-[100dvh] overflow-hidden bg-white text-[#111827]">
    <header className="flex h-[64px] shrink-0 items-center border-b border-[#ececef] bg-white px-4 sm:px-6"><a href="/" className="shrink-0" aria-label="Orrica Edge home"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[27px] w-auto" /></a><div className="ml-5 hidden h-6 w-px bg-[#ececef] sm:block" /><div className="ml-4 hidden min-w-0 sm:block"><div className="text-xs font-bold text-[#230939]">Resume Builder</div><div className="text-[10px] text-[#8a919d]">Build your resume step by step</div></div><div className="ml-auto flex items-center gap-3 text-[11px] text-[#667085] sm:gap-5"><span className="hidden items-center gap-1.5 font-semibold text-[#1f7a4f] sm:flex"><ShieldCheck className="h-4 w-4" /> Saved privately</span><span>Step {index + 1} of {STEPS.length}</span><a href="/" className="font-bold text-[#230939] hover:text-[#f47c3c]">Exit</a></div></header>
    <div className="grid min-h-0 flex-1 grid-cols-[238px_minmax(0,1fr)_400px]">
      <aside className="min-h-0 overflow-hidden border-r border-[#ececef] bg-white px-4 py-5"><div className="flex h-full min-h-0 flex-col"><div className="px-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#8a919d]">Build your resume</div><div className="relative mt-5 space-y-1"><div className="absolute left-[27px] top-5 bottom-5 w-px bg-[#e3e5e8]" />{STEPS.map(([label, description], i) => { const active = i === index; const complete = i < index; return <button key={label} type="button" disabled={i > index} onClick={() => i <= index && setIndex(i)} className={`relative z-10 flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors ${active ? 'bg-[#fff1e8]' : 'hover:bg-[#fafafa]'} disabled:cursor-default disabled:opacity-60`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold ${active ? 'border-[#f47c3c] bg-[#f47c3c] text-white' : complete ? 'border-[#f47c3c] bg-white text-[#f47c3c]' : 'border-[#d9dce1] bg-white text-[#7a8190]'}`}>{complete ? <Check className="h-3.5 w-3.5" /> : i + 1}</span><span className="min-w-0"><strong className={`block text-[13px] leading-4 ${active ? 'text-[#230939]' : 'text-[#4b5563]'}`}>{label}</strong><small className="mt-0.5 block truncate text-[10px] text-[#8a919d]">{description}</small></span></button>; })}</div><div className="mt-6 border-t border-[#ececef] pt-4"><div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[.08em] text-[#8a919d]"><span>Resume completeness</span><span className="text-[#f47c3c]">{completion}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f0f1f2]"><div className="h-full rounded-full bg-[#f47c3c] transition-all duration-300" style={{ width: `${Math.max(2, completion)}%` }} /></div></div><nav className="mt-auto space-y-1.5 border-t border-[#ececef] pt-4 text-[10px] font-semibold text-[#667085]"><a href="/terms" className="block hover:text-[#f47c3c]">Terms & Conditions</a><a href="/privacy" className="block hover:text-[#f47c3c]">Privacy Policy</a><a href="/accessibility" className="block hover:text-[#f47c3c]">Accessibility</a><a href="/about" className="block hover:text-[#f47c3c]">Contact Us</a><div className="pt-1 text-[9px] font-normal text-[#a0a5ad]">© 2026 Orrica Edge</div></nav></div></aside>
      <main className="min-h-0 min-w-0 overflow-hidden bg-white"><div className="flex h-full min-h-0 flex-col"><div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 pb-6 pt-7 sm:px-8 sm:pt-9 lg:px-10"><div className="mx-auto w-full max-w-[820px]"><button type="button" onClick={back} disabled={index === 0} className="mb-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#667085] hover:text-[#f47c3c] disabled:invisible"><ArrowLeft className="h-3.5 w-3.5" /> Go Back</button><div className="text-[10px] font-bold uppercase tracking-[.14em] text-[#f47c3c]">{step[0]}</div><h1 className="mt-2 max-w-[760px] text-[27px] font-bold leading-[1.12] tracking-[-.025em] text-[#111827] sm:text-[34px]">{HEADINGS[index]}</h1><p className="mt-2 max-w-[680px] text-[14px] leading-6 text-[#667085] sm:text-[15px]">{SUBTITLES[index]}</p>{index === 0 && <p className="mt-3 text-[11px] text-[#8a919d]">* indicates a required field</p>}<div className="mt-6 pb-2">{StepContent({ index, props: { data, settings, updateData, updateSettings } })}</div></div></div><div className="flex h-[70px] shrink-0 items-center gap-2 border-t border-[#ececef] bg-white px-5 sm:px-8 lg:px-10"><div className="mx-auto flex w-full max-w-[820px] items-center gap-2"><Button variant="ghost" onClick={back} disabled={index === 0} className="h-11 rounded-lg border border-[#e5e7eb] px-4 font-bold text-[#230939] hover:bg-[#fff8f3]"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button><div className="flex-1" />{index > 0 && index < STEPS.length - 1 && <Button variant="outline" onClick={next} disabled={finishing} className="h-11 rounded-lg border border-[#e5e7eb] px-5 font-bold text-[#230939] hover:border-[#f47c3c] hover:bg-[#fff8f3]">Skip</Button>}<Button onClick={next} disabled={finishing} className="h-11 min-w-[138px] rounded-lg bg-[#f47c3c] px-5 font-bold text-white shadow-none hover:bg-[#e5682e]">{last ? (finishing ? 'Saving…' : 'Download Resume') : <>Next: {STEPS[index + 1]?.[0] ?? 'Finish'} <ArrowRight className="ml-1.5 h-4 w-4" /></>}</Button></div></div></div></main>
      <aside className="min-h-0 overflow-hidden border-l border-[#ececef] bg-[#fafafa] px-4 py-5 sm:px-5"><PagePreview data={data} settings={settings} /></aside>
    </div>
    <style jsx global>{`
      .oe-resume-wizard,.oe-resume-wizard *{font-family:"Proxima Nova",Arial,sans-serif}.oe-resume-wizard h1,.oe-resume-wizard h2,.oe-resume-wizard h3,.oe-resume-wizard strong,.oe-resume-wizard button,.oe-resume-wizard label{font-weight:700}.oe-resume-wizard input,.oe-resume-wizard textarea,.oe-resume-wizard select{min-height:50px;border-color:#e3e5e8!important;border-radius:9px!important;background:#fff!important;color:#111827!important;box-shadow:none!important;font-size:16px!important}.oe-resume-wizard input:focus,.oe-resume-wizard textarea:focus,.oe-resume-wizard select:focus{border-color:#f47c3c!important;box-shadow:0 0 0 3px rgba(244,124,60,.12)!important;outline:none!important}.oe-resume-wizard input::placeholder,.oe-resume-wizard textarea::placeholder{color:#98a2b3!important;opacity:1!important}body:has(.oe-resume-wizard),html:has(.oe-resume-wizard){overflow:hidden!important}
      @media(max-width:1100px) and (min-width:901px){.oe-resume-wizard>div{grid-template-columns:210px minmax(0,1fr) 330px}.oe-resume-wizard main>div>div:first-child{padding-left:24px!important;padding-right:24px!important}}
      @media(max-width:900px){.oe-resume-wizard>div{display:flex!important;flex-direction:column!important;height:calc(100dvh - 64px)!important}.oe-resume-wizard>div>aside:first-child,.oe-resume-wizard>div>aside:last-child{display:none!important}.oe-resume-wizard main{height:100%!important;min-height:0!important}.oe-resume-wizard main>div>div:first-child{padding:52px 16px 20px!important}.oe-resume-wizard main h1{font-size:25px!important}.oe-resume-wizard main>div>div:last-child{height:64px!important;padding:8px 12px!important}.oe-resume-wizard header{height:64px!important}.oe-resume-wizard:after{content:"";position:absolute;left:14px;right:14px;top:72px;height:4px;border-radius:999px;background:#f0f1f2;box-shadow:inset 0 0 0 0 #f47c3c;pointer-events:none}.oe-resume-wizard input,.oe-resume-wizard textarea,.oe-resume-wizard select{font-size:16px!important}}
      @media(max-width:560px){.oe-resume-wizard header{padding-left:13px!important;padding-right:13px!important}.oe-resume-wizard header img{height:24px!important}.oe-resume-wizard main>div>div:first-child{padding-left:13px!important;padding-right:13px!important}.oe-resume-wizard main h1{font-size:24px!important}.oe-resume-wizard main>div>div:last-child{padding-left:10px!important;padding-right:10px!important}.oe-resume-wizard main>div>div:last-child button{min-width:0!important;padding-left:12px!important;padding-right:12px!important;font-size:12px!important}}
    `}</style>
  </div>;
}