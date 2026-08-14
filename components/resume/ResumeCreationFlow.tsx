'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Download, FileText, FileUp, Loader2, Mail, Printer, ShieldCheck, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OrricaResumeWizard } from '@/components/wizard/OrricaResumeWizard';
import { ResumeImportCard } from '@/components/wizard/ResumeImportCard';
import { ResumeDocument } from '@/components/templates/ResumeDocument';
import { useDraftResume } from '@/lib/hooks/useDraftResume';
import { DEFAULT_SETTINGS, ResumeData, ResumeSettings, TemplateId } from '@/lib/types/resume';
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

const SAMPLE_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: 'Alex Morgan', professionalTitle: 'Senior Marketing Specialist', email: 'alex.morgan@email.com',
    phone: '+1 555 014 2288', city: 'New York, NY', country: 'United States',
    linkedin: 'linkedin.com/in/alexmorgan', portfolio: 'alexmorgan.com',
  },
  summary: 'Results-driven marketing specialist with 6+ years of experience building digital campaigns, improving customer acquisition and translating market insights into measurable growth. Skilled in content strategy, lifecycle marketing and cross-functional execution.',
  experience: [
    { id: 'sample-exp-1', company: 'Northstar Digital', jobTitle: 'Senior Marketing Specialist', location: 'New York, NY', startDate: '2022-01', endDate: '', currentlyWorking: true, responsibilities: 'Lead integrated campaigns across paid, organic and lifecycle channels.', achievements: ['Increased qualified pipeline by 38% through a redesigned demand-generation program.', 'Improved campaign conversion rate by 24% through testing, segmentation and landing-page optimization.'] },
    { id: 'sample-exp-2', company: 'Brightline Media', jobTitle: 'Marketing Specialist', location: 'Boston, MA', startDate: '2019-06', endDate: '2021-12', currentlyWorking: false, responsibilities: 'Managed content, email and performance marketing initiatives for B2B clients.', achievements: ['Grew organic traffic by 52% in 18 months through content strategy and technical SEO improvements.', 'Coordinated campaigns across sales, design and product teams to deliver launches on schedule.'] },
  ],
  education: [{ id: 'sample-edu-1', institution: 'Boston University', degree: 'Bachelor of Science', fieldOfStudy: 'Marketing', startDate: '2015-09', endDate: '2019-05', grade: '3.8/4.0' }],
  skills: [
    { category: 'technical', items: ['Digital Marketing', 'SEO', 'Analytics', 'Campaign Strategy'] },
    { category: 'soft', items: ['Leadership', 'Communication', 'Problem Solving'] },
    { category: 'tools', items: ['Google Analytics', 'HubSpot', 'Figma', 'Salesforce'] },
    { category: 'languages', items: ['English', 'Spanish'] },
  ],
  projects: [{ id: 'sample-project-1', name: 'Lifecycle Growth Program', role: 'Project Lead', description: 'Designed a segmented lifecycle program that improved activation and retention across key customer cohorts.', technologies: ['HubSpot', 'GA4', 'Looker'] }],
  certifications: [{ id: 'sample-cert-1', name: 'Google Analytics Certification', issuingOrganization: 'Google', issueDate: '2024-03' }],
  languages: [{ id: 'sample-lang-1', language: 'English', proficiency: 'native' }, { id: 'sample-lang-2', language: 'Spanish', proficiency: 'professional' }],
  achievements: [{ id: 'sample-ach-1', type: 'achievement', title: 'Marketing Excellence Award', description: 'Recognized for delivering the highest-performing integrated campaign of the year.', date: '2024-11' }],
  targetRole: 'Senior Marketing Specialist',
};

const TEMPLATE_FONTS: Record<TemplateId, ResumeSettings['font']> = {
  'modern-ats': 'arial', 'classic-professional': 'times-new-roman', minimal: 'proxima-nova', executive: 'merriweather',
  'modern-two-column': 'arial', 'fresh-graduate': 'proxima-nova', 'bold-header': 'proxima-nova', 'elegant-serif': 'times-new-roman',
  'compact-ats': 'ibm-plex-sans', 'creative-sidebar': 'arial',
};

