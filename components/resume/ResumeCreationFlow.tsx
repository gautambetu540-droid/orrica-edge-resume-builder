'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FileUp, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
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
      <div className="text-center md:text-left"><div className="mb-5 inline-flex rounded-full border border-[#f8d8c6] bg-[#fff8f3] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#f47c3c]">Orrica Edge Resume Builder</div>
        <h1 className="text-[40px] font-extrabold leading-[1.06] tracking-[-.045em] sm:text-[46px] md:text-[57px]">Just three<br className="md:hidden" /> simple steps</h1>
        <div className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">{items.map(([n,bold,text]) => <div key={n} className="flex items-start gap-4 text-left"><span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f47c3c] text-[14px] font-extrabold text-white">{n}</span><p className="max-w-[500px] text-[14px] leading-6 text-[#444] sm:text-[15px]"><strong>{bold}</strong> {text}</p></div>)}</div>
        <button type="button" onClick={onNext} className="mt-8 h-14 w-full max-w-[310px] rounded-md bg-[#f47c3c] text-[17px] font-extrabold text-white hover:bg-[#e5682e]">Next</button>
        <p className="mt-4 max-w-[310px] text-[10px] leading-5 text-[#777]">By clicking “Next”, you agree to our <a href="/terms" className="font-bold underline">Terms of Use</a> and <a href="/privacy" className="font-bold underline">Privacy Policy</a>.</p>
      </div>
      <div className="hidden md:block"><div className="relative mx-auto h-[340px] max-w-[420px]"><div className="absolute right-4 top-5 h-44 w-44 rounded-full bg-[#f47c3c]"/><div className="absolute right-16 top-16 h-24 w-24 rounded-full bg-white"/><div className="absolute right-2 top-14 z-10 w-[270px] rounded-lg border border-[#cfd4da] bg-white p-4 shadow-[10px_12px_0_0_#10b8b5]"><div className="flex items-center gap-2 border-b border-[#e6e7eb] pb-3"><div className="h-9 w-9 border border-[#cfd4da]"/><div><div className="text-[12px] font-extrabold">ALEX MORGAN</div><div className="text-[7px] text-[#777]">MARKETING SPECIALIST</div></div></div><div className="mt-4 space-y-3"><div className="h-2 w-40 rounded bg-[#eceef1]"/><div className="h-2 w-32 rounded bg-[#eceef1]"/><div className="h-2 w-44 rounded bg-[#eceef1]"/><div className="h-2 w-28 rounded bg-[#eceef1]"/></div></div></div></div></section></main>
    <style jsx global>{`.oe-flow,.oe-flow *{font-family:"Proxima Nova",Arial,sans-serif}@media(max-width:767px){.oe-flow main{align-items:flex-start;padding-top:54px}.oe-flow h1{font-size:2.35rem}}`}</style>
  </div>;
}

