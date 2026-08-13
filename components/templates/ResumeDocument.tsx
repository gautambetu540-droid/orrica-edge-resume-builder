import React from 'react';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';
import { TEMPLATE_PRESETS, FONT_STACKS } from '@/lib/templates/presets';
import { SingleColumnLayout } from './layouts/SingleColumn';
import { TwoColumnLayout } from './layouts/TwoColumn';
import { BrandFooter } from './BrandFooter';

export interface ResumeDocumentProps {
  data: ResumeData;
  settings: ResumeSettings;
  forPrint?: boolean;
}

export function ResumeDocument({ data, settings, forPrint = false }: ResumeDocumentProps) {
  const preset = TEMPLATE_PRESETS[settings.template];
  const pageMargin = Math.max(10, Math.min(25, settings.margin));
  const pagePadding = preset.layout === 'two-column'
    ? 0
    : preset.headerVariant === 'banner'
      ? `0 ${pageMargin}mm ${pageMargin}mm`
      : `${pageMargin}mm`;

  const style: React.CSSProperties & { '--accent'?: string; '--section-gap'?: string; '--entry-gap'?: string; '--heading-scale'?: string; '--resume-text'?: string; '--resume-muted'?: string; '--resume-margin'?: string } = {
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
    <div className={`resume-page bg-white ${forPrint ? '' : 'shadow-lg border border-neutral-200'}`} style={style} id="resume-document-root" data-resume-font={settings.font}>
      {preset.layout === 'two-column' ? (
        <TwoColumnLayout data={data} settings={settings} preset={preset} />
      ) : (
        <SingleColumnLayout data={data} settings={settings} preset={preset} />
      )}
      <BrandFooter />
    </div>
  );
}
