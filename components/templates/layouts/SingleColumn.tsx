import { ResumeData, ResumeSectionId, ResumeSettings } from '@/lib/types/resume';
import { TemplatePreset } from '@/lib/templates/presets';
import { ResumeHeader } from '../Header';
import {
  SectionHeading,
  SECTION_TITLES,
  isSectionEmpty,
  renderSectionBody,
} from '../sections';

export function SingleColumnLayout({
  data,
  settings,
  preset,
  activeSection,
}: {
  data: ResumeData;
  settings: ResumeSettings;
  preset: TemplatePreset;
  activeSection?: string;
}) {
  const visibleSections = [...settings.sections]
    .filter((section) => section.visible && section.id !== 'header' && !isSectionEmpty(section.id, data))
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      <div data-resume-section="personal">
        <ResumeHeader info={data.personalInfo} preset={preset} />
      </div>

      <div className="resume-sections-stack flex flex-col" style={{ gap: 'var(--section-gap)' }}>
        {visibleSections.map((section) => {
          if (section.id === 'header') return null;
          const sectionId = section.id as Exclude<ResumeSectionId, 'header'>;
          const title = SECTION_TITLES[sectionId];

          return (
            <div
              key={section.id}
              data-resume-section={section.id}
              className="resume-preview-section rounded-[3px] transition-[background-color,box-shadow] duration-200"
            >
              <SectionHeading preset={preset}>{title}</SectionHeading>
              {renderSectionBody(sectionId, data)}
              {preset.dividers && <div className="mt-3 h-px bg-neutral-200" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
