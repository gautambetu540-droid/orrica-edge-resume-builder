import { ResumeData, ResumeSectionId, ResumeSettings } from '@/lib/types/resume';
import { TemplatePreset } from '@/lib/templates/presets';
import { SectionHeading, SECTION_TITLES, isSectionEmpty, renderSectionBody } from '../sections';

const SIDEBAR_SECTIONS: ResumeSectionId[] = ['skills', 'languages', 'certifications'];
type SectionTitleKey = keyof typeof SECTION_TITLES;
function getSectionTitle(id: ResumeSectionId): string { return id === 'header' ? '' : SECTION_TITLES[id as SectionTitleKey]; }
function ContactBlock({ data }: { data: ResumeData }) {
  const info = data.personalInfo;
  const rows = [info.email, info.phone, [info.city, info.country].filter(Boolean).join(', '), info.linkedin, info.portfolio, info.github].filter(Boolean);
  if (!rows.length) return null;
  return <div className="mb-6 space-y-1 text-[0.84em] break-words">{rows.map((row, index) => <div key={index}>{row}</div>)}</div>;
}
export function TwoColumnLayout({ data, settings, preset, activeSection }: { data: ResumeData; settings: ResumeSettings; preset: TemplatePreset; activeSection?: string }) {
  const ordered = [...settings.sections].filter((section) => section.visible && section.id !== 'header').sort((a, b) => a.order - b.order);
  const sidebar = ordered.filter((section) => SIDEBAR_SECTIONS.includes(section.id) && !isSectionEmpty(section.id, data));
  const main = ordered.filter((section) => !SIDEBAR_SECTIONS.includes(section.id) && !isSectionEmpty(section.id, data));
  const info = data.personalInfo;
  const solid = preset.sidebarVariant === 'solid';
  const soft = preset.sidebarVariant === 'soft';
  return <div className="flex min-h-full">
    <aside className={`w-[31%] shrink-0 px-5 py-7 ${solid ? 'text-white' : 'text-neutral-800'}`} style={{ backgroundColor: solid ? 'var(--accent)' : soft ? '#f4f5f7' : '#fff', borderRight: solid ? 'none' : '1px solid #e5e7eb' }}>
      <div data-resume-section="personal" className="resume-preview-section">{preset.photoAllowed && info.photoUrl && <img src={info.photoUrl} alt="" className={`mb-4 h-20 w-20 rounded-full object-cover border-2 ${solid ? 'border-white/40' : 'border-neutral-200'}`} />}<h1 className="mb-1 text-[1.55em] font-bold leading-tight tracking-[-0.025em]">{info.fullName || 'Your Name'}</h1>{info.professionalTitle && <p className={`mb-4 text-[0.9em] ${solid ? 'text-white/80' : 'text-neutral-500'}`}>{info.professionalTitle}</p>}<ContactBlock data={data} /></div>
      <div className="flex flex-col gap-5">{sidebar.map((section) => <div key={section.id} data-resume-section={section.id} className="resume-preview-section break-inside-avoid"><h2 className="mb-2 text-[0.78em] font-bold uppercase tracking-[0.13em]" style={{ color: solid ? '#fff' : 'var(--accent)' }}>{getSectionTitle(section.id)}</h2><div className={solid ? 'text-white/90 [&_span]:text-white/90 [&_a]:text-white/90' : 'text-neutral-700'}>{renderSectionBody(section.id, data, true)}</div></div>)}</div>
    </aside>
    <main className="flex-1 px-7 py-7" style={{ gap: 'var(--section-gap)' }}>{main.map((section) => <div key={section.id} data-resume-section={section.id} className="resume-preview-section mb-[var(--section-gap)] break-inside-avoid-page last:mb-0"><SectionHeading preset={preset}>{getSectionTitle(section.id)}</SectionHeading>{renderSectionBody(section.id, data)}</div>)}</main>
  </div>;
}