function MiniTemplate({ settings }: { settings: ResumeSettings }) {
  return <div className="relative h-[300px] overflow-hidden rounded-[14px] bg-[#f5f6f8]">
    <div className="absolute left-1/2 top-3 origin-top -translate-x-1/2 scale-[0.31] shadow-[0_18px_38px_-20px_rgba(15,23,42,.5)]">
      <ResumeDocument data={SAMPLE_RESUME_DATA} settings={settings} />
    </div>
  </div>;
}

function Intro({ onNext }: { onNext: () => void }) {
  const items = [
    ['1', 'Select', 'a template from our library of professional designs.'],
    ['2', 'Select', 'if you’re uploading an existing resume or starting from scratch.'],
    ['3', 'Build', 'your resume with our industry-specific bullet points. Customize the details and wrap it up. You’re ready to send!'],
  ];
  return <div className="oe-flow min-h-dvh bg-white text-[#171717]">
    <header className="flex h-[68px] items-center justify-center border-b border-[#f0f0f0]"><a href="/" aria-label="Orrica Edge home"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[30px] w-auto sm:h-[34px]" /></a></header>
    <main className="mx-auto flex min-h-[calc(100dvh-68px)] max-w-6xl items-center px-5 py-8 sm:px-10 sm:py-12"><section className="grid w-full items-center gap-8 md:grid-cols-[1fr_1fr] md:gap-12 lg:px-10">
      <div className="text-center md:text-left"><div className="mb-5 inline-flex rounded-full border border-[#e0eef9] bg-[#f0f9ff] px-4 py-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#0EA5E9]">Orrica Edge Resume Builder</div>
        <h1 className="oe-intro-heading text-[40px] font-bold leading-[1.06] tracking-[-.045em] sm:text-[46px] md:text-[57px]">Just three<br className="md:hidden" /> simple steps</h1>
        <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">{items.map(([n,bold,text]) => <div key={n} className="flex items-start gap-4 text-left"><span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0EA5E9] text-[14px] font-semibold text-white shadow-[0_8px_18px_-12px_rgba(14,165,233,.8)]">{n}</span><p className="max-w-[500px] text-[14px] leading-6 text-[#334155] sm:text-[15px]"><strong className="font-semibold text-[#111827]">{bold}</strong> {text}</p></div>)}</div>
        <button type="button" onClick={onNext} className="mt-8 h-[58px] w-full max-w-[330px] rounded-[6px] bg-[#0EA5E9] text-[17px] font-semibold text-white shadow-[0_14px_30px_-18px_rgba(14,165,233,.75)] transition hover:bg-[#0284C7] hover:shadow-[0_18px_34px_-18px_rgba(14,165,233,.82)]">Next</button>
        <p className="mt-4 max-w-[330px] text-[10px] leading-5 text-[#64748B]">By clicking “Next”, you agree to our <a href="/terms" className="font-semibold underline">Terms of Use</a> and <a href="/privacy" className="font-semibold underline">Privacy Policy</a>.</p>
      </div>

      <div className="oe-intro-visual hidden md:block" aria-label="Animated resume preview">
        <div className="oe-intro-scene">
          <div className="oe-intro-aura oe-intro-aura-one" />
          <div className="oe-intro-aura oe-intro-aura-two" />
          <div className="oe-intro-orbit-line oe-intro-orbit-line-one" />
          <div className="oe-intro-orbit-line oe-intro-orbit-line-two" />
          <div className="oe-intro-signal-dot oe-intro-signal-dot-one" />
          <div className="oe-intro-signal-dot oe-intro-signal-dot-two" />
          <div className="oe-intro-signal-dot oe-intro-signal-dot-three" />
          <div className="oe-intro-orange-beacon" />
          <div className="oe-intro-teal-backplate" />
          <div className="oe-intro-resume-card">
            <div className="oe-intro-scanline" />
            <div className="oe-intro-resume-page"><ResumeDocument data={SAMPLE_RESUME_DATA} settings={DEFAULT_SETTINGS} /></div>
          </div>
          <div className="oe-intro-actions" aria-hidden="true">
            <div className="oe-intro-action oe-intro-action-one"><Download className="h-4 w-4" /><span>Download</span></div>
            <div className="oe-intro-action oe-intro-action-two"><Printer className="h-4 w-4" /><span>Print</span></div>
            <div className="oe-intro-action oe-intro-action-three"><Mail className="h-4 w-4" /><span>Email</span></div>
          </div>
          <div className="oe-intro-mini-note"><span className="oe-intro-mini-dot" /> ATS-ready <span className="oe-intro-mini-separator" /> Live preview <span className="oe-intro-mini-separator" /> PDF export</div>
        </div>
      </div>
    </section></main>
    <style jsx global>{`
      .oe-flow,.oe-flow *{font-family:"Proxima Nova",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif}
      .oe-intro-visual{min-height:390px;display:flex;align-items:center;justify-content:center}
      .oe-intro-scene{position:relative;width:500px;height:430px;max-width:100%;overflow:visible}
      .oe-intro-aura{position:absolute;border-radius:999px;filter:blur(28px);pointer-events:none;animation:oeIntroAura 7s ease-in-out infinite}
      .oe-intro-aura-one{right:46px;top:34px;width:280px;height:280px;background:rgba(14,165,233,.12)}
      .oe-intro-aura-two{right:120px;top:100px;width:180px;height:180px;background:rgba(249,115,22,.10);animation-delay:-2s}
      .oe-intro-orbit-line{position:absolute;border:1px solid rgba(14,165,233,.18);border-radius:999px;transform:rotate(-18deg);pointer-events:none}
      .oe-intro-orbit-line-one{right:24px;top:38px;width:330px;height:300px;animation:oeIntroOrbit 12s linear infinite}
      .oe-intro-orbit-line-two{right:72px;top:74px;width:250px;height:235px;border-color:rgba(249,115,22,.16);transform:rotate(17deg);animation:oeIntroOrbitReverse 14s linear infinite}
      .oe-intro-signal-dot{position:absolute;width:7px;height:7px;border-radius:999px;background:#0EA5E9;box-shadow:0 0 0 6px rgba(14,165,233,.08),0 0 18px rgba(14,165,233,.42);animation:oeIntroDot 5.5s ease-in-out infinite;z-index:2}
      .oe-intro-signal-dot-one{right:56px;top:70px}
      .oe-intro-signal-dot-two{right:370px;top:230px;animation-delay:-1.8s}
      .oe-intro-signal-dot-three{right:92px;top:355px;background:#F97316;box-shadow:0 0 0 6px rgba(249,115,22,.07),0 0 18px rgba(249,115,22,.4);animation-delay:-3.1s}
      .oe-intro-orange-beacon{position:absolute;right:58px;top:60px;width:74px;height:74px;border-radius:999px;background:conic-gradient(from 45deg,rgba(249,115,22,.12),rgba(14,165,233,.2),rgba(249,115,22,.12));filter:blur(1px);animation:oeIntroSpin 18s linear infinite}
      .oe-intro-teal-backplate{position:absolute;right:51px;top:82px;width:342px;height:310px;border-radius:9px;background:linear-gradient(145deg,#0ea5e9,#0284c7);transform:translate(12px,12px);z-index:1;box-shadow:0 18px 40px -24px rgba(14,165,233,.55)}
      .oe-intro-resume-card{position:absolute;right:63px;top:68px;width:342px;height:310px;border:1px solid rgba(148,163,184,.55);border-radius:9px;background:#fff;overflow:hidden;z-index:3;box-shadow:0 28px 60px -34px rgba(15,23,42,.38);animation:oeIntroCard 6s ease-in-out infinite;transform-style:preserve-3d}
      .oe-intro-resume-page{position:absolute;left:50%;top:9px;width:794px;transform:translateX(-50%) scale(.385);transform-origin:top center}
      .oe-intro-scanline{position:absolute;left:0;right:0;top:-25%;height:3px;background:linear-gradient(90deg,transparent,rgba(14,165,233,.75),rgba(249,115,22,.55),transparent);box-shadow:0 0 18px rgba(14,165,233,.5);z-index:10;animation:oeIntroScan 5.2s ease-in-out infinite}
      .oe-intro-actions{position:absolute;right:0;top:112px;z-index:5;width:132px;display:flex;flex-direction:column;gap:10px;align-items:stretch}
      .oe-intro-action{height:42px;display:flex;align-items:center;justify-content:center;gap:7px;border:1px solid rgba(15,23,42,.14);border-radius:999px;background:rgba(255,255,255,.96);color:#111827;font-size:13px;font-weight:600;box-shadow:0 10px 24px -15px rgba(15,23,42,.35);backdrop-filter:blur(10px);animation:oeIntroAction 6s ease-in-out infinite}
      .oe-intro-action svg{color:#0EA5E9}
      .oe-intro-action-one{animation-delay:.05s}
      .oe-intro-action-two{animation-delay:.18s}
      .oe-intro-action-three{animation-delay:.31s}
      .oe-intro-mini-note{position:absolute;right:44px;bottom:7px;display:flex;align-items:center;gap:7px;font-size:10px;font-weight:500;color:#64748B;letter-spacing:.01em;white-space:nowrap}
      .oe-intro-mini-dot{width:6px;height:6px;border-radius:999px;background:#16A34A;box-shadow:0 0 10px rgba(22,163,74,.35)}
      .oe-intro-mini-separator{width:3px;height:3px;border-radius:999px;background:#CBD5E1}
      @keyframes oeIntroCard{0%,100%{transform:translateY(0) rotateX(0deg) rotateY(0deg)}50%{transform:translateY(-7px) rotateX(.6deg) rotateY(-.9deg)}}
      @keyframes oeIntroScan{0%,18%{top:-8%;opacity:0}30%,68%{top:108%;opacity:.9}80%,100%{top:108%;opacity:0}}
      @keyframes oeIntroAura{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(0,-8px,0) scale(1.03)}}
      @keyframes oeIntroOrbit{from{transform:rotate(-18deg) rotate(0deg)}to{transform:rotate(-18deg) rotate(360deg)}}
      @keyframes oeIntroOrbitReverse{from{transform:rotate(17deg) rotate(360deg)}to{transform:rotate(17deg) rotate(0deg)}}
      @keyframes oeIntroDot{0%,100%{transform:translate3d(0,0,0);opacity:.65}50%{transform:translate3d(0,-10px,0);opacity:1}}
      @keyframes oeIntroSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes oeIntroAction{0%,8%{opacity:0;transform:translateX(16px)}15%,82%{opacity:1;transform:translateX(0)}90%,100%{opacity:0;transform:translateX(16px)}}
      @media(max-width:767px){
        .oe-flow main{align-items:flex-start;padding-top:54px}
        .oe-flow h1{font-size:2.35rem}
      }
      @media(prefers-reduced-motion:reduce){
        .oe-intro-aura,.oe-intro-orbit-line,.oe-intro-signal-dot,.oe-intro-orange-beacon,.oe-intro-resume-card,.oe-intro-scanline,.oe-intro-action{animation:none!important}
      }
    `}</style>
  </div>;
}

