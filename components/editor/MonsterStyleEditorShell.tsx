'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Download,
  FileText,
  History,
  LayoutGrid,
  MoreHorizontal,
  Pencil,
  Plus,
  Printer,
  Redo2,
  RotateCcw,
  SearchCheck,
  Settings2,
  Sparkles,
  SpellCheck2,
  Undo2,
  X,
} from 'lucide-react';
import { useResumeStore } from '@/lib/hooks/useResumeStore';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';
import { PreviewPane } from './PreviewPane';
import { DesignPanel } from './DesignPanel';
import { DownloadButton, PrintButton } from './DownloadButton';
import { SectionManager } from './SectionManager';
import { JobOptimizer } from './JobOptimizer';
import { IdleLogout } from '@/components/auth/IdleLogout';
import { PersonalStep } from '@/components/wizard/steps/PersonalStep';
import { SummaryStep } from '@/components/wizard/steps/SummaryStep';
import { ExperienceStep } from '@/components/wizard/steps/ExperienceStep';
import { EducationStep } from '@/components/wizard/steps/EducationStep';
import { SkillsStep } from '@/components/wizard/steps/SkillsStep';
import { ProjectsStep } from '@/components/wizard/steps/ProjectsStep';
import { MoreStep } from '@/components/wizard/steps/MoreStep';

const CONTENT_SECTIONS = [
  { key: 'personal', label: 'Personal info', hint: 'Contact details', Component: PersonalStep },
  { key: 'summary', label: 'Summary', hint: 'Your professional story', Component: SummaryStep },
  { key: 'experience', label: 'Experience', hint: 'Work history', Component: ExperienceStep },
  { key: 'education', label: 'Education', hint: 'Degrees & study', Component: EducationStep },
  { key: 'skills', label: 'Skills', hint: 'What you do best', Component: SkillsStep },
  { key: 'projects', label: 'Projects', hint: 'Selected work', Component: ProjectsStep },
  { key: 'more', label: 'More', hint: 'Additional sections', Component: MoreStep },
] as const;

type Tool = 'templates' | 'design' | 'sections' | 'spellcheck' | null;
type Snapshot = { data: ResumeData; settings: ResumeSettings };

type EditorProps = {
  data: ResumeData;
  settings: ResumeSettings;
  updateData: (u: (d: ResumeData) => ResumeData) => void;
  updateSettings: (u: (s: ResumeSettings) => ResumeSettings) => void;
};

function SaveIndicator({ status }: { status: string }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700"><Check className="h-3 w-3" />{status === 'saving' ? 'Saving' : status === 'error' ? 'Retrying' : 'Saved'}</span>;
}

function ContentList({ active, onSelect, data }: { active: string; onSelect: (key: string) => void; data: ResumeData }) {
  const completion = CONTENT_SECTIONS.filter((section) => {
    if (section.key === 'personal') return Boolean(data.personalInfo.fullName && data.personalInfo.email);
    if (section.key === 'summary') return Boolean(data.summary?.trim());
    if (section.key === 'experience') return data.experience.length > 0;
    if (section.key === 'education') return data.education.length > 0;
    if (section.key === 'skills') return data.skills.some((category) => category.items.length > 0);
    if (section.key === 'projects') return data.projects.length > 0;
    return data.certifications.length > 0 || data.languages.length > 0 || data.achievements.length > 0;
  }).length;

  return <div className="flex h-full flex-col overflow-hidden bg-white"><div className="border-b border-neutral-200 px-5 py-4"><div className="flex items-end justify-between"><div><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Resume progress</div><div className="mt-1 text-2xl font-semibold text-neutral-950">{Math.round((completion / CONTENT_SECTIONS.length) * 100)}%</div></div><span className="text-[11px] text-neutral-400">{completion}/{CONTENT_SECTIONS.length} sections</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100"><div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${(completion / CONTENT_SECTIONS.length) * 100}%` }} /></div></div><div className="flex-1 overflow-y-auto p-3"><div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Content</div><div className="space-y-1">{CONTENT_SECTIONS.map((section, index) => { const selected = active === section.key; return <button key={section.key} type="button" onClick={() => onSelect(section.key)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${selected ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-100' : 'text-neutral-600 hover:bg-neutral-50'}`}><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold ${selected ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-400'}`}>{index + 1}</span><span className="min-w-0 flex-1"><span className="block text-xs font-semibold">{section.label}</span><span className="mt-0.5 block truncate text-[10px] text-neutral-400">{section.hint}</span></span></button>; })}</div></div></div>;
}

