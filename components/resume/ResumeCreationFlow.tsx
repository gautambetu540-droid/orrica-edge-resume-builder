'use client';

import { DragEvent, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileUp, Loader2, LockKeyhole, ShieldCheck, Sparkles, Upload as UploadIcon, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OrricaResumeWizard } from '@/components/wizard/OrricaResumeWizard';
import { ResumeDocument } from '@/components/templates/ResumeDocument';
import { useDraftResume } from '@/lib/hooks/useDraftResume';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_SETTINGS, EMPTY_RESUME_DATA, ResumeData, ResumeSettings, TemplateId } from '@/lib/types/resume';
import { toast } from '@/components/ui/toaster';

const TEMPLATES: { id: TemplateId; name: string; description: string; tag?: string }[] = [
  { id: 'modern-ats', name: 'Modern ATS', description: 'Clean, recruiter-friendly and ATS optimized.', tag: 'MOST POPULAR' },
  { id: 'classic-professional', name: 'Classic Professional', description: 'Traditional structure with a polished corporate feel.' },
  { id: 'minimal', name: 'Minimal', description: 'Simple typography with generous breathing room.' },
  { id: 'executive', name: 'Executive', description: 'Strong hierarchy for experienced professionals.' },
  { id: 'modern-two-column', name: 'Modern Two Column', description: 'Balanced two-column layout for more content.' },
  { id: 'fresh-graduate', name: 'Fresh Graduate', description: 'Designed to highlight education, projects and skills.' },
  { id: 'bold-header', name: 'Bold Header', description: 'Confident header treatment with clear sections.' },
  { id: 'elegant-serif', name: 'Elegant Serif', description: 'Refined editorial styling for premium roles.' },
  { id: 'compact-ats', name: 'Compact ATS', description: 'Dense, efficient layout for detailed experience.' },
  { id: 'creative-sidebar', name: 'Creative Sidebar', description: 'Distinctive sidebar layout while staying professional.' },
];

const TEMPLATE_FONTS: Record<TemplateId, ResumeSettings['font']> = {
  'modern-ats': 'arial',
  'classic-professional': 'times-new-roman',
  minimal: 'proxima-nova',
  executive: 'merriweather',
  'modern-two-column': 'arial',
  'fresh-graduate': 'proxima-nova',
  'bold-header': 'proxima-nova',
  'elegant-serif': 'times-new-roman',
  'compact-ats': 'ibm-plex-sans',
  'creative-sidebar': 'arial',
};

function MiniTemplate({ settings }: { settings: ResumeSettings }) {
  return (
    <div className="oe-mini-template relative h-[300px] overflow-hidden rounded-[14px] bg-[#f5f6f8]">
      <div className="absolute left-1/2 top-3 origin-top -translate-x-1/2 scale-[0.31] shadow-[0_18px_38px_-20px_rgba(15,23,42,.5)]">
        <ResumeDocument data={SAMPLE_RESUME_DATA} settings={settings} />
      </div>
    </div>
  );
}