function TemplateSelection({ current, onBack, onContinue }: { current: TemplateId; onBack: () => void; onContinue: (id: TemplateId) => void }) {
  const [selected, setSelected] = useState(current);
  return <div className="oe-template min-h-dvh bg-[#f8f9fb] text-[#111827]">
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-center border-b border-[#e7e9ee] bg-white/95"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[30px] w-auto" /></header>
    <main className="mx-auto max-w-[1320px] px-4 py-7 sm:px-7 lg:px-10"><div className="mx-auto max-w-3xl text-center"><div className="inline-flex rounded-full border border-[#d8e8ff] bg-[#f1f7ff] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#0b63ce]">Step 1</div><h1 className="mt-3 text-[30px] font-extrabold tracking-[-.04em] text-[#102a43] sm:text-[42px]">Select a template</h1><p className="mx-auto mt-3 max-w-2xl text-[13px] leading-6 text-[#667085] sm:text-[15px]">Choose a professional design from our library. You can change the template later.</p></div>
      <div className="mx-auto mt-7 grid max-w-[1180px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{TEMPLATES.map((template) => { const active = selected === template.id; const settings = { ...DEFAULT_SETTINGS, template: template.id, font: TEMPLATE_FONTS[template.id] }; return <button key={template.id} type="button" aria-pressed={active} onClick={() => setSelected(template.id)} className={`group relative overflow-hidden rounded-[16px] border-2 bg-white p-2 text-left ${active ? 'border-[#0b63ce] shadow-lg' : 'border-[#e4e7ec]'}`}>{template.tag && <span className="absolute left-5 top-5 z-20 rounded-full bg-[#0b63ce] px-2.5 py-1 text-[9px] font-extrabold text-white">{template.tag}</span>}{active && <span className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#0b63ce] text-white"><Check className="h-4 w-4" /></span>}<MiniTemplate settings={settings}/><div className="px-3 pb-3 pt-3"><h2 className="text-[15px] font-extrabold text-[#102a43]">{template.name}</h2><p className="mt-1 text-[11px] leading-5 text-[#667085]">{template.description}</p></div></button>; })}</div>
      <div className="mx-auto mt-7 flex max-w-[1180px] justify-between border-t border-[#e3e6eb] pt-5"><button type="button" onClick={onBack} className="inline-flex h-11 items-center gap-1.5 rounded-xl border bg-white px-4 text-[13px] font-bold"><ArrowLeft className="h-4 w-4"/> Back</button><button type="button" onClick={() => onContinue(selected)} className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-[#0b63ce] px-5 text-[13px] font-bold text-white">Continue <ArrowRight className="h-4 w-4"/></button></div>
    </main>
    <style jsx global>{`.oe-template,.oe-template *{font-family:"Proxima Nova",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif}.oe-template .resume-page{transform-origin:top left}`}</style>
  </div>;
}

function CreationChoice({ data, updateData, onBack, onStart }: { data: ResumeData; updateData: (u: (d: ResumeData) => ResumeData) => void; onBack: () => void; onStart: () => void }) {
  const [selected, setSelected] = useState<'upload' | 'scratch'>('scratch');
  const inputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);

  async function importResume(file: File) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast({ title: 'PDF required', description: 'Please upload your existing resume as a PDF.', variant: 'error' });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: 'PDF is too large', description: 'Please use a PDF smaller than 8 MB.', variant: 'error' });
      return;
    }
    setScanning(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/resume/scan', { method: 'POST', body: formData, cache: 'no-store', credentials: 'include' });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Could not scan your resume.');
      updateData(() => json.data as ResumeData);
      toast({ title: 'Resume imported', description: 'Your resume information has been extracted successfully.', variant: 'success' });
      onStart();
    } catch (error) {
      toast({ title: 'Scan failed', description: error instanceof Error ? error.message : 'Could not scan this resume.', variant: 'error' });
    } finally {
      setScanning(false);
    }
  }

  function handleNext() {
    if (selected === 'scratch') onStart();
    else inputRef.current?.click();
  }

  return <div className="oe-choice min-h-dvh bg-white text-[#151b26]">
    <header className="flex h-[68px] items-center border-b border-[#eceff3] bg-[#102a43] px-5 sm:px-8"><a href="/" aria-label="Orrica Edge home"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[30px] w-auto brightness-0 invert" /></a></header>
    <main className="mx-auto flex min-h-[calc(100dvh-68px)] max-w-[1120px] flex-col px-5 py-9 sm:px-8 sm:py-10">
      <div className="text-center">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-.025em] text-[#151b26] sm:text-[32px]">Are you uploading an existing resume?</h1>
        <p className="mt-3 text-[16px] leading-6 text-[#333b48] sm:text-[17px]">Just review, edit, and update it with new information</p>
      </div>

      <div className="relative mx-auto mt-9 grid w-full max-w-[1040px] gap-7 md:grid-cols-2 md:gap-7 lg:mt-10">
        <button type="button" aria-pressed={selected === 'upload'} onClick={() => setSelected('upload')} className={`relative flex min-h-[274px] flex-col items-center justify-center rounded-[15px] border bg-white px-8 py-9 text-center transition-colors ${selected === 'upload' ? 'border-[#2d8cff] ring-2 ring-[#b9dcff]' : 'border-[#262b33] hover:border-[#2d8cff]'}`}>
          <span className="absolute -top-[13px] left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#8ec5ff] px-3 py-1 text-[12px] font-extrabold uppercase tracking-[-.01em] text-[#102a43]">RECOMMENDED OPTION TO SAVE YOU TIME</span>
          <span className="mb-6 flex h-[62px] w-[62px] items-center justify-center text-[#2d8cff]"><FileUp className="h-[58px] w-[58px] stroke-[1.35]" /></span>
          <h2 className="text-[20px] font-extrabold text-[#151b26]">Yes, upload my resume</h2>
          <p className="mt-3 max-w-[390px] text-[15px] leading-6 text-[#303844]">We'll give you expert guidance to fill out your info and enhance your resume, from start to finish</p>
        </button>

        <button type="button" aria-pressed={selected === 'scratch'} onClick={() => setSelected('scratch')} className={`relative flex min-h-[274px] flex-col items-center justify-center rounded-[15px] border bg-white px-8 py-9 text-center transition-colors ${selected === 'scratch' ? 'border-[#007eff] ring-2 ring-[#b9dcff]' : 'border-[#262b33] hover:border-[#007eff]'}`}>
          <span className="mb-6 flex h-[62px] w-[62px] items-center justify-center text-[#2d8cff]"><FileText className="h-[58px] w-[58px] stroke-[1.35]" /></span>
          <h2 className="text-[20px] font-extrabold text-[#151b26]">No, start from scratch</h2>
          <p className="mt-3 max-w-[390px] text-[15px] leading-6 text-[#303844]">We'll guide you through the whole process so your skills can shine</p>
        </button>
      </div>

      <div className="mt-auto flex items-center justify-between pt-10 sm:pt-12">
        <button type="button" onClick={onBack} className="inline-flex h-[48px] min-w-[160px] items-center justify-center gap-2 rounded-[3px] border-2 border-[#2d8cff] bg-white px-6 text-[15px] font-extrabold text-[#2d68ad] transition-colors hover:bg-[#f5f9ff]"><ArrowLeft className="h-5 w-5" /> Back</button>
        <button type="button" onClick={handleNext} disabled={scanning} className="inline-flex h-[48px] min-w-[160px] items-center justify-center gap-2 rounded-[3px] bg-[#007eff] px-6 text-[15px] font-extrabold text-white transition-colors hover:bg-[#006fdc] disabled:cursor-wait disabled:opacity-70">{scanning ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing</> : 'Next'}</button>
      </div>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importResume(file); event.currentTarget.value = ''; }} />
    </main>
    <style jsx global>{`body{overflow-x:hidden}.oe-choice,.oe-choice *{font-family:"Inter",Arial,sans-serif}.oe-choice button{touch-action:manipulation}@media(max-width:767px){.oe-choice main{min-height:calc(100dvh - 68px);padding-top:42px;padding-bottom:28px}.oe-choice h1{font-size:27px}.oe-choice .grid{grid-template-columns:1fr;gap:18px}.oe-choice .grid button{min-height:235px;padding:30px 22px}.oe-choice .grid button span.absolute{font-size:9px;max-width:90%;text-align:center}.oe-choice .grid button h2{font-size:18px}.oe-choice .grid button p{font-size:14px;line-height:1.45}.oe-choice .flex.items-center.justify-between{padding-top:26px}.oe-choice .flex.items-center.justify-between button{min-width:132px}}`}</style>
  </div>;
}

