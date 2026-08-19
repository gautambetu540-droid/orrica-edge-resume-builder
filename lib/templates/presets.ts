import { ResumeFont, TemplateId } from '@/lib/types/resume';

export const FONT_STACKS: Record<ResumeFont, string> = {
  inter: 'var(--font-inter), Arial, sans-serif',
  aptos: 'Aptos, Arial, sans-serif',
  arial: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  calibri: 'Calibri, Arial, sans-serif',
  helvetica: 'Helvetica, Arial, sans-serif',
  roboto: 'Roboto, Arial, sans-serif',
  'ibm-plex-sans': 'var(--font-ibm-plex-sans), Arial, sans-serif',
  'source-sans-3': 'var(--font-source-sans-3), Arial, sans-serif',
  'noto-sans': '"Noto Sans", Arial, sans-serif',
  'open-sans': '"Open Sans", Arial, sans-serif',
  lato: 'Lato, Arial, sans-serif',
  montserrat: 'Montserrat, Arial, sans-serif',
  poppins: 'Poppins, Arial, sans-serif',
  'nunito-sans': '"Nunito Sans", Arial, sans-serif',
  'work-sans': '"Work Sans", Arial, sans-serif',
  manrope: 'Manrope, Arial, sans-serif',
  'dm-sans': '"DM Sans", Arial, sans-serif',
  merriweather: 'var(--font-merriweather), Georgia, "Times New Roman", serif',
  georgia: 'Georgia, "Times New Roman", serif',
  'times-new-roman': '"Times New Roman", Times, serif',
  'proxima-nova': '"Proxima Nova", Arial, sans-serif',
};

export type TemplateLayout = 'single-column' | 'two-column';
export type HeaderVariant = 'clean' | 'centered' | 'banner' | 'editorial' | 'compact';
export type SidebarVariant = 'solid' | 'soft' | 'plain';

