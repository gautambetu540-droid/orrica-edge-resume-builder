import {
  ResumeData,
  ResumeSectionId,
  ResumeSettings,
} from '@/lib/types/resume';
import { TemplatePreset } from '@/lib/templates/presets';
import {
  SectionHeading,
  SECTION_TITLES,
  isSectionEmpty,
  renderSectionBody,
} from '../sections';

const SIDEBAR_SECTIONS: ResumeSectionId[] = [
  'skills',
  'languages',
  'certifications',
];

function isRenderableSection(
  sectionId: ResumeSectionId
): sectionId is Exclude<ResumeSectionId, 'header'> {
  return sectionId !== 'header';
}

function ContactBlock({ data }: { data: ResumeData }) {
  const info = data.personalInfo;

  const rows = [
    info.email,
    info.phone,
    [info.city, info.country].filter(Boolean).join(', '),
    info.linkedin,
    info.portfolio,
    info.github,
  ].filter(Boolean);

  if (!rows.length) return null;

  return (
    <div className="space-y-1 text-[0.88em] text-white/90 mb-6">
      {rows.map((row, index) => (
        <div key={index} className="break-all">
          {row}
        </div>
      ))}
    </div>
  );
}

export function TwoColumnLayout({
  data,
  settings,
  preset,
}: {
  data: ResumeData;
  settings: ResumeSettings;
  preset: TemplatePreset;
}) {
  const ordered = [...settings.sections]
    .filter(
      (section) =>
        section.visible && isRenderableSection(section.id)
    )
    .sort((a, b) => a.order - b.order);

  const sidebar = ordered.filter(
    (section) =>
      SIDEBAR_SECTIONS.includes(section.id) &&
      !isSectionEmpty(section.id, data)
  );

  const main = ordered.filter(
    (section) =>
      !SIDEBAR_SECTIONS.includes(section.id) &&
      !isSectionEmpty(section.id, data)
  );

  const info = data.personalInfo;

  return (
    <div className="flex" style={{ minHeight: '100%' }}>
      <aside
        className="w-[34%] shrink-0 px-5 py-6 text-white"
        style={{ backgroundColor: 'var(--accent)' }}
      >
        {preset.photoAllowed && info.photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={info.photoUrl}
            alt=""
            className="w-24 h-24 rounded-full object-cover border-2 border-white/40 mb-4 mx-auto"
          />
        )}

        <h1 className="text-[1.4em] font-bold leading-tight mb-0.5">
          {info.fullName || 'Your Name'}
        </h1>

        {info.professionalTitle && (
          <p className="text-[0.95em] text-white/85 mb-4">
            {info.professionalTitle}
          </p>
        )}

        <ContactBlock data={data} />

        <div className="flex flex-col gap-5">
          {sidebar.map((section) => (
            <div key={section.id}>
              <h2 className="uppercase text-[0.85em] font-semibold tracking-wider mb-2 text-white/95">
                {SECTION_TITLES[section.id]}
              </h2>

              <div className="text-white/90 [&_span]:text-white/90 [&_a]:text-white/90">
                {renderSectionBody(section.id, data, true)}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <main
        className="flex-1 px-6 py-6 flex flex-col"
        style={{ gap: 'var(--section-gap)' }}
      >
        {main.map((section) => (
          <div
            key={section.id}
            className="break-inside-avoid-page"
          >
            <SectionHeading preset={preset}>
              {SECTION_TITLES[section.id]}
            </SectionHeading>

            {renderSectionBody(section.id, data)}
          </div>
        ))}
      </main>
    </div>
  );
}
