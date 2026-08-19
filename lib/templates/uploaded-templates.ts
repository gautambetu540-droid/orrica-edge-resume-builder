import { TemplatePreset } from './presets';

/**
 * Uploaded SVG designs are used as visual references. These presets map the
 * designs into the editable React resume renderer instead of flattening the SVG.
 */
export const UPLOADED_TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'uploaded-blue-professional', name: 'Blue Professional', category: 'Professional', style: 'Professional', format: 'Single Column', layout: 'single-column',
    headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-accent', dividers: true, photoAllowed: false,
    defaultAccentColor: '#3F63AD', recommendedFont: 'times-new-roman', defaultFontSize: 10.2, defaultHeadingScale: 1.1, defaultLineSpacing: 1.28, defaultSectionSpacing: 13, defaultMargin: 15,
    description: 'Blue-and-white professional resume rebuilt as an editable single-column template.',
  },
  {
    id: 'uploaded-navy-modern', name: 'Navy Modern', category: 'Professional', style: 'Modern', format: 'Two Column', layout: 'two-column',
    headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'solid', sectionHeadingStyle: 'uppercase-accent', dividers: false, photoAllowed: false,
    defaultAccentColor: '#274364', recommendedFont: 'manrope', defaultFontSize: 10.2, defaultHeadingScale: 1.08, defaultLineSpacing: 1.28, defaultSectionSpacing: 13, defaultMargin: 0,
    description: 'Navy-and-white modern professional resume rebuilt as an editable two-column template.',
  },
  {
    id: 'uploaded-blue-minimal-ats', name: 'Blue Minimal ATS', category: 'ATS', style: 'ATS', format: 'Single Column', layout: 'single-column',
    headerAlign: 'left', headerVariant: 'compact', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-underline', dividers: true, photoAllowed: false,
    defaultAccentColor: '#1C4DA8', recommendedFont: 'arial', defaultFontSize: 10, defaultHeadingScale: 1.05, defaultLineSpacing: 1.24, defaultSectionSpacing: 11, defaultMargin: 14,
    description: 'Clean blue minimalist ATS resume rebuilt around editable text sections.',
  },
  {
    id: 'uploaded-accountant-minimal', name: 'Accountant Minimal', category: 'Finance / Accounting', style: 'Professional', format: 'Single Column', layout: 'single-column',
    headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', dividers: true, photoAllowed: false,
    defaultAccentColor: '#2E2C2C', recommendedFont: 'times-new-roman', defaultFontSize: 10.2, defaultHeadingScale: 1.06, defaultLineSpacing: 1.25, defaultSectionSpacing: 12, defaultMargin: 15,
    description: 'Black-and-white accountant resume rebuilt for editable financial and accounting profiles.',
  },
];