function EditorContent({ sectionKey, ...props }: EditorProps & { sectionKey: string }) {
  const section = CONTENT_SECTIONS.find((item) => item.key === sectionKey) ?? CONTENT_SECTIONS[0];
  const Component = section.Component;
  return <div className="h-full overflow-y-auto bg-white p-5 sm:p-7"><div className="mx-auto max-w-[620px]"><div className="mb-6"><div className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">{section.label}</div><h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">{section.hint}</h2><p className="mt-1 text-sm leading-6 text-neutral-500">Add only what strengthens your application. You can change everything later.</p></div><Component {...props} /></div></div>;
}

function ToolRail({ tool, onTool }: { tool: Tool; onTool: (tool: Tool) => void }) {
  const items: { id: Exclude<Tool, null>; label: string; icon: ReactNode }[] = [
    { id: 'templates', label: 'Templates', icon: <FileText className="h-5 w-5" /> },
    { id: 'design', label: 'Design & formatting', icon: <Settings2 className="h-5 w-5" /> },
    { id: 'sections', label: 'Add section', icon: <Plus className="h-5 w-5" /> },
    { id: 'spellcheck', label: 'Spell check', icon: <SpellCheck2 className="h-5 w-5" /> },
  ];
  return <aside className="hidden w-[76px] shrink-0 border-r border-neutral-200 bg-white md:flex md:flex-col md:items-center md:py-4"><div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm"><span className="text-sm font-black">oe</span></div>{items.map((item) => <button key={item.id} type="button" onClick={() => onTool(tool === item.id ? null : item.id)} title={item.label} className={`flex w-full flex-col items-center gap-1.5 border-l-2 px-1 py-3.5 text-[9px] font-semibold transition ${tool === item.id ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-transparent text-neutral-500 hover:bg-neutral-50 hover:text-orange-600'}`}>{item.icon}<span className="text-center leading-3">{item.label}</span></button>)}</aside>;
}

function ToolPanel({ tool, props, onClose, onTool }: { tool: Tool; props: EditorProps; onClose: () => void; onTool: (tool: Tool) => void }) {
  if (!tool) return null;
  const title = tool === 'templates' ? 'Templates' : tool === 'design' ? 'Design & formatting' : tool === 'sections' ? 'Add section' : 'Spell check';
  return <section className="absolute inset-y-0 left-[76px] z-30 hidden w-[430px] border-r border-neutral-200 bg-white shadow-xl md:block"><div className="flex h-14 items-center justify-between border-b border-neutral-200 px-5"><div><div className="text-sm font-bold text-neutral-950">{title}</div><div className="text-[10px] text-neutral-400">Orrica Edge Resume Builder</div></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"><X className="h-4 w-4" /></button></div><div className="h-[calc(100%-56px)] overflow-y-auto p-5">{tool === 'templates' && <DesignPanel {...props} setTemplate={(template) => props.updateSettings((s) => ({ ...s, template }))} />}{tool === 'design' && <DesignPanel {...props} setTemplate={(template) => props.updateSettings((s) => ({ ...s, template }))} />}{tool === 'sections' && <div><p className="mb-4 text-sm leading-6 text-neutral-500">Add, hide, reorder and organize the sections that appear on your resume.</p><SectionManager settings={props.settings} updateSettings={props.updateSettings} /></div>}{tool === 'spellcheck' && <SpellCheckPanel />}</div></section>;
}

