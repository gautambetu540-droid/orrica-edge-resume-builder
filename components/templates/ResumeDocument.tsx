'use client';

import React, { useEffect, useState } from 'react';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';
import { TEMPLATE_PRESETS, FONT_STACKS } from '@/lib/templates/presets';
import { TEMPLATE_PREVIEW_RESUME } from '@/lib/data/template-preview-resume';
import { SingleColumnLayout } from './layouts/SingleColumn';
import { TwoColumnLayout } from './layouts/TwoColumn';
import { BrandFooter } from './BrandFooter';

export interface ResumeDocumentProps {
  data: ResumeData;
  settings: ResumeSettings;
  forPrint?: boolean;
  activeSection?: string;
}

function isEmptyResume(data: ResumeData) {
  return !data.personalInfo.fullName?.trim() && !data.personalInfo.professionalTitle?.trim() && !data.personalInfo.email?.trim() && !data.personalInfo.phone?.trim() && !data.summary?.trim() && data.experience.length === 0 && data.education.length === 0 && data.projects.length === 0 && data.certifications.length === 0 && data.languages.length === 0 && data.achievements.length === 0 && data.skills.every((category) => category.items.length === 0);
}

export function ResumeDocument({ data, settings, forPrint = false, activeSection }: ResumeDocumentProps) {
  const [previewData, setPreviewData] = useState<ResumeData | null>(null);

  useEffect(() => {
    if (forPrint || !isEmptyResume(data)) {
      setPreviewData(null);
      return;
    }
    const inTemplateLibrary = Boolean(document.querySelector('.oe-template'));
    if (inTemplateLibrary) setPreviewData(TEMPLATE_PREVIEW_RESUME);
  }, [data, forPrint]);

  const renderData = previewData ?? data;
  const preset = TEMPLATE_PRESETS[settings.template];
  const pageMargin = Math.max(10, Math.min(25, settings.margin));
  const pagePadding = preset.layout === 'two-column' ? 0 : preset.headerVariant === 'banner' ? `0 ${pageMargin}mm ${pageMargin}mm` : `${pageMargin}mm`;
  const style: React.CSSProperties & Record<string, string | number> = {
    '--accent': settings.accentColor || preset.defaultAccentColor,
    '--section-gap': `${Math.max(10, Math.min(28, settings.sectionSpacing))}px`,
    '--entry-gap': `${Math.max(8, settings.sectionSpacing * 0.55)}px`,
    '--heading-scale': String(Math.max(1, Math.min(1.35, settings.headingScale || 1.15))),
    '--resume-text': '#20242a',
    '--resume-muted': '#5f6873',
    '--resume-margin': `${pageMargin}mm`,
    fontFamily: FONT_STACKS[settings.font],
    fontSize: `${Math.max(9, Math.min(12, settings.fontSize))}pt`,
    lineHeight: Math.max(1.15, Math.min(1.55, settings.lineSpacing)),
    padding: pagePadding,
    color: '#20242a',
    letterSpacing: '-0.005em',
    WebkitFontSmoothing: 'antialiased',
    textRendering: 'optimizeLegibility',
  };

  return (
    <div className="resume-page bg-white" style={style} id="resume-document-root" data-resume-font={settings.font} data-active-section={activeSection || ''}>
      {preset.layout === 'two-column' ? <TwoColumnLayout data={renderData} settings={settings} preset={preset} activeSection={activeSection} /> : <SingleColumnLayout data={renderData} settings={settings} preset={preset} activeSection={activeSection} />}
      <BrandFooter />
      {!forPrint && activeSection && (
        <style jsx global>{`
          /* Editor-only active-section treatment: soft glass highlight, never black. */
          #resume-document-root[data-active-section="personal"] [data-resume-section="personal"],
          #resume-document-root[data-active-section="experience"] [data-resume-section="experience"],
          #resume-document-root[data-active-section="education"] [data-resume-section="education"],
          #resume-document-root[data-active-section="skills"] [data-resume-section="skills"],
          #resume-document-root[data-active-section="projects"] [data-resume-section="projects"],
          #resume-document-root[data-active-section="more"] [data-resume-section="more"],
          #resume-document-root[data-active-section="summary"] [data-resume-section="summary"] {
            background: rgba(241, 245, 249, 0.72) !important;
            color: #111827 !important;
            border: 1px solid rgba(14, 165, 233, 0.22) !important;
            border-radius: 8px;
            padding: 8px 10px;
            margin-left: -10px;
            margin-right: -10px;
            box-shadow:
              0 8px 24px rgba(15, 23, 42, 0.06),
              0 0 0 3px rgba(14, 165, 233, 0.055),
              inset 0 1px 0 rgba(255, 255, 255, 0.72);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            transition: background-color 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
          }
          #resume-document-root[data-active-section="personal"] [data-resume-section="personal"] *,
          #resume-document-root[data-active-section="experience"] [data-resume-section="experience"] *,
          #resume-document-root[data-active-section="education"] [data-resume-section="education"] *,
          #resume-document-root[data-active-section="skills"] [data-resume-section="skills"] *,
          #resume-document-root[data-active-section="projects"] [data-resume-section="projects"] *,
          #resume-document-root[data-active-section="more"] [data-resume-section="more"] *,
          #resume-document-root[data-active-section="summary"] [data-resume-section="summary"] * {
            color: #111827 !important;
          }
          #resume-document-root[data-active-section="personal"] [data-resume-section="personal"] a,
          #resume-document-root[data-active-section="experience"] [data-resume-section="experience"] a,
          #resume-document-root[data-active-section="education"] [data-resume-section="education"] a,
          #resume-document-root[data-active-section="skills"] [data-resume-section="skills"] a,
          #resume-document-root[data-active-section="projects"] [data-resume-section="projects"] a,
          #resume-document-root[data-active-section="more"] [data-resume-section="more"] a,
          #resume-document-root[data-active-section="summary"] [data-resume-section="summary"] a {
            color: #0369A1 !important;
          }
        `}</style>
      )}
    </div>
  );
}
