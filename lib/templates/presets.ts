import { ResumeFont, TemplateId } from '@/lib/types/resume';

export const FONT_STACKS: Record<ResumeFont, string> = {
  'proxima-nova': '"Proxima Nova", Arial, sans-serif',
  arial: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  'times-new-roman': '"Times New Roman", Times, serif',
  inter: 'var(--font-inter), Arial, sans-serif',
  'source-sans-3': 'var(--font-source-sans-3), Arial, sans-serif',
  'ibm-plex-sans': 'var(--font-ibm-plex-sans), Arial, sans-serif',
  merriweather: 'var(--font-merriweather), Georgia, "Times New Roman", serif',
  georgia: 'Georgia, "Times New Roman", serif',
};

export type TemplateLayout = 'single-column' | 'two-column';
export type HeaderVariant = 'clean' | 'centered' | 'banner' | 'editorial' | 'compact';
export type SidebarVariant = 'solid' | 'soft' | 'plain';

export interface TemplatePreset {
  id: TemplateId;
  name: string;
  layout: TemplateLayout;
  headerAlign: 'left' | 'center';
  headerVariant: HeaderVariant;
  sidebarVariant: SidebarVariant;
  sectionHeadingStyle: 'uppercase-underline' | 'uppercase-accent' | 'small-caps-line' | 'bold-plain';
  dividers: boolean;
  photoAllowed: boolean;
  defaultAccentColor: string;
  recommendedFont: ResumeFont;
  defaultFontSize: number;
  defaultHeadingScale: number;
  defaultLineSpacing: number;
  defaultSectionSpacing: number;
  defaultMargin: number;
  description: string;
}

export const TEMPLATE_PRESETS: Record<TemplateId, TemplatePreset> = {
  'modern-ats': {
    id: 'modern-ats', name: 'ATS Clean', layout: 'single-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'plain',
    sectionHeadingStyle: 'uppercase-accent', dividers: true, photoAllowed: false, defaultAccentColor: '#6E46AE', recommendedFont: 'arial',
    defaultFontSize: 10.2, defaultHeadingScale: 1.08, defaultLineSpacing: 1.28, defaultSectionSpacing: 13, defaultMargin: 15,
    description: 'Clean, recruiter-friendly single column with highly readable Arial typography.',
  },
  'classic-professional': {
    id: 'classic-professional', name: 'Classic Orange', layout: 'single-column', headerAlign: 'left', headerVariant: 'compact', sidebarVariant: 'plain',
    sectionHeadingStyle: 'uppercase-underline', dividers: true, photoAllowed: false, defaultAccentColor: '#c2410c', recommendedFont: 'times-new-roman',
    defaultFontSize: 10.1, defaultHeadingScale: 1.08, defaultLineSpacing: 1.24, defaultSectionSpacing: 12, defaultMargin: 15,
    description: 'Traditional professional layout with Times New Roman typography and restrained orange accents.',
  },
  minimal: {
    id: 'minimal', name: 'Minimal Mono', layout: 'single-column', headerAlign: 'center', headerVariant: 'centered', sidebarVariant: 'plain',
    sectionHeadingStyle: 'small-caps-line', dividers: false, photoAllowed: false, defaultAccentColor: '#6E46AE', recommendedFont: 'proxima-nova',
    defaultFontSize: 10.4, defaultHeadingScale: 1.05, defaultLineSpacing: 1.3, defaultSectionSpacing: 14, defaultMargin: 16,
    description: 'Minimal one-page layout with clean Proxima Nova typography and generous breathing room.',
  },
  executive: {
    id: 'executive', name: 'Editorial Teal', layout: 'single-column', headerAlign: 'center', headerVariant: 'banner', sidebarVariant: 'plain',
    sectionHeadingStyle: 'bold-plain', dividers: false, photoAllowed: false, defaultAccentColor: '#2f7f78', recommendedFont: 'merriweather',
    defaultFontSize: 10.4, defaultHeadingScale: 1.08, defaultLineSpacing: 1.3, defaultSectionSpacing: 15, defaultMargin: 0,
    description: 'Editorial serif resume with a strong teal masthead.',
  },
  'modern-two-column': {
    id: 'modern-two-column', name: 'Teal Sidebar', layout: 'two-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'solid',
    sectionHeadingStyle: 'uppercase-accent', dividers: false, photoAllowed: false, defaultAccentColor: '#08736f', recommendedFont: 'arial',
    defaultFontSize: 10.2, defaultHeadingScale: 1.08, defaultLineSpacing: 1.28, defaultSectionSpacing: 15, defaultMargin: 0,
    description: 'High-impact two-column layout with clear Arial typography and a deep teal sidebar.',
  },
  'fresh-graduate': {
    id: 'fresh-graduate', name: 'Academic Purple', layout: 'single-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'plain',
    sectionHeadingStyle: 'uppercase-accent', dividers: true, photoAllowed: false, defaultAccentColor: '#4527a0', recommendedFont: 'proxima-nova',
    defaultFontSize: 10.3, defaultHeadingScale: 1.1, defaultLineSpacing: 1.28, defaultSectionSpacing: 14, defaultMargin: 15,
    description: 'Academic-inspired layout with strong purple labels, rules and Proxima Nova typography.',
  },
  'bold-header': {
    id: 'bold-header', name: 'Bold Executive', layout: 'single-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'plain',
    sectionHeadingStyle: 'bold-plain', dividers: true, photoAllowed: false, defaultAccentColor: '#0f172a', recommendedFont: 'proxima-nova',
    defaultFontSize: 10.4, defaultHeadingScale: 1.14, defaultLineSpacing: 1.3, defaultSectionSpacing: 15, defaultMargin: 16,
    description: 'Modern executive hierarchy with bold Proxima Nova headings and generous whitespace.',
  },
  'elegant-serif': {
    id: 'elegant-serif', name: 'Editorial Serif', layout: 'single-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'plain',
    sectionHeadingStyle: 'small-caps-line', dividers: true, photoAllowed: false, defaultAccentColor: '#374151', recommendedFont: 'times-new-roman',
    defaultFontSize: 10.3, defaultHeadingScale: 1.08, defaultLineSpacing: 1.3, defaultSectionSpacing: 14, defaultMargin: 16,
    description: 'Refined serif typography using Times New Roman with editorial rules and balanced page rhythm.',
  },
  'compact-ats': {
    id: 'compact-ats', name: 'Compact One Page', layout: 'single-column', headerAlign: 'left', headerVariant: 'compact', sidebarVariant: 'plain',
    sectionHeadingStyle: 'bold-plain', dividers: true, photoAllowed: false, defaultAccentColor: '#1f2937', recommendedFont: 'ibm-plex-sans',
    defaultFontSize: 9.6, defaultHeadingScale: 1.02, defaultLineSpacing: 1.2, defaultSectionSpacing: 9, defaultMargin: 13,
    description: 'Dense but readable one-page format for detailed experience.',
  },
  'creative-sidebar': {
    id: 'creative-sidebar', name: 'Classic Sidebar', layout: 'two-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'soft',
    sectionHeadingStyle: 'uppercase-underline', dividers: true, photoAllowed: true, defaultAccentColor: '#111827', recommendedFont: 'arial',
    defaultFontSize: 10.1, defaultHeadingScale: 1.06, defaultLineSpacing: 1.24, defaultSectionSpacing: 13, defaultMargin: 0,
    description: 'Clean two-column profile with readable Arial typography and a light sidebar.',
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATE_PRESETS);
