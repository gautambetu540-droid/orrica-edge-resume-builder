'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, FileText, LayoutGrid, Pencil } from 'lucide-react';
import { useResumeStore } from '@/lib/hooks/useResumeStore';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';
import { PreviewPane } from './PreviewPane';
import { DesignPanel } from './DesignPanel';
import { DownloadButton, PrintButton, useDownloadPdf } from './DownloadButton';
import { Loader2, Download as DownloadIcon } from 'lucide-react';
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
  { key: 'personal', label: 'Personal Info', Component: PersonalStep },
  { key: 'summary', label: 'Summary', Component: SummaryStep },
  { key: 'experience', label: 'Experience', Component: ExperienceStep },
  { key: 'education', label: 'Education', Component: EducationStep },
  { key: 'skills', label: 'Skills', Component: SkillsStep },
  { key: 'projects', label: 'Projects', Component: ProjectsStep },
  { key: 'more', label: 'More', Component: MoreStep },
] as const;

function ContentEditor({
  data,
  settings,
  updateData,
  updateSettings,
}: {
  data: ResumeData;
  settings: ResumeSettings;
  updateData: (u: (d: ResumeData) => ResumeData) => void;
  updateSettings: (u: (s: ResumeSettings) => ResumeSettings) => void;
}) {
  const [open, setOpen] = useState<string>('personal');
  return (
    <div className="divide-y">
      {CONTENT_SECTIONS.map(({ key, label, Component }) => (
        <div key={key}>
          <button
            className="w-full flex items-center justify-between py-3.5 px-1 text-left"
            onClick={() => setOpen(open === key ? '' : key)}
          >
            <span className="font-medium text-sm">{label}</span>
            <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${open === key ? 'rotate-180' : ''}`} />
          </button>
          {open === key && (
            <div className="pb-5 px-1">
              <Component data={data} settings={settings} updateData={updateData} updateSettings={updateSettings} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SaveIndicator({ status }: { status: string }) {
  const label = status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : status === 'error' ? 'Retrying…' : '';
  if (!label) return null;
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        status === 'error' ? 'bg-red-50 text-red-600' : 'bg-secondary text-muted-foreground'
      }`}
    >
      {label}
    </span>
  );
}

type MobileView = 'edit' | 'preview' | 'design';

export function EditorShell({
  resumeId,
  title,
  data,
  settings,
}: {
  resumeId: string;
  title: string;
  data: ResumeData;
  settings: ResumeSettings;
}) {
  const store = useResumeStore();
  const [mobileView, setMobileView] = useState<MobileView>('edit');

  useEffect(() => {
    store.init({ id: resumeId, title, data, settings });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  if (!store.resumeId) {
    return <div className="h-dvh flex items-center justify-center text-muted-foreground text-sm">Loading editor…</div>;
  }

  const fileName = `${(store.data.personalInfo.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;

  return (
    <div className="h-dvh flex flex-col bg-white">
      <IdleLogout />
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b px-3 sm:px-4 h-14 shrink-0 no-print">
        <Link href="/dashboard" className="text-neutral-500 hover:text-neutral-800">
          <ArrowLeft className="h-4.5 w-4.5" />
        </Link>
        <input
          value={store.title}
          onChange={(e) => store.setTitle(e.target.value)}
          className="font-medium text-sm bg-transparent outline-none min-w-0 flex-1 sm:flex-none sm:w-56 truncate"
        />
        <SaveIndicator status={store.saveStatus} />
        <div className="flex-1 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2">
          <PrintButton resumeId={resumeId} />
          <DownloadButton resumeId={resumeId} fileName={fileName} />
        </div>
      </header>

      {/* Desktop split view */}
      <div className="hidden md:flex flex-1 min-h-0">
        <div className="w-[420px] shrink-0 border-r flex flex-col min-h-0">
          <div className="flex border-b px-2 pt-2 gap-1 shrink-0">
            <TabButton active={mobileView !== 'design'} onClick={() => setMobileView('edit')} icon={<Pencil className="h-3.5 w-3.5" />}>
              Content
            </TabButton>
            <TabButton active={mobileView === 'design'} onClick={() => setMobileView('design')} icon={<LayoutGrid className="h-3.5 w-3.5" />}>
              Design
            </TabButton>
          </div>
          <div className="flex-1 overflow-y-auto px-4">
            {mobileView === 'design' ? (
              <div className="pt-4">
                <DesignPanel settings={store.settings} updateSettings={store.updateSettings} setTemplate={store.setTemplate} />
              </div>
            ) : (
              <>
                <ContentEditor data={store.data} settings={store.settings} updateData={store.updateData} updateSettings={store.updateSettings} />
                <div className="py-5">
                  <JobOptimizer data={store.data} />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <PreviewPane data={store.data} settings={store.settings} />
        </div>
      </div>

      {/* Mobile view */}
      <div className="flex md:hidden flex-1 min-h-0 flex-col">
        <div className="flex-1 overflow-y-auto">
          {mobileView === 'preview' && <PreviewPane data={store.data} settings={store.settings} />}
          {mobileView === 'edit' && (
            <div className="px-4">
              <ContentEditor data={store.data} settings={store.settings} updateData={store.updateData} updateSettings={store.updateSettings} />
              <div className="py-5">
                <JobOptimizer data={store.data} />
              </div>
            </div>
          )}
          {mobileView === 'design' && (
            <div className="px-4 pt-4">
              <DesignPanel settings={store.settings} updateSettings={store.updateSettings} setTemplate={store.setTemplate} />
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div className="grid grid-cols-4 border-t bg-white shrink-0 no-print" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <MobileNavButton active={mobileView === 'edit'} onClick={() => setMobileView('edit')} icon={<Pencil className="h-5 w-5" />} label="Edit" />
          <MobileNavButton active={mobileView === 'preview'} onClick={() => setMobileView('preview')} icon={<FileText className="h-5 w-5" />} label="Preview" />
          <MobileNavButton active={mobileView === 'design'} onClick={() => setMobileView('design')} icon={<LayoutGrid className="h-5 w-5" />} label="Design" />
          <MobileDownloadButton resumeId={resumeId} fileName={fileName} />
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg ${
        active ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function MobileNavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 py-2.5 ${active ? 'text-primary' : 'text-neutral-400'}`}
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function MobileDownloadButton({ resumeId, fileName }: { resumeId: string; fileName: string }) {
  const { download, downloading } = useDownloadPdf(resumeId, fileName);
  return (
    <button onClick={download} disabled={downloading} className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-primary">
      {downloading ? <Loader2 className="h-5 w-5 animate-spin" /> : <DownloadIcon className="h-5 w-5" />}
      <span className="text-[10px] font-medium">Download</span>
    </button>
  );
}
