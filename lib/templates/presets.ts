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
  category?: string;
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

const preset = (
  id: TemplateId,
  name: string,
  options: Omit<TemplatePreset, 'id' | 'name' | 'description'> & { description: string },
): TemplatePreset => presetWithCategory(id, name, options);

const presetWithCategory = (
  id: TemplateId,
  name: string,
  options: Omit<TemplatePreset, 'id' | 'name' | 'description'> & { description: string },
): TemplatePreset => ({ id, name, category: '', ...options });

export const TEMPLATE_PRESETS: Record<TemplateId, TemplatePreset> = {
  'modern-ats': preset('modern-ats', 'Modern ATS', { layout: 'single-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-accent', dividers: true, photoAllowed: false, defaultAccentColor: '#F97316', recommendedFont: 'arial', defaultFontSize: 10.2, defaultHeadingScale: 1.08, defaultLineSpacing: 1.28, defaultSectionSpacing: 13, defaultMargin: 15, description: 'Clean, recruiter-friendly single-column layout with strong ATS readability.' }),
  'classic-professional': preset('classic-professional', 'Classic Professional', { layout: 'single-column', headerAlign: 'left', headerVariant: 'compact', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-underline', dividers: true, photoAllowed: false, defaultAccentColor: '#C2410C', recommendedFont: 'times-new-roman', defaultFontSize: 10.1, defaultHeadingScale: 1.08, defaultLineSpacing: 1.24, defaultSectionSpacing: 12, defaultMargin: 15, description: 'Traditional corporate hierarchy with restrained warm accents.' }),
  minimal: preset('minimal', 'Minimal', { layout: 'single-column', headerAlign: 'center', headerVariant: 'centered', sidebarVariant: 'plain', sectionHeadingStyle: 'small-caps-line', dividers: false, photoAllowed: false, defaultAccentColor: '#F97316', recommendedFont: 'proxima-nova', defaultFontSize: 10.4, defaultHeadingScale: 1.05, defaultLineSpacing: 1.3, defaultSectionSpacing: 14, defaultMargin: 16, description: 'Minimal one-page layout with generous breathing room.' }),
  executive: preset('executive', 'Executive', { layout: 'single-column', headerAlign: 'center', headerVariant: 'banner', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', dividers: false, photoAllowed: false, defaultAccentColor: '#1F2937', recommendedFont: 'merriweather', defaultFontSize: 10.4, defaultHeadingScale: 1.08, defaultLineSpacing: 1.3, defaultSectionSpacing: 15, defaultMargin: 0, description: 'Editorial executive layout for senior and leadership roles.' }),
  'modern-two-column': preset('modern-two-column', 'Modern Two Column', { layout: 'two-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'solid', sectionHeadingStyle: 'uppercase-accent', dividers: false, photoAllowed: false, defaultAccentColor: '#F97316', recommendedFont: 'arial', defaultFontSize: 10.2, defaultHeadingScale: 1.08, defaultLineSpacing: 1.28, defaultSectionSpacing: 15, defaultMargin: 0, description: 'High-impact two-column layout with a confident sidebar.' }),
  'fresh-graduate': preset('fresh-graduate', 'Fresh Graduate', { layout: 'single-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-accent', dividers: true, photoAllowed: false, defaultAccentColor: '#EA580C', recommendedFont: 'proxima-nova', defaultFontSize: 10.3, defaultHeadingScale: 1.1, defaultLineSpacing: 1.28, defaultSectionSpacing: 14, defaultMargin: 15, description: 'Education-forward structure for students and early-career candidates.' }),
  'bold-header': preset('bold-header', 'Bold Header', { layout: 'single-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', dividers: true, photoAllowed: false, defaultAccentColor: '#111827', recommendedFont: 'proxima-nova', defaultFontSize: 10.4, defaultHeadingScale: 1.14, defaultLineSpacing: 1.3, defaultSectionSpacing: 15, defaultMargin: 16, description: 'Modern executive hierarchy with a strong visual nameplate.' }),
  'elegant-serif': preset('elegant-serif', 'Elegant Serif', { layout: 'single-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'plain', sectionHeadingStyle: 'small-caps-line', dividers: true, photoAllowed: false, defaultAccentColor: '#374151', recommendedFont: 'times-new-roman', defaultFontSize: 10.3, defaultHeadingScale: 1.08, defaultLineSpacing: 1.3, defaultSectionSpacing: 14, defaultMargin: 16, description: 'Refined editorial serif design with balanced page rhythm.' }),
  'compact-ats': preset('compact-ats', 'Compact ATS', { layout: 'single-column', headerAlign: 'left', headerVariant: 'compact', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', dividers: true, photoAllowed: false, defaultAccentColor: '#1F2937', recommendedFont: 'ibm-plex-sans', defaultFontSize: 9.6, defaultHeadingScale: 1.02, defaultLineSpacing: 1.2, defaultSectionSpacing: 9, defaultMargin: 13, description: 'Dense but readable one-page format for detailed experience.' }),
  'creative-sidebar': preset('creative-sidebar', 'Creative Sidebar', { layout: 'two-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'soft', sectionHeadingStyle: 'uppercase-underline', dividers: true, photoAllowed: true, defaultAccentColor: '#111827', recommendedFont: 'arial', defaultFontSize: 10.1, defaultHeadingScale: 1.06, defaultLineSpacing: 1.24, defaultSectionSpacing: 13, defaultMargin: 0, description: 'Distinctive two-column profile with a light creative sidebar.' }),
  'clean-corporate': preset('clean-corporate', 'Clean Corporate', { layout: 'single-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', dividers: true, photoAllowed: false, defaultAccentColor: '#F97316', recommendedFont: 'inter', defaultFontSize: 10.2, defaultHeadingScale: 1.08, defaultLineSpacing: 1.27, defaultSectionSpacing: 13, defaultMargin: 15, description: 'Straightforward corporate resume with crisp modern spacing.' }),
  'tech-modern': preset('tech-modern', 'Tech Modern', { layout: 'two-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'solid', sectionHeadingStyle: 'uppercase-accent', dividers: false, photoAllowed: false, defaultAccentColor: '#EA580C', recommendedFont: 'ibm-plex-sans', defaultFontSize: 10, defaultHeadingScale: 1.07, defaultLineSpacing: 1.25, defaultSectionSpacing: 13, defaultMargin: 0, description: 'Technical two-column layout designed for product and engineering roles.' }),
  'simple-chronological': preset('simple-chronological', 'Simple Chronological', { layout: 'single-column', headerAlign: 'left', headerVariant: 'compact', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-underline', dividers: true, photoAllowed: false, defaultAccentColor: '#9A3412', recommendedFont: 'arial', defaultFontSize: 10.1, defaultHeadingScale: 1.05, defaultLineSpacing: 1.25, defaultSectionSpacing: 12, defaultMargin: 15, description: 'Classic reverse-chronological structure with clear section rules.' }),
  'classic-two-column': preset('classic-two-column', 'Classic Two Column', { layout: 'two-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'soft', sectionHeadingStyle: 'uppercase-underline', dividers: true, photoAllowed: false, defaultAccentColor: '#C2410C', recommendedFont: 'times-new-roman', defaultFontSize: 10, defaultHeadingScale: 1.06, defaultLineSpacing: 1.24, defaultSectionSpacing: 12, defaultMargin: 0, description: 'Traditional two-column format for established professionals.' }),
  'creative-modern': preset('creative-modern', 'Creative Modern', { layout: 'two-column', headerAlign: 'center', headerVariant: 'centered', sidebarVariant: 'soft', sectionHeadingStyle: 'uppercase-accent', dividers: false, photoAllowed: true, defaultAccentColor: '#F97316', recommendedFont: 'proxima-nova', defaultFontSize: 10.2, defaultHeadingScale: 1.1, defaultLineSpacing: 1.28, defaultSectionSpacing: 14, defaultMargin: 0, description: 'Contemporary visual hierarchy for creative and marketing profiles.' }),
  'dark-executive': preset('dark-executive', 'Dark Executive', { layout: 'two-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'solid', sectionHeadingStyle: 'bold-plain', dividers: false, photoAllowed: false, defaultAccentColor: '#111827', recommendedFont: 'inter', defaultFontSize: 10.1, defaultHeadingScale: 1.1, defaultLineSpacing: 1.26, defaultSectionSpacing: 14, defaultMargin: 0, description: 'High-contrast executive layout with a strong dark sidebar.' }),
  'blue-accent': preset('blue-accent', 'Blue Accent', { layout: 'single-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-accent', dividers: true, photoAllowed: false, defaultAccentColor: '#2563EB', recommendedFont: 'source-sans-3', defaultFontSize: 10.2, defaultHeadingScale: 1.07, defaultLineSpacing: 1.28, defaultSectionSpacing: 13, defaultMargin: 15, description: 'Clean professional format with a cool accent system.' }),
  'orange-accent': preset('orange-accent', 'Orange Accent', { layout: 'single-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-accent', dividers: true, photoAllowed: false, defaultAccentColor: '#F97316', recommendedFont: 'proxima-nova', defaultFontSize: 10.3, defaultHeadingScale: 1.09, defaultLineSpacing: 1.28, defaultSectionSpacing: 14, defaultMargin: 15, description: 'Orrica Edge signature orange with a polished modern hierarchy.' }),
  'editorial-clean': preset('editorial-clean', 'Editorial Clean', { layout: 'single-column', headerAlign: 'center', headerVariant: 'centered', sidebarVariant: 'plain', sectionHeadingStyle: 'small-caps-line', dividers: true, photoAllowed: false, defaultAccentColor: '#7C2D12', recommendedFont: 'georgia', defaultFontSize: 10.2, defaultHeadingScale: 1.08, defaultLineSpacing: 1.3, defaultSectionSpacing: 14, defaultMargin: 16, description: 'Magazine-inspired typography without sacrificing ATS clarity.' }),
  'timeline-pro': preset('timeline-pro', 'Timeline Pro', { layout: 'two-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', dividers: true, photoAllowed: false, defaultAccentColor: '#F97316', recommendedFont: 'source-sans-3', defaultFontSize: 10.1, defaultHeadingScale: 1.07, defaultLineSpacing: 1.26, defaultSectionSpacing: 13, defaultMargin: 0, description: 'Structured two-column presentation with a strong career progression feel.' }),
};

export const TEMPLATE_LIST = Object.values(TEMPLATE_PRESETS);
