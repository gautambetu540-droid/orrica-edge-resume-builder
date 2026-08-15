'use client';

import { useRef, useState } from 'react';
import { FileText, FileUp, Loader2, Search, Check, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OrricaResumeWizard } from '@/components/wizard/OrricaResumeWizard';
import { ResumeDocument } from '@/components/templates/ResumeDocument';
import { useDraftResume } from '@/lib/hooks/useDraftResume';
import { DEFAULT_SETTINGS, ResumeData, ResumeSettings, TemplateId } from '@/lib/types/resume';
import { toast } from '@/components/ui/toaster';

type TemplateCard = { id: TemplateId; name: string; description: string; category: string; level: string };

const BASE_TEMPLATES: TemplateCard[] = [
  { id: 'modern-ats', name: 'Modern Professional', description: 'Clean ATS-first hierarchy with a modern professional finish.', category: 'Modern', level: 'All Levels' },
  { id: 'classic-professional', name: 'Classic Professional', description: 'Traditional corporate structure with polished spacing.', category: 'Classic', level: 'Experienced' },
  { id: 'minimal', name: 'Minimal Clean', description: 'Quiet typography, strong whitespace and easy scanning.', category: 'Minimal', level: 'All Levels' },
  { id: 'executive', name: 'Executive Editorial', description: 'Premium hierarchy for senior professional profiles.', category: 'Professional', level: 'Experienced' },
  { id: 'modern-two-column', name: 'Modern Sidebar', description: 'Balanced two-column professional layout.', category: 'Modern', level: 'Experienced' },
  { id: 'fresh-graduate', name: 'Graduate Focus', description: 'Education, skills and projects-forward entry-level resume.', category: 'Fresher', level: 'Entry Level' },
  { id: 'bold-header', name: 'Bold Executive', description: 'Strong nameplate and section hierarchy.', category: 'Professional', level: 'Experienced' },
  { id: 'elegant-serif', name: 'Elegant Serif', description: 'Refined serif typography with a premium finish.', category: 'Classic', level: 'Experienced' },
  { id: 'compact-ats', name: 'Compact ATS', description: 'Space-efficient structure for detailed careers.', category: 'ATS Friendly', level: 'Experienced' },
  { id: 'creative-sidebar', name: 'Creative Sidebar', description: 'Distinctive sidebar with recruiter-friendly content flow.', category: 'Creative', level: 'All Levels' },
  { id: 'clean-corporate', name: 'Clean Corporate', description: 'Crisp modern corporate presentation.', category: 'Professional', level: 'All Levels' },
  { id: 'tech-modern', name: 'Tech Modern', description: 'Structured layout for technology profiles.', category: 'IT / Technology', level: 'All Levels' },
  { id: 'simple-chronological', name: 'Simple Chronological', description: 'Straightforward reverse-chronological format.', category: 'ATS Friendly', level: 'All Levels' },
  { id: 'classic-two-column', name: 'Classic Two Column', description: 'Traditional two-column professional format.', category: 'Classic', level: 'Experienced' },
  { id: 'creative-modern', name: 'Creative Modern', description: 'Contemporary hierarchy for creative roles.', category: 'Creative', level: 'All Levels' },
  { id: 'dark-executive', name: 'Dark Executive', description: 'High-contrast executive layout.', category: 'Professional', level: 'Experienced' },
  { id: 'blue-accent', name: 'Blue Accent', description: 'Cool accent system with recruiter-first structure.', category: 'Modern', level: 'All Levels' },
  { id: 'orange-accent', name: 'Orrica Signature', description: 'Orrica Edge signature accent layout.', category: 'Orrica Edge', level: 'All Levels' },
  { id: 'editorial-clean', name: 'Editorial Clean', description: 'Editorial typography with ATS clarity.', category: 'Creative', level: 'Experienced' },
  { id: 'timeline-pro', name: 'Timeline Pro', description: 'Progression-focused career layout.', category: 'Modern', level: 'Experienced' },
];

const TEMPLATES: TemplateCard[] = [
  ...BASE_TEMPLATES,
  ...Array.from({ length: 10 }, (_, i) => ({ id: `fresher-${String(i + 1).padStart(2, '0')}` as TemplateId, name: `Fresher ${i + 1}`, description: 'Entry-level resume prioritizing education, skills and projects.', category: 'Fresher', level: 'Entry Level' })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `photo-${String(i + 1).padStart(2, '0')}` as TemplateId, name: `Photo Resume ${i + 1}`, description: 'Photo-enabled professional resume layout.', category: 'Photo Resume', level: 'All Levels' })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `it-${String(i + 1).padStart(2, '0')}` as TemplateId, name: `IT / Technology ${i + 1}`, description: 'Clean technical resume for software, data, cloud and IT roles.', category: 'IT / Technology', level: 'All Levels' })),
  ...Array.from({ length: 10 }, (_, i) => ({ id: `bpo-${String(i + 1).padStart(2, '0')}` as TemplateId, name: `BPO / Customer Support ${i + 1}`, description: 'Recruiter-friendly resume for voice, chat and customer support.', category: 'BPO / Customer Support', level: 'All Levels' })),
];