function TemplateSelection({ current, onBack, onContinue }: { current: TemplateId; onBack: () => void; onContinue: (id: TemplateId) => void }) {
  const [selected, setSelected] = useState(current);
  return <div className="oe-template min-h-dvh bg-[#f8f9fb] text-[#111827]">
    <header className="sticky top-0 z-30 flex h-[68px] items-center justify-center border-b border-[#e7e9ee] bg-white/95"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[30px] w-auto" /></header>
    <main className="mx-auto max-w-[1320px] px-4 py-7 sm:px-7 lg:px-10"><div className="mx-auto max-w-3xl text-center"><div className="inline-flex rounded-full border border-[#f8d8c6] bg-[#fff8f3] px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#f47c3c]">Step 1</div><h1 className="mt-3 text-[30px] font-extrabold tracking-[-.04em] text-[#230939] sm:text-[42px]">Select a template</h1><p className="mx-auto mt-3 max-w-2xl text-[13px] leading-6 text-[#667085] sm:text-[15px]">Choose a professional design from our library. You can change the template later.</p></div>
      <div className="mx-auto mt-7 grid max-w-[1180px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{TEMPLATES.map((template) => { const active = selected === template.id; const settings = { ...DEFAULT_SETTINGS, template: template.id, font: TEMPLATE_FONTS[template.id] }; return <button key={template.id} type="button" aria-pressed={active} onClick={() => setSelected(template.id)} className={`group relative overflow-hidden rounded-[16px] border-2 bg-white p-2 text-left ${active ? 'border-[#f47c3c] shadow-lg' : 'border-[#e4e7ec]'}`}>{template.tag && <span className="absolute left-5 top-5 z-20 rounded-full bg-[#f47c3c] px-2.5 py-1 text-[9px] font-extrabold text-white">{template.tag}</span>}{active && <span className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#f47c3c] text-white"><Check className="h-4 w-4" /></span>}<MiniTemplate settings={settings}/><div className="px-3 pb-3 pt-3"><h2 className="text-[15px] font-extrabold text-[#230939]">{template.name}</h2><p className="mt-1 text-[11px] leading-5 text-[#667085]">{template.description}</p></div></button>; })}</div>
      <div className="mx-auto mt-7 flex max-w-[1180px] justify-between border-t border-[#e3e6eb] pt-5"><button type="button" onClick={onBack} className="inline-flex h-11 items-center gap-1.5 rounded-xl border bg-white px-4 text-[13px] font-bold"><ArrowLeft className="h-4 w-4"/> Back</button><button type="button" onClick={() => onContinue(selected)} className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-[#f47c3c] px-5 text-[13px] font-bold text-white">Continue <ArrowRight className="h-4 w-4"/></button></div>
    </main>
    <style jsx global>{`.oe-template,.oe-template *{font-family:"Proxima Nova",Arial,sans-serif}.oe-template .resume-page{transform-origin:top left}`}</style>
  </div>;
}

function CreationChoice({ data, updateData, onBack, onStart }: { data: ResumeData; updateData: (u: (d: ResumeData) => ResumeData) => void; onBack: () => void; onStart: () => void }) {
  return <div className="min-h-dvh bg-white text-[#230939]">
    <header className="flex h-[68px] items-center justify-center border-b border-[#f0f0f0]"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[30px]" /></header>
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14"><div className="text-center"><h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Create your resume your way</h1><p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#667085]">Upload an existing resume and let us build from it, or start fresh with a guided experience.</p></div>
      <div className="mt-10 grid gap-6 md:grid-cols-2"><section className="rounded-2xl border-2 border-[#f47c3c] bg-[#fffaf7] p-6"><div className="mb-5 inline-flex rounded-full bg-[#f47c3c] px-3 py-1 text-xs font-extrabold text-white">RECOMMENDED</div><div className="flex h-40 items-center justify-center rounded-xl bg-white text-[#f47c3c]"><FileUp className="h-20 w-20" /></div><h2 className="mt-6 text-2xl font-extrabold">Upload an existing resume</h2><p className="mt-2 text-sm leading-6 text-[#667085]">Upload your PDF and we’ll extract your information into the builder.</p><div className="mt-5"><ResumeImportCard updateData={updateData}/></div></section>
        <section className="rounded-2xl border-2 border-[#cfe0ff] bg-[#f8fbff] p-6"><div className="mb-5 h-6"/><div className="flex h-40 items-center justify-center rounded-xl bg-white text-[#007EFF]"><Sparkles className="h-20 w-20" /></div><h2 className="mt-6 text-2xl font-extrabold">Start from scratch</h2><p className="mt-2 text-sm leading-6 text-[#667085]">Build your resume step by step with our guided builder.</p><button type="button" onClick={onStart} className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[#007EFF] text-sm font-extrabold text-white">Start New Resume</button></section></div>
      <div className="mt-8 flex justify-between"><button type="button" onClick={onBack} className="inline-flex h-11 items-center gap-1.5 rounded-xl border bg-white px-4 text-sm font-bold"><ArrowLeft className="h-4 w-4"/> Back</button><button type="button" onClick={onStart} className="text-sm font-bold text-[#f47c3c]">Continue to builder <ArrowRight className="inline h-4 w-4"/></button></div></main>
    <style jsx global>{`body{overflow-x:hidden}.oe-choice,.oe-choice *{font-family:"Proxima Nova",Arial,sans-serif}`}</style>
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
