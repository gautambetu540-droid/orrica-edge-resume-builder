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
      <style>{`
        @media print {
          .resume-sections-stack {
            display: block !important;
          }

          .resume-sections-stack > [data-resume-section] {
            margin-bottom: var(--section-gap) !important;
            break-inside: auto !important;
            page-break-inside: auto !important;
          }

          .resume-sections-stack > [data-resume-section]:last-child {
            margin-bottom: 0 !important;
          }

          /* Never allow the document header to become a fixed/repeated print header. */
          #resume-document-root .resume-print-header {
            position: static !important;
            float: none !important;
            display: block !important;
            break-before: auto !important;
            break-after: avoid-page !important;
            page-break-after: avoid !important;
          }

          /* Keep each experience/education/achievement item together when possible. */
          #resume-document-root [data-resume-entry] {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

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