const FONT_MAP: Partial<Record<TemplateId, ResumeSettings['font']>> = {
  'modern-ats': 'arial', 'classic-professional': 'times-new-roman', minimal: 'proxima-nova', executive: 'merriweather',
  'modern-two-column': 'arial', 'fresh-graduate': 'proxima-nova', 'bold-header': 'proxima-nova', 'elegant-serif': 'times-new-roman',
  'compact-ats': 'ibm-plex-sans', 'creative-sidebar': 'arial', 'clean-corporate': 'inter', 'tech-modern': 'ibm-plex-sans',
  'simple-chronological': 'arial', 'classic-two-column': 'times-new-roman', 'creative-modern': 'proxima-nova', 'dark-executive': 'inter',
  'blue-accent': 'source-sans-3', 'orange-accent': 'proxima-nova', 'editorial-clean': 'georgia', 'timeline-pro': 'source-sans-3',
};

const ACCENTS = ['#2563EB', '#0F766E', '#7C3AED', '#0891B2', '#16A34A', '#DB2777', '#475569', '#EA580C'];

const SAMPLE: ResumeData = {
  personalInfo: { fullName: 'Alex Morgan', professionalTitle: 'Senior Marketing Specialist', email: 'alex.morgan@email.com', phone: '+1 555 014 2288', city: 'New York, NY', country: 'United States', linkedin: 'linkedin.com/in/alexmorgan', portfolio: 'alexmorgan.com' },
  summary: 'Results-driven marketing specialist with 6+ years of experience building digital campaigns, improving customer acquisition and translating market insights into measurable growth.',
  experience: [], education: [], skills: [], projects: [], certifications: [], languages: [], achievements: [], targetRole: 'Senior Marketing Specialist',
};

function Preview({ settings }: { settings: ResumeSettings }) {
  return <div className="relative h-[230px] overflow-hidden rounded-xl bg-slate-100 sm:h-[270px]"><div className="absolute left-1/2 top-3 w-[794px] -translate-x-1/2 origin-top scale-[0.25] shadow-xl sm:scale-[0.29]"><ResumeDocument data={SAMPLE} settings={settings} /></div></div>;
}