export default function ResumeCreationFlow() {
  const router = useRouter();
  const { data, settings, updateData, updateSettings } = useDraftResume();
  const [screen, setScreen] = useState<'intro' | 'templates' | 'choice' | 'builder'>('intro');
  const [saving, setSaving] = useState(false);

  const continueFromTemplate = (template: TemplateId) => {
    updateSettings((current) => ({ ...current, template }));
    setScreen('choice');
  };

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const createResponse = await fetch('/api/resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ title: data.personalInfo.fullName ? `${data.personalInfo.fullName} Resume` : 'Untitled Resume' }) });
      const createJson = await createResponse.json().catch(() => ({}));
      if (createResponse.status === 401) { router.push('/login?redirect=/resume/new'); return; }
      if (!createResponse.ok || !createJson.resume?.id) throw new Error(createJson.error || 'Could not create your resume.');
      const id = createJson.resume.id as string;
      const patchResponse = await fetch(`/api/resume/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ resume_data: data, template: settings.template, settings }) });
      const patchJson = await patchResponse.json().catch(() => ({}));
      if (!patchResponse.ok) throw new Error(patchJson.error || 'Could not save your resume.');
      router.push(`/resume/${id}`);
    } catch (error) {
      toast({ title: 'Could not save resume', description: error instanceof Error ? error.message : 'Please try again.', variant: 'error' });
    } finally { setSaving(false); }
  };

  if (screen === 'intro') return <Intro onNext={() => setScreen('templates')} />;
  if (screen === 'templates') return <TemplateSelection current={settings.template} onBack={() => setScreen('intro')} onContinue={continueFromTemplate} />;
  if (screen === 'choice') return <CreationChoice data={data} updateData={updateData} onBack={() => setScreen('templates')} onStart={() => setScreen('builder')} />;

  return <OrricaResumeWizard data={data} settings={settings} updateData={updateData} updateSettings={updateSettings} onFinish={finish} finishing={saving} />;
}
