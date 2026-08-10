import React from 'react';
import { ResumeData, ResumeSettings } from '@/lib/types/resume';
import { TEMPLATE_PRESETS, FONT_STACKS } from '@/lib/templates/presets';
import { SingleColumnLayout } from './layouts/SingleColumn';
import { TwoColumnLayout } from './layouts/TwoColumn';
import { BrandFooter } from './BrandFooter';

export interface ResumeDocumentProps {
  data: ResumeData;
  settings: ResumeSettings;

  /**
   * Set true only for the dedicated print/PDF route —
   * disables shadow/border chrome.
   */
  forPrint?: boolean;
}

export function ResumeDocument({
  data,
  settings,
  forPrint = false,
}: ResumeDocumentProps) {
  const preset = TEMPLATE_PRESETS[settings.template];

  const style: React.CSSProperties & {
    '--accent'?: string;
    '--section-gap'?: string;
    '--entry-gap'?: string;
  } = {
    '--accent':
      settings.accentColor || preset.defaultAccentColor,

    '--section-gap': `${settings.sectionSpacing}px`,

    '--entry-gap': `${Math.max(
      8,
      settings.sectionSpacing * 0.6
    )}px`,

    fontFamily: FONT_STACKS[settings.font],

    fontSize: `${settings.fontSize}pt`,

    lineHeight: settings.lineSpacing,

    // Two-column templates handle their own inset per-column.
    // Single-column templates use a uniform margin.
    padding:
      preset.layout === 'two-column'
        ? 0
        : `${settings.margin}mm`,

    color: '#1f2933',
  };

  return (
    <div
      className={`resume-page bg-white ${
        forPrint
          ? ''
          : 'shadow-lg border border-neutral-200'
      }`}
      style={style}
      id="resume-document-root"
    >
      {preset.layout === 'two-column' ? (
        <TwoColumnLayout
          data={data}
          settings={settings}
          preset={preset}
        />
      ) : (
        <SingleColumnLayout
          data={data}
          settings={settings}
          preset={preset}
        />
      )}

      <BrandFooter />
    </div>
  );
}