function TemplatePicker({ selected, onSelect }: { selected: TemplateId; onSelect: (id: TemplateId) => void }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', 'Fresher', 'Photo Resume', 'IT / Technology', 'BPO / Customer Support', 'ATS Friendly', 'Modern', 'Classic', 'Professional', 'Creative'];
  const visible = TEMPLATES.filter((t) => (category === 'All' || t.category === category) && `${t.name} ${t.description}`.toLowerCase().includes(query.toLowerCase())).slice(0, 24);
  return <main className="min-h-dvh bg-slate-50 px-4 py-6 sm:px-8 sm:py-8"><div className="mx-auto max-w-7xl"><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Orrica Edge Resume Builder</div><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Choose your resume template</h1><p className="mt-1 text-sm text-slate-500">60+ professional designs across Fresher, Photo, IT and BPO categories.</p></div><div className="relative w-full sm:w-[280px]"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates" className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-400" /></div></div><div className="mb-5 flex gap-2 overflow-x-auto pb-1">{categories.map((c) => <button key={c} type="button" onClick={() => setCategory(c)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${category === c ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'}`}>{c}</button>)}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map((template, index) => { const settings = { ...DEFAULT_SETTINGS, template: template.id, font: FONT_MAP[template.id] ?? DEFAULT_SETTINGS.font, accentColor: ACCENTS[index % ACCENTS.length] }; return <button key={template.id} type="button" onClick={() => onSelect(template.id)} className={`group overflow-hidden rounded-xl border bg-white text-left transition hover:-translate-y-0.5 hover:shadow-lg ${selected === template.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}><Preview settings={settings}/><div className="p-3"><div className="flex items-start justify-between gap-2"><div><h2 className="text-sm font-bold text-slate-900">{template.name}</h2><p className="mt-1 text-[11px] leading-4 text-slate-500">{template.description}</p></div>{selected === template.id && <Check className="h-4 w-4 shrink-0 text-blue-600"/>}</div><div className="mt-2 text-[10px] font-semibold text-slate-400">{template.category} · {template.level}</div></div></button>; })}</div><div className="mt-6 flex justify-end"><button type="button" onClick={() => onSelect(selected)} className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-6 text-sm font-bold text-white">Continue with template <span>→</span></button></div></div></main>;
}

function CreationChoice({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<'upload' | 'scratch'>('upload');
  const [scanning, setScanning] = useState(false);
  const { updateData } = useDraftResume();
  async function importResume(file: File) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) { toast({ title: 'PDF required', description: 'Please upload your resume as a PDF.', variant: 'error' }); return; }
    setScanning(true);
    try {
      const body = new FormData(); body.append('file', file);
      const response = await fetch('/api/resume/scan', { method: 'POST', body, cache: 'no-store', credentials: 'include' });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Could not scan your resume.');
      updateData(() => json.data as ResumeData); onStart();
    } catch (error) { toast({ title: 'Scan failed', description: error instanceof Error ? error.message : 'Could not scan this resume.', variant: 'error' }); }
    finally { setScanning(false); }
  }
  return <main className="min-h-dvh bg-white px-4 py-8 sm:px-8"><div className="mx-auto max-w-4xl"><button type="button" onClick={onBack} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><ArrowLeft className="h-4 w-4"/> Back</button><div className="text-center"><div className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Step 2</div><h1 className="mt-2 text-2xl font-bold text-slate-950">Are you uploading an existing resume?</h1><p className="mt-2 text-sm text-slate-500">Upload a PDF to extract your information, or start fresh.</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><button type="button" onClick={() => setSelected('upload')} className={`rounded-2xl border p-8 text-center ${selected === 'upload' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}><FileUp className="mx-auto h-12 w-12 text-blue-600"/><h2 className="mt-4 text-lg font-bold">Yes, upload my resume</h2><p className="mt-2 text-sm text-slate-500">Extract your existing information and continue editing.</p></button><button type="button" onClick={() => setSelected('scratch')} className={`rounded-2xl border p-8 text-center ${selected === 'scratch' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}><FileText className="mx-auto h-12 w-12 text-blue-600"/><h2 className="mt-4 text-lg font-bold">No, start from scratch</h2><p className="mt-2 text-sm text-slate-500">Build a new resume with guided sections and live preview.</p></button></div><div className="mt-6 flex justify-end"><button type="button" onClick={() => selected === 'scratch' ? onStart() : inputRef.current?.click()} disabled={scanning} className="inline-flex h-11 items-center gap-2 rounded-lg bg-slate-950 px-6 text-sm font-bold text-white disabled:opacity-60">{scanning ? <><Loader2 className="h-4 w-4 animate-spin"/> Processing</> : 'Continue →'}</button></div><input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void importResume(file); e.currentTarget.value = ''; }}/></div></main>;
}

export default function ResumeCreationFlow() {
  const router = useRouter();
  const draft = useDraftResume();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [template, setTemplate] = useState<TemplateId>(draft.settings.template || DEFAULT_SETTINGS.template);
  const [finishing, setFinishing] = useState(false);
  const settings: ResumeSettings = { ...draft.settings, template, font: FONT_MAP[template] ?? draft.settings.font };
  const chooseTemplate = (id: TemplateId) => { setTemplate(id); draft.updateSettings((s) => ({ ...s, template: id, font: FONT_MAP[id] ?? s.font, accentColor: ACCENTS[TEMPLATES.findIndex((t) => t.id === id) % ACCENTS.length] })); setStep(2); };
  const finish = async () => {
    setFinishing(true);
    try {
      const create = await fetch('/api/resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: `${draft.data.personalInfo.fullName || 'Untitled'} Resume` }), credentials: 'include' });
      const created = await create.json();
      if (!create.ok) throw new Error(created.error || 'Please sign in to save your resume.');
      const id = created.resume?.id;
      if (!id) throw new Error('Resume could not be created.');
      const saved = await fetch(`/api/resume/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resume_data: draft.data, template, settings }), credentials: 'include' });
      if (!saved.ok) throw new Error((await saved.json()).error || 'Could not save your resume.');
      router.push(`/resume/${id}`);
    } catch (error) { toast({ title: 'Could not save resume', description: error instanceof Error ? error.message : 'Please try again.', variant: 'error' }); }
    finally { setFinishing(false); }
  };
  if (step === 0) return <div className="min-h-dvh bg-white"><div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24"><div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white"><FileText className="h-7 w-7"/></div><div className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Orrica Edge Resume Builder</div><h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Build a professional resume</h1><p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Choose a professional template, import an existing PDF or start from scratch, then customize fonts, colors, spacing and sections.</p><button type="button" onClick={() => setStep(1)} className="mt-8 inline-flex h-12 items-center rounded-lg bg-slate-950 px-7 text-sm font-bold text-white">Choose a template →</button></div></div>;
  if (step === 1) return <TemplatePicker selected={template} onSelect={chooseTemplate} />;
  return <div className="oe-builder-shell"><OrricaResumeWizard data={draft.data} settings={settings} updateData={draft.updateData} updateSettings={draft.updateSettings} onFinish={finish} finishing={finishing} /></div>;
}
