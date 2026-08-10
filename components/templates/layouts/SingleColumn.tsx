import { ResumeData, ResumeSettings } from '@/lib/types/resume';
import { TemplatePreset } from '@/lib/templates/presets';
import { ResumeHeader } from '../Header';
import { SectionHeading, SECTION_TITLES, isSectionEmpty, renderSectionBody } from '../sections';

export function SingleColumnLayout({
  data,
  settings,
  preset,
}: {
  data: ResumeData;
  settings: ResumeSettings;
  preset: TemplatePreset;
}) {
  const visibleSections = [...settings.sections]
    .filter((s) => s.visible && s.id !== 'header' && !isSectionEmpty(s.id, data))
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      <ResumeHeader info={data.personalInfo} preset={preset} />
      <div className="flex flex-col" style={{ gap: 'var(--section-gap)' }}>
        {visibleSections.map((section) => (
          <div key={section.id} className="break-inside-avoid-page">
            <SectionHeading preset={preset}>{SECTION_TITLES[section.id]}</SectionHeading>
            {renderSectionBody(section.id, data)}
            {preset.dividers && <div className="mt-3 h-px bg-neutral-200" />}
          </div>
        ))}
      </div>
    </div>
  );
}
