import { ResumeData, ResumeSettings } from '@/lib/types/resume';
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
}: {
  data: ResumeData;
  settings: ResumeSettings;
  preset: TemplatePreset;
}) {
  const visibleSections = [...settings.sections]
    .filter(
      (section) =>
        section.visible &&
        section.id !== 'header' &&
        !isSectionEmpty(section.id, data)
    )
    .sort((a, b) => a.order - b.order);

  return (
    <div>
      <ResumeHeader
        info={data.personalInfo}
        preset={preset}
      />

      <div
        className="flex flex-col"
        style={{ gap: 'var(--section-gap)' }}
      >
        {visibleSections.map((section) => {
          // The header is rendered separately above,
          // so only titled resume sections reach this block.
          if (section.id === 'header') {
            return null;
          }

          const title = SECTION_TITLES[section.id];

          return (
            <div
              key={section.id}
              className="break-inside-avoid-page"
            >
              <SectionHeading preset={preset}>
                {title}
              </SectionHeading>

              {renderSectionBody(section.id, data)}

              {preset.dividers && (
                <div className="mt-3 h-px bg-neutral-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