export interface TemplatePreset {
  id: TemplateId;
  name: string;
  category: string;
  style: 'ATS' | 'Modern' | 'Minimal' | 'Professional' | 'Executive' | 'Creative' | 'Two Column';
  format: 'Single Column' | 'Two Column' | 'Photo';
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

const base = (id: TemplateId, name: string, options: Partial<Omit<TemplatePreset, 'id' | 'name'>>): TemplatePreset => ({
  id,
  name,
  category: 'Professional',
  style: 'Professional',
  format: options.layout === 'two-column' ? 'Two Column' : 'Single Column',
  layout: 'single-column',
  headerAlign: 'left',
  headerVariant: 'clean',
  sidebarVariant: 'plain',
  sectionHeadingStyle: 'uppercase-accent',
  dividers: true,
  photoAllowed: false,
  defaultAccentColor: '#2563EB',
  recommendedFont: 'inter',
  defaultFontSize: 10.2,
  defaultHeadingScale: 1.08,
  defaultLineSpacing: 1.28,
  defaultSectionSpacing: 13,
  defaultMargin: 15,
  description: 'Clean recruiter-ready resume with balanced hierarchy and professional spacing.',
  ...options,
});

/*
 * Curated catalog: repeated numbered variants are intentionally removed from the
 * public template list. Keep the underlying renderer flexible, but expose a
 * smaller set of genuinely different visual systems instead of many near-duplicates.
 */
const CURATED_TEMPLATE_PRESETS: TemplatePreset[] = [
  base('modern-ats', 'Modern ATS', { category: 'BPO / Customer Support', style: 'ATS', description: 'Text-first ATS structure with crisp hierarchy for customer-facing roles.' }),
  base('classic-professional', 'Classic Professional', { category: 'Finance / Accounting', style: 'Professional', recommendedFont: 'times-new-roman', defaultAccentColor: '#0F766E', headerVariant: 'clean', sectionHeadingStyle: 'uppercase-underline', description: 'Traditional corporate styling with refined Times New Roman typography.' }),
  base('minimal', 'Minimal', { category: 'HR / Recruitment', style: 'Minimal', headerAlign: 'center', headerVariant: 'centered', sectionHeadingStyle: 'small-caps-line', dividers: false, defaultAccentColor: '#475569', recommendedFont: 'proxima-nova', defaultMargin: 16, description: 'Quiet, spacious design for highly scannable professional profiles.' }),
  base('executive', 'Executive', { category: 'Executive / Management', style: 'Executive', headerAlign: 'center', headerVariant: 'banner', dividers: false, defaultAccentColor: '#1F2937', recommendedFont: 'merriweather', defaultMargin: 0, description: 'Premium leadership layout with strong editorial typography and a banner header.' }),
  base('modern-two-column', 'Modern Two Column', { category: 'Photo / Professional', style: 'Two Column', format: 'Photo', layout: 'two-column', sidebarVariant: 'solid', dividers: false, photoAllowed: true, defaultAccentColor: '#0891B2', defaultMargin: 0, recommendedFont: 'manrope', description: 'Balanced two-column profile with a confident sidebar and optional photo.' }),
  base('fresh-graduate', 'Fresh Graduate', { category: 'Fresher / Graduate', style: 'ATS', headerVariant: 'editorial', defaultAccentColor: '#16A34A', recommendedFont: 'source-sans-3', description: 'Education-forward structure for students, graduates and entry-level candidates.' }),
  base('bold-header', 'Bold Header', { category: 'Executive / Management', style: 'Executive', headerVariant: 'editorial', sectionHeadingStyle: 'bold-plain', defaultAccentColor: '#111827', recommendedFont: 'montserrat', defaultHeadingScale: 1.14, defaultMargin: 16, description: 'Strong nameplate and modern sans-serif hierarchy for leadership profiles.' }),
  base('elegant-serif', 'Elegant Serif', { category: 'HR / Recruitment', style: 'Minimal', headerVariant: 'editorial', sectionHeadingStyle: 'small-caps-line', defaultAccentColor: '#7C3AED', recommendedFont: 'times-new-roman', defaultMargin: 16, description: 'Refined serif treatment for polished people and talent profiles.' }),
  base('compact-ats', 'Compact ATS', { category: 'Operations / Administration', style: 'ATS', headerVariant: 'compact', sectionHeadingStyle: 'bold-plain', defaultAccentColor: '#334155', recommendedFont: 'ibm-plex-sans', defaultFontSize: 9.6, defaultHeadingScale: 1.02, defaultLineSpacing: 1.2, defaultSectionSpacing: 9, defaultMargin: 13, description: 'Space-efficient ATS format for detailed work histories.' }),
  base('creative-sidebar', 'Creative Sidebar', { category: 'Photo / Professional', style: 'Creative', format: 'Photo', layout: 'two-column', sidebarVariant: 'soft', sectionHeadingStyle: 'uppercase-underline', photoAllowed: true, defaultAccentColor: '#DB2777', recommendedFont: 'poppins', defaultMargin: 0, description: 'Distinctive photo-enabled sidebar layout for client-facing professionals.' }),
  base('clean-corporate', 'Clean Corporate', { category: 'Sales / Business Development', style: 'Professional', defaultAccentColor: '#2563EB', recommendedFont: 'inter', description: 'Crisp corporate format for sales, account management and growth roles.' }),
  base('tech-modern', 'Tech Modern', { category: 'IT / Software / Technology', style: 'Modern', format: 'Two Column', layout: 'two-column', sidebarVariant: 'solid', sectionHeadingStyle: 'uppercase-accent', dividers: false, defaultAccentColor: '#06B6D4', recommendedFont: 'ibm-plex-sans', defaultMargin: 0, description: 'Technical two-column layout for engineering, cloud and product roles.' }),
  base('classic-two-column', 'Classic Two Column', { category: 'Finance / Accounting', style: 'Professional', format: 'Two Column', layout: 'two-column', sidebarVariant: 'soft', sectionHeadingStyle: 'uppercase-underline', defaultAccentColor: '#0F766E', recommendedFont: 'times-new-roman', defaultMargin: 0, description: 'Traditional two-column finance format with restrained editorial styling.' }),
  base('creative-modern', 'Creative Modern', { category: 'Marketing / Digital Marketing', style: 'Creative', format: 'Two Column', layout: 'two-column', headerAlign: 'center', headerVariant: 'centered', sidebarVariant: 'soft', dividers: false, photoAllowed: true, defaultAccentColor: '#8B5CF6', recommendedFont: 'poppins', defaultMargin: 0, description: 'Contemporary visual hierarchy for digital marketing and brand professionals.' }),
  base('dark-executive', 'Dark Executive', { category: 'Executive / Management', style: 'Executive', format: 'Two Column', layout: 'two-column', headerVariant: 'editorial', sidebarVariant: 'solid', sectionHeadingStyle: 'bold-plain', dividers: false, defaultAccentColor: '#111827', recommendedFont: 'merriweather', defaultMargin: 0, description: 'High-contrast leadership format with a strong dark sidebar.' }),
  base('blue-accent', 'Blue Accent', { category: 'Healthcare / Medical', style: 'Professional', defaultAccentColor: '#2563EB', recommendedFont: 'source-sans-3', description: 'Calm, trustworthy structure for healthcare applications.' }),
  base('orange-accent', 'Orrica Signature', { category: 'Creative / Design', style: 'Creative', headerVariant: 'editorial', defaultAccentColor: '#F97316', recommendedFont: 'proxima-nova', description: 'Orrica Edge signature orange with polished creative hierarchy.' }),
  base('editorial-clean', 'Editorial Clean', { category: 'Creative / Design', style: 'Creative', headerAlign: 'center', headerVariant: 'centered', sectionHeadingStyle: 'small-caps-line', defaultAccentColor: '#7C3AED', recommendedFont: 'georgia', defaultMargin: 16, description: 'Editorial typography for design and content roles.' }),
  base('timeline-pro', 'Timeline Pro', { category: 'Operations / Administration', style: 'Two Column', format: 'Two Column', layout: 'two-column', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', defaultAccentColor: '#0EA5E9', recommendedFont: 'source-sans-3', defaultMargin: 0, description: 'Progression-focused two-column layout for detailed career histories.' }),
];

export const TEMPLATE_LIST: TemplatePreset[] = CURATED_TEMPLATE_PRESETS;

export function getTemplatePreset(id?: TemplateId | string): TemplatePreset {
  return CURATED_TEMPLATE_PRESETS.find((template) => template.id === id) ?? CURATED_TEMPLATE_PRESETS[0];
}

export function getTemplatesByCategory(category?: string): TemplatePreset[] {
  if (!category) return CURATED_TEMPLATE_PRESETS;
  return CURATED_TEMPLATE_PRESETS.filter((template) => template.category === category);
}