function Intro({ onNext }: { onNext: () => void }) {
  const items = [
    ['1', 'Select', 'a template from our library of professional designs.'],
    ['2', 'Select', 'if you’re uploading an existing resume or starting from scratch.'],
    ['3', 'Build', 'your resume with our industry-specific bullet points. Customize the details and wrap it up. You’re ready to send!'],
  ];

  return (
    <div className="oe-flow min-h-dvh bg-white text-[#171717]">
      <header className="flex h-[68px] items-center justify-center border-b border-[#f0f0f0]"><a href="/" aria-label="Orrica Edge home"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[30px] w-auto sm:h-[34px]" /></a></header>
      <main className="mx-auto flex min-h-[calc(100dvh-68px)] max-w-6xl items-center px-5 py-8 sm:px-10 sm:py-12"><section className="grid w-full items-center gap-8 md:grid-cols-[1fr_1fr] md:gap-12 lg:px-10"><div className="text-center md:text-left"><div className="mb-5 inline-flex rounded-full border border-[#e8def2] bg-[#f4f3fb] px-4 py-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#6E46AE]">Orrica Edge Resume Builder</div><h1 className="text-[40px] font-bold leading-[1.06] tracking-[-.045em] sm:text-[46px] md:text-[57px]">Just three<br className="md:hidden" /> simple steps</h1><div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">{items.map(([n,bold,text])=><div key={n} className="flex items-start gap-4 text-left"><span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6E46AE] text-[14px] font-bold text-white">{n}</span><p className="max-w-[500px] text-[14px] leading-6 text-[#444] sm:text-[15px]"><strong className="font-semibold">{bold}</strong> {text}</p></div>)}</div><button type="button" onClick={onNext} className="mt-8 h-14 w-full max-w-[310px] rounded-md bg-[#6E46AE] text-[17px] font-semibold text-white shadow-[0_10px_24px_-16px_rgba(110,70,174,.8)] hover:bg-[#5d3b95]">Next</button><p className="mt-4 max-w-[310px] text-[10px] leading-5 text-[#777]">By clicking “Next”, you agree to our <a href="/terms" className="font-semibold underline">Terms of Use</a> and <a href="/privacy" className="font-semibold underline">Privacy Policy</a>.</p></div><div className="hidden md:block"><div className="relative mx-auto h-[340px] max-w-[420px]"><div className="absolute right-4 top-5 h-44 w-44 rounded-full bg-[#6E46AE]"/><div className="absolute right-16 top-16 h-24 w-24 rounded-full bg-white"/><div className="absolute right-2 top-14 z-10 w-[270px] rounded-lg border border-[#cfd4da] bg-white p-4 shadow-[10px_12px_0_0_#B051AA]"><div className="flex items-center gap-2 border-b border-[#e6e7eb] pb-3"><div className="h-9 w-9 border border-[#cfd4da]"/><div><div className="text-[12px] font-bold">ALEX MORGAN</div><div className="text-[7px] text-[#777]">MARKETING SPECIALIST</div></div></div><div className="mt-4 space-y-3"><div className="h-2 w-40 rounded bg-[#eceef1]"/><div className="h-2 w-32 rounded bg-[#eceef1]"/><div className="h-2 w-44 rounded bg-[#eceef1]"/><div className="h-2 w-28 rounded bg-[#eceef1]"/></div></div><div className="absolute left-2 top-44 z-20 w-[175px] rounded-lg border border-[#cfd4da] bg-white p-4 shadow-lg"><div className="text-[9px] font-bold">Template selected</div><div className="mt-2 h-2 w-24 rounded bg-[#6E46AE]"/><div className="mt-2 text-[7px] text-[#777]">Upload, build and customize.</div></div></div></div></section></main>
      <style jsx global>{`.oe-flow,.oe-flow *{font-family:"Proxima Nova",Arial,sans-serif}.oe-flow button{touch-action:manipulation}@media(max-width:767px){.oe-flow main{align-items:flex-start;padding-top:54px}.oe-flow h1{font-size:2.35rem}.oe-flow .max-w-\\[310px\\]{max-width:none}.oe-flow .space-y-5{margin-top:2rem}.oe-flow .space-y-5>div{gap:.75rem}.oe-flow .space-y-5>div>span{height:2.25rem;width:2.25rem;font-size:.75rem}.oe-flow .space-y-5>div>p{font-size:.875rem;line-height:1.5}}@media(max-width:390px){.oe-flow main{padding-top:38px}.oe-flow h1{font-size:2.05rem}.oe-flow .mb-5{margin-bottom:1rem}.oe-flow .space-y-5{gap:1rem}.oe-flow .space-y-5>div>p{font-size:.82rem}.oe-flow button{height:52px;font-size:16px}}`}</style>
    </div>
  );
}