function SpellCheckPanel() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => { document.querySelectorAll('input, textarea, [contenteditable="true"]').forEach((el) => el.setAttribute('spellcheck', 'true')); }, []);
  return <div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><SpellCheck2 className="h-6 w-6" /></div><h3 className="mt-4 text-lg font-bold text-neutral-950">Spell check</h3><p className="mt-1 text-sm leading-6 text-neutral-500">Orrica Edge uses your browser’s built-in spell checker while you edit. Misspelled words are underlined as you type.</p><button type="button" onClick={() => { setEnabled((value) => !value); document.querySelectorAll('input, textarea, [contenteditable="true"]').forEach((el) => el.setAttribute('spellcheck', String(!enabled))); }} className={`mt-5 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left ${enabled ? 'border-orange-200 bg-orange-50' : 'border-neutral-200 bg-white'}`}><span className="text-sm font-semibold">Spell checking</span><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${enabled ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-500'}`}>{enabled ? 'ON' : 'OFF'}</span></button><div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs leading-5 text-neutral-500"><strong className="text-neutral-800">Tip:</strong> Right-click an underlined word to see the correction options provided by your browser.</div></div>;
}

function MobileTools({ tool, onTool }: { tool: Tool; onTool: (tool: Tool) => void }) { return <div className="flex gap-2 overflow-x-auto border-b border-neutral-200 bg-white px-3 py-2 md:hidden">{([['templates','Templates',FileText],['design','Design',Settings2],['sections','Add section',Plus],['spellcheck','Spell check',SpellCheck2]] as const).map(([id,label,Icon]) => <button key={id} type="button" onClick={() => onTool(tool === id ? null : id)} className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ${tool === id ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-600'}`}><Icon className="h-3.5 w-3.5" />{label}</button>)}</div>; }

export function MonsterStyleEditorShell({ resumeId, title, data, settings }: { resumeId: string; title: string; data: ResumeData; settings: ResumeSettings }) {
  const store = useResumeStore();
  const [activeSection, setActiveSection] = useState('personal');
  const [tool, setTool] = useState<Tool>(null);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [moreOpen, setMoreOpen] = useState(false);
  const past = useRef<Snapshot[]>([]);
  const future = useRef<Snapshot[]>([]);
  const historyTimer = useRef<number | null>(null);

  useEffect(() => { store.init({ id: resumeId, title, data, settings }); past.current = []; future.current = []; }, [resumeId]);

  const remember = () => {
    if (historyTimer.current) window.clearTimeout(historyTimer.current);
    const snapshot = { data: store.data, settings: store.settings };
    past.current = [...past.current.slice(-49), snapshot];
    future.current = [];
    historyTimer.current = window.setTimeout(() => { historyTimer.current = null; }, 450);
  };
  const updateData = (updater: (d: ResumeData) => ResumeData) => { remember(); store.updateData(updater); };
  const updateSettings = (updater: (s: ResumeSettings) => ResumeSettings) => { remember(); store.updateSettings(updater); };
  const undo = () => { const previous = past.current.pop(); if (!previous) return; future.current = [{ data: store.data, settings: store.settings }, ...future.current.slice(0, 49)]; store.updateData(() => previous.data); store.updateSettings(() => previous.settings); };
  const redo = () => { const next = future.current.shift(); if (!next) return; past.current = [...past.current.slice(-49), { data: store.data, settings: store.settings }]; store.updateData(() => next.data); store.updateSettings(() => next.settings); };

  if (!store.resumeId) return <div className="flex h-dvh items-center justify-center bg-neutral-50 text-sm text-neutral-400">Loading your resume…</div>;
  const fileName = `${(store.data.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
  const editorProps = { data: store.data, settings: store.settings, updateData, updateSettings };

  return <div className="oe-monster-editor flex h-dvh flex-col overflow-hidden bg-neutral-100 text-neutral-950"><IdleLogout />
    <header className="flex h-[60px] shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-3 sm:px-5 no-print"><Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100" aria-label="Back"><ArrowLeft className="h-4 w-4" /></Link><div className="h-5 w-px bg-neutral-200" /><div className="min-w-0 flex-1"><input value={store.title} onChange={(e) => store.setTitle(e.target.value)} className="w-full max-w-[360px] truncate bg-transparent text-sm font-bold outline-none" aria-label="Resume name" /><div className="text-[10px] text-neutral-400">Orrica Edge Resume Builder</div></div><SaveIndicator status={store.saveStatus} /><div className="hidden items-center gap-1 md:flex"><button type="button" onClick={undo} className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100" title="Undo"><Undo2 className="h-4 w-4" /></button><button type="button" onClick={redo} className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100" title="Redo"><Redo2 className="h-4 w-4" /></button><div className="mx-1 h-5 w-px bg-neutral-200" /><button type="button" onClick={() => setMoreOpen((v) => !v)} className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100">More options <ChevronDown className="h-3.5 w-3.5" /></button><div className="relative">{moreOpen && <div className="absolute right-0 top-10 z-50 w-52 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl"><Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-neutral-50"><History className="h-3.5 w-3.5" />Back to dashboard</Link><button type="button" onClick={() => window.location.reload()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-neutral-50"><RotateCcw className="h-3.5 w-3.5" />Reload saved version</button><Link href="/templates" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs hover:bg-neutral-50"><LayoutGrid className="h-3.5 w-3.5" />Browse templates</Link></div>}</div><PrintButton resumeId={resumeId} /><DownloadButton resumeId={resumeId} fileName={fileName} /></div></header>
    <div className="relative flex min-h-0 flex-1">
      <ToolRail tool={tool} onTool={setTool} />
      <ToolPanel tool={tool} props={editorProps} onClose={() => setTool(null)} onTool={setTool} />
      <main className="flex min-w-0 flex-1">
        <section className={`hidden w-[320px] shrink-0 border-r border-neutral-200 bg-white lg:block ${tool ? 'opacity-40 pointer-events-none' : ''}`}><ContentList active={activeSection} onSelect={setActiveSection} data={store.data} /></section>
        <section className={`min-w-0 flex-1 ${tool ? 'hidden xl:block' : ''}`} aria-label="Resume editor"><div className="h-full overflow-hidden"><EditorContent sectionKey={activeSection} {...editorProps} /></div></section>
        <section className="hidden min-w-0 flex-1 md:block" aria-label="Live resume preview"><PreviewPane data={store.data} settings={store.settings} activeSection="" /></section>
      </main>
    </div>
    <div className="md:hidden flex min-h-0 flex-1 flex-col"> <MobileTools tool={tool} onTool={setTool} /><div className="min-h-0 flex-1 overflow-y-auto">{tool ? <div className="bg-white p-5">{tool === 'templates' || tool === 'design' ? <DesignPanel {...editorProps} setTemplate={(template) => updateSettings((s) => ({ ...s, template }))} /> : tool === 'sections' ? <SectionManager settings={store.settings} updateSettings={updateSettings} /> : <SpellCheckPanel />}</div> : mobileView === 'preview' ? <PreviewPane data={store.data} settings={store.settings} /> : <EditorContent sectionKey={activeSection} {...editorProps} />}</div><nav className="grid shrink-0 grid-cols-3 border-t border-neutral-200 bg-white no-print" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}><button type="button" onClick={() => setMobileView('edit')} className={`flex min-h-[58px] flex-col items-center justify-center gap-1 text-[10px] font-semibold ${mobileView === 'edit' ? 'text-orange-600' : 'text-neutral-400'}`}><Pencil className="h-5 w-5" />Edit</button><button type="button" onClick={() => setMobileView('preview')} className={`flex min-h-[58px] flex-col items-center justify-center gap-1 text-[10px] font-semibold ${mobileView === 'preview' ? 'text-orange-600' : 'text-neutral-400'}`}><FileText className="h-5 w-5" />Preview</button><DownloadButton resumeId={resumeId} fileName={fileName} /></nav></div>
  </div>;
}
