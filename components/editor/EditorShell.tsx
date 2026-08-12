'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Download as DownloadIcon,
  FileText,
  LayoutGrid,
  Loader2,
  Pencil,
  Sparkles,
} from 'lucide-react';
import { useResumeStore } from '@/lib/hooks/useResumeStore';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';
import { PreviewPane } from './PreviewPane';
import { DesignPanel } from './DesignPanel';
import { DownloadButton, PrintButton, useDownloadPdf } from './DownloadButton';
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

type Panel = 'content' | 'design' | 'improve';

type EditorProps = {
  data: ResumeData;
  settings: ResumeSettings;
  updateData: (u: (d: ResumeData) => ResumeData) => void;
  updateSettings: (u: (s: ResumeSettings) => ResumeSettings) => void;
};

function SaveIndicator({ status }: { status: string }) {
  if (!status) return null;
  const saving = status === 'saving';
  const error = status === 'error';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${error ? 'border-red-200 bg-red-50 text-red-600' : 'border-neutral-200 bg-white text-neutral-500'}`}>
      {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 text-emerald-600" />}
      {error ? 'Saving again' : saving ? 'Saving' : 'Saved'}
    </span>
  );
}

function SectionNav({ active, onSelect, data }: { active: string; onSelect: (key: string) => void; data: ResumeData }) {
  const completion = CONTENT_SECTIONS.filter((section) => {
    if (section.key === 'personal') return Boolean(data.personalInfo.fullName && data.personalInfo.email);
    if (section.key === 'summary') return Boolean(data.summary?.trim());
    if (section.key === 'experience') return data.experience.length > 0;
    if (section.key === 'education') return data.education.length > 0;
    if (section.key === 'skills') return data.skills.some((category) => category.items.length > 0);
    if (section.key === 'projects') return data.projects.length > 0;
    return data.certifications.length > 0 || data.languages.length > 0 || data.achievements.length > 0;
  }).length;

  return (
    <aside className="oe-editor-sidebar w-[236px] shrink-0 border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-4 py-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Resume progress</div>
        <div className="mt-2 flex items-end justify-between">
          <span className="text-2xl font-semibold tracking-tight text-neutral-950">{Math.round((completion / CONTENT_SECTIONS.length) * 100)}%</span>
          <span className="mb-1 text-[11px] text-neutral-400">{completion}/{CONTENT_SECTIONS.length} sections</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
          <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${(completion / CONTENT_SECTIONS.length) * 100}%` }} />
        </div>
      </div>

      <div className="p-3">
        <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Content</div>
        <div className="space-y-0.5">
          {CONTENT_SECTIONS.map((section, index) => {
            const selected = active === section.key;
            return (
              <button key={section.key} type="button" onClick={() => onSelect(section.key)} className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors ${selected ? 'bg-orange-50 text-orange-700' : 'text-neutral-600 hover:bg-neutral-50'}`}>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold ${selected ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-400'}`}>{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-semibold">{section.label}</span>
                  <span className={`mt-0.5 block truncate text-[10px] ${selected ? 'text-orange-600/70' : 'text-neutral-400'}`}>{section.hint}</span>
                </span>
                <ChevronRight className={`h-3.5 w-3.5 ${selected ? 'text-orange-500' : 'text-neutral-300'}`} />
              </button>
            );
          })}
        </div>

        <div className="mt-5 border-t border-neutral-100 pt-4">
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Tools</div>
          <button type="button" className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors ${active === '__improve__' ? 'bg-orange-50 text-orange-700' : 'text-neutral-600 hover:bg-neutral-50'}`} onClick={() => onSelect('__improve__')}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-md ${active === '__improve__' ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-700'}`}><Sparkles className="h-3.5 w-3.5" /></span>
            <span className="text-[12px] font-semibold">Improve with AI</span>
          </button>
          <button type="button" className={`mt-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors ${active === '__design__' ? 'bg-orange-50 text-orange-700' : 'text-neutral-600 hover:bg-neutral-50'}`} onClick={() => onSelect('__design__')}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-md ${active === '__design__' ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-700'}`}><LayoutGrid className="h-3.5 w-3.5" /></span>
            <span className="text-[12px] font-semibold">Design & template</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

function ContentPanel({ sectionKey, ...props }: EditorProps & { sectionKey: string }) {
  if (sectionKey === '__improve__') {
    return (
      <div className="p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><Sparkles className="h-5 w-5" /></div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-neutral-950">Improve your resume</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-500">Use the job description to find gaps and make your resume more relevant.</p>
        <div className="mt-6"><JobOptimizer data={props.data} /></div>
      </div>
    );
  }

  if (sectionKey === '__design__') {
    return (
      <div className="p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800"><LayoutGrid className="h-5 w-5" /></div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-neutral-950">Design your resume</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-500">Choose a template and tune the visual style while keeping the content intact.</p>
        <div className="mt-6"><DesignPanel settings={props.settings} updateSettings={props.updateSettings} setTemplate={(template) => props.updateSettings((current) => ({ ...current, template }))} /></div>
      </div>
    );
  }

  const section = CONTENT_SECTIONS.find((item) => item.key === sectionKey) ?? CONTENT_SECTIONS[0];
  const Component = section.Component;

  return (
    <div className="p-5">
      <div className="mb-6">
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">{section.label}</div>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">{section.hint}</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-500">Add only what strengthens your application. You can change everything later.</p>
      </div>
      <Component {...props} />
    </div>
  );
}

export function EditorShell({ resumeId, title, data, settings }: { resumeId: string; title: string; data: ResumeData; settings: ResumeSettings }) {
  const store = useResumeStore();
  const [activeSection, setActiveSection] = useState('personal');
  const [mobileView, setMobileView] = useState<'edit' | 'preview' | 'design'>('edit');

  useEffect(() => {
    store.init({ id: resumeId, title, data, settings });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  if (!store.resumeId) {
    return <div className="flex h-dvh items-center justify-center bg-neutral-50 text-sm text-neutral-400">Loading your resume…</div>;
  }

  const fileName = `${(store.data.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
  const panel: Panel = activeSection === '__improve__' ? 'improve' : activeSection === '__design__' ? 'design' : 'content';

  return (
    <div className="oe-editor-shell flex h-dvh flex-col bg-neutral-100 text-neutral-950">
      <IdleLogout />

      <header className="oe-editor-header z-40 flex h-16 shrink-0 items-center gap-3 border-b border-neutral-200 bg-white px-3 sm:px-5 no-print">
        <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900" aria-label="Back to dashboard">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="h-5 w-px bg-neutral-200" />
        <div className="min-w-0 flex-1">
          <input value={store.title} onChange={(event) => store.setTitle(event.target.value)} className="w-full max-w-[300px] truncate bg-transparent text-sm font-semibold outline-none placeholder:text-neutral-400" aria-label="Resume name" />
          <div className="mt-0.5 text-[10px] text-neutral-400">Orrica Edge Resume Builder</div>
        </div>
        <SaveIndicator status={store.saveStatus} />
        <div className="hidden items-center gap-2 sm:flex">
          <PrintButton resumeId={resumeId} />
          <DownloadButton resumeId={resumeId} fileName={fileName} />
        </div>
      </header>

      <div className="hidden min-h-0 flex-1 md:flex">
        <SectionNav active={activeSection} onSelect={setActiveSection} data={store.data} />
        <section className="oe-editor-panel w-[430px] shrink-0 overflow-y-auto border-r border-neutral-200 bg-white" aria-label="Resume editor">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
            <span className="text-xs font-semibold text-neutral-700">{panel === 'content' ? 'Edit content' : panel === 'design' ? 'Design' : 'Improve'}</span>
            <span className="text-[10px] text-neutral-400">Changes save automatically</span>
          </div>
          <ContentPanel sectionKey={activeSection} data={store.data} settings={store.settings} updateData={store.updateData} updateSettings={store.updateSettings} />
        </section>
        <section className="min-w-0 flex-1" aria-label="Live resume preview">
          <PreviewPane data={store.data} settings={store.settings} />
        </section>
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:hidden">
        <div className="flex-1 overflow-y-auto">
          {mobileView === 'preview' ? (
            <PreviewPane data={store.data} settings={store.settings} />
          ) : mobileView === 'design' ? (
            <ContentPanel sectionKey="__design__" data={store.data} settings={store.settings} updateData={store.updateData} updateSettings={store.updateSettings} />
          ) : (
            <>
              <div className="oe-mobile-tabs flex gap-2 overflow-x-auto border-b border-neutral-200 bg-white px-3 py-2">
                {CONTENT_SECTIONS.map((section) => (
                  <button key={section.key} type="button" onClick={() => setActiveSection(section.key)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold ${activeSection === section.key ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-600'}`}>{section.label}</button>
                ))}
              </div>
              <ContentPanel sectionKey={activeSection} data={store.data} settings={store.settings} updateData={store.updateData} updateSettings={store.updateSettings} />
            </>
          )}
        </div>

        <div className="oe-mobile-dock grid shrink-0 grid-cols-4 border-t border-neutral-200 bg-white no-print" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <MobileNavButton active={mobileView === 'edit'} onClick={() => setMobileView('edit')} icon={<Pencil className="h-5 w-5" />} label="Edit" />
          <MobileNavButton active={mobileView === 'preview'} onClick={() => setMobileView('preview')} icon={<FileText className="h-5 w-5" />} label="Preview" />
          <MobileNavButton active={mobileView === 'design'} onClick={() => setMobileView('design')} icon={<LayoutGrid className="h-5 w-5" />} label="Design" />
          <MobileDownloadButton resumeId={resumeId} fileName={fileName} />
        </div>
      </div>
    </div>
  );
}

function MobileNavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return <button type="button" onClick={onClick} className={`oe-mobile-nav flex min-h-[58px] flex-col items-center justify-center gap-1 ${active ? 'text-orange-600' : 'text-neutral-400'}`}>{icon}<span className="text-[10px] font-semibold">{label}</span></button>;
}

function MobileDownloadButton({ resumeId, fileName }: { resumeId: string; fileName: string }) {
  const { download, downloading } = useDownloadPdf(resumeId, fileName);
  return <button type="button" onClick={download} disabled={downloading} className="oe-mobile-nav flex min-h-[58px] flex-col items-center justify-center gap-1 text-orange-600 disabled:opacity-60">{downloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <DownloadIcon className="h-5 w-5" />}<span className="text-[10px] font-semibold">Download</span></button>;
}
