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
): TemplatePreset => ({ id, name, ...options });

const categoryPreset = (
  id: TemplateId,
  name: string,
  category: string,
  options: Omit<TemplatePreset, 'id' | 'name' | 'category' | 'description'> & { description: string },
): TemplatePreset => ({ id, name, category, ...options });

export const TEMPLATE_PRESETS: Record<TemplateId, TemplatePreset> = {
  'modern-ats': preset('modern-ats', 'Modern ATS', { category: 'ATS / Professional', layout: 'single-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-accent', dividers: true, photoAllowed: false, defaultAccentColor: '#2563EB', recommendedFont: 'inter', defaultFontSize: 10.2, defaultHeadingScale: 1.08, defaultLineSpacing: 1.28, defaultSectionSpacing: 13, defaultMargin: 15, description: 'Clean recruiter-first structure with restrained blue accents and excellent ATS readability.' }),
  'classic-professional': preset('classic-professional', 'Classic Professional', { category: 'Professional', layout: 'single-column', headerAlign: 'left', headerVariant: 'compact', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-underline', dividers: true, photoAllowed: false, defaultAccentColor: '#0F766E', recommendedFont: 'times-new-roman', defaultFontSize: 10.1, defaultHeadingScale: 1.08, defaultLineSpacing: 1.24, defaultSectionSpacing: 12, defaultMargin: 15, description: 'Traditional corporate hierarchy with calm teal accents.' }),
  minimal: preset('minimal', 'Minimal', { category: 'Minimal', layout: 'single-column', headerAlign: 'center', headerVariant: 'centered', sidebarVariant: 'plain', sectionHeadingStyle: 'small-caps-line', dividers: false, photoAllowed: false, defaultAccentColor: '#475569', recommendedFont: 'proxima-nova', defaultFontSize: 10.4, defaultHeadingScale: 1.05, defaultLineSpacing: 1.3, defaultSectionSpacing: 14, defaultMargin: 16, description: 'Quiet, spacious one-page resume focused on typography and whitespace.' }),
  executive: preset('executive', 'Executive', { category: 'Executive', layout: 'single-column', headerAlign: 'center', headerVariant: 'banner', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', dividers: false, photoAllowed: false, defaultAccentColor: '#334155', recommendedFont: 'merriweather', defaultFontSize: 10.4, defaultHeadingScale: 1.08, defaultLineSpacing: 1.3, defaultSectionSpacing: 15, defaultMargin: 0, description: 'Editorial executive design for managers, leaders and senior specialists.' }),
  'modern-two-column': preset('modern-two-column', 'Modern Two Column', { category: 'Professional', layout: 'two-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'solid', sectionHeadingStyle: 'uppercase-accent', dividers: false, photoAllowed: false, defaultAccentColor: '#2563EB', recommendedFont: 'inter', defaultFontSize: 10.2, defaultHeadingScale: 1.08, defaultLineSpacing: 1.28, defaultSectionSpacing: 15, defaultMargin: 0, description: 'Modern two-column hierarchy with a polished navy sidebar.' }),
  'fresh-graduate': preset('fresh-graduate', 'Fresh Graduate', { category: 'Fresher', layout: 'single-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-accent', dividers: true, photoAllowed: false, defaultAccentColor: '#16A34A', recommendedFont: 'proxima-nova', defaultFontSize: 10.3, defaultHeadingScale: 1.1, defaultLineSpacing: 1.28, defaultSectionSpacing: 14, defaultMargin: 15, description: 'Education-forward structure for students, interns and first-job candidates.' }),
  'bold-header': preset('bold-header', 'Bold Header', { category: 'Modern', layout: 'single-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', dividers: true, photoAllowed: false, defaultAccentColor: '#7C3AED', recommendedFont: 'proxima-nova', defaultFontSize: 10.4, defaultHeadingScale: 1.14, defaultLineSpacing: 1.3, defaultSectionSpacing: 15, defaultMargin: 16, description: 'Strong visual nameplate with a refined violet accent.' }),
  'elegant-serif': preset('elegant-serif', 'Elegant Serif', { category: 'Editorial', layout: 'single-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'plain', sectionHeadingStyle: 'small-caps-line', dividers: true, photoAllowed: false, defaultAccentColor: '#92400E', recommendedFont: 'times-new-roman', defaultFontSize: 10.3, defaultHeadingScale: 1.08, defaultLineSpacing: 1.3, defaultSectionSpacing: 14, defaultMargin: 16, description: 'Refined serif layout with warm brown highlights and balanced rhythm.' }),
  'compact-ats': preset('compact-ats', 'Compact ATS', { category: 'ATS / Professional', layout: 'single-column', headerAlign: 'left', headerVariant: 'compact', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', dividers: true, photoAllowed: false, defaultAccentColor: '#0F172A', recommendedFont: 'ibm-plex-sans', defaultFontSize: 9.6, defaultHeadingScale: 1.02, defaultLineSpacing: 1.2, defaultSectionSpacing: 9, defaultMargin: 13, description: 'Dense but readable one-page format for detailed experience.' }),
  'creative-sidebar': preset('creative-sidebar', 'Creative Sidebar', { category: 'Creative', layout: 'two-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'soft', sectionHeadingStyle: 'uppercase-underline', dividers: true, photoAllowed: true, defaultAccentColor: '#DB2777', recommendedFont: 'arial', defaultFontSize: 10.1, defaultHeadingScale: 1.06, defaultLineSpacing: 1.24, defaultSectionSpacing: 13, defaultMargin: 0, description: 'Distinctive two-column profile with a soft rose sidebar and optional photo.' }),
  'clean-corporate': preset('clean-corporate', 'Clean Corporate', { category: 'Corporate', layout: 'single-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', dividers: true, photoAllowed: false, defaultAccentColor: '#0891B2', recommendedFont: 'inter', defaultFontSize: 10.2, defaultHeadingScale: 1.08, defaultLineSpacing: 1.27, defaultSectionSpacing: 13, defaultMargin: 15, description: 'Straightforward corporate resume with crisp cyan-blue detailing.' }),
  'tech-modern': preset('tech-modern', 'Tech Modern', { category: 'IT / Technology', layout: 'two-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'solid', sectionHeadingStyle: 'uppercase-accent', dividers: false, photoAllowed: false, defaultAccentColor: '#0284C7', recommendedFont: 'ibm-plex-sans', defaultFontSize: 10, defaultHeadingScale: 1.07, defaultLineSpacing: 1.25, defaultSectionSpacing: 13, defaultMargin: 0, description: 'Technical two-column resume for engineering, software and product roles.' }),
  'simple-chronological': preset('simple-chronological', 'Simple Chronological', { category: 'Professional', layout: 'single-column', headerAlign: 'left', headerVariant: 'compact', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-underline', dividers: true, photoAllowed: false, defaultAccentColor: '#475569', recommendedFont: 'arial', defaultFontSize: 10.1, defaultHeadingScale: 1.05, defaultLineSpacing: 1.25, defaultSectionSpacing: 12, defaultMargin: 15, description: 'Classic reverse-chronological structure with clear section rules.' }),
  'classic-two-column': preset('classic-two-column', 'Classic Two Column', { category: 'Professional', layout: 'two-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'soft', sectionHeadingStyle: 'uppercase-underline', dividers: true, photoAllowed: false, defaultAccentColor: '#0F766E', recommendedFont: 'times-new-roman', defaultFontSize: 10, defaultHeadingScale: 1.06, defaultLineSpacing: 1.24, defaultSectionSpacing: 12, defaultMargin: 0, description: 'Traditional two-column format with calm green-teal styling.' }),
  'creative-modern': preset('creative-modern', 'Creative Modern', { category: 'Creative', layout: 'two-column', headerAlign: 'center', headerVariant: 'centered', sidebarVariant: 'soft', sectionHeadingStyle: 'uppercase-accent', dividers: false, photoAllowed: true, defaultAccentColor: '#C026D3', recommendedFont: 'proxima-nova', defaultFontSize: 10.2, defaultHeadingScale: 1.1, defaultLineSpacing: 1.28, defaultSectionSpacing: 14, defaultMargin: 0, description: 'Contemporary visual hierarchy for creative and marketing profiles.' }),
  'dark-executive': preset('dark-executive', 'Dark Executive', { category: 'Executive', layout: 'two-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'solid', sectionHeadingStyle: 'bold-plain', dividers: false, photoAllowed: false, defaultAccentColor: '#111827', recommendedFont: 'inter', defaultFontSize: 10.1, defaultHeadingScale: 1.1, defaultLineSpacing: 1.26, defaultSectionSpacing: 14, defaultMargin: 0, description: 'High-contrast executive layout with an elegant graphite sidebar.' }),
  'blue-accent': preset('blue-accent', 'Blue Accent', { category: 'Professional', layout: 'single-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-accent', dividers: true, photoAllowed: false, defaultAccentColor: '#2563EB', recommendedFont: 'source-sans-3', defaultFontSize: 10.2, defaultHeadingScale: 1.07, defaultLineSpacing: 1.28, defaultSectionSpacing: 13, defaultMargin: 15, description: 'Clean professional format with a confident blue accent system.' }),
  'orange-accent': preset('orange-accent', 'Warm Accent', { category: 'Modern', layout: 'single-column', headerAlign: 'left', headerVariant: 'editorial', sidebarVariant: 'plain', sectionHeadingStyle: 'uppercase-accent', dividers: true, photoAllowed: false, defaultAccentColor: '#EA580C', recommendedFont: 'proxima-nova', defaultFontSize: 10.3, defaultHeadingScale: 1.09, defaultLineSpacing: 1.28, defaultSectionSpacing: 14, defaultMargin: 15, description: 'Warm terracotta accent with a polished modern hierarchy.' }),
  'editorial-clean': preset('editorial-clean', 'Editorial Clean', { category: 'Editorial', layout: 'single-column', headerAlign: 'center', headerVariant: 'centered', sidebarVariant: 'plain', sectionHeadingStyle: 'small-caps-line', dividers: true, photoAllowed: false, defaultAccentColor: '#7C3AED', recommendedFont: 'georgia', defaultFontSize: 10.2, defaultHeadingScale: 1.08, defaultLineSpacing: 1.3, defaultSectionSpacing: 14, defaultMargin: 16, description: 'Magazine-inspired typography without sacrificing ATS clarity.' }),
  'timeline-pro': preset('timeline-pro', 'Timeline Pro', { category: 'Professional', layout: 'two-column', headerAlign: 'left', headerVariant: 'clean', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', dividers: true, photoAllowed: false, defaultAccentColor: '#0D9488', recommendedFont: 'source-sans-3', defaultFontSize: 10.1, defaultHeadingScale: 1.07, defaultLineSpacing: 1.26, defaultSectionSpacing: 13, defaultMargin: 0, description: 'Structured two-column presentation with a strong career progression feel.' }),
};

const fresherColors = ['#2563EB', '#16A34A', '#7C3AED', '#0891B2', '#0F766E', '#4F46E5', '#059669', '#9333EA', '#0369A1', '#65A30D'];
const photoColors = ['#DB2777', '#C026D3', '#2563EB', '#0891B2', '#0F766E', '#7C3AED', '#BE123C', '#9333EA', '#0E7490', '#15803D'];
const itColors = ['#0284C7', '#2563EB', '#4F46E5', '#0F766E', '#0891B2', '#334155', '#7C3AED', '#0369A1', '#1D4ED8', '#0D9488'];
const bpoColors = ['#0F766E', '#0E7490', '#2563EB', '#4F46E5', '#4338CA', '#0891B2', '#15803D', '#0369A1', '#1D4ED8', '#475569'];

Array.from({ length: 10 }, (_, index) => {
  const n = String(index + 1).padStart(2, '0') as unknown as number;
  const id = `fresher-${String(index + 1).padStart(2, '0')}` as TemplateId;
  TEMPLATE_PRESETS[id] = categoryPreset(id, `Fresher ${index + 1}`, 'Fresher', {
    layout: index % 3 === 0 ? 'two-column' : 'single-column', headerAlign: index % 2 === 0 ? 'left' : 'center', headerVariant: index % 4 === 0 ? 'editorial' : index % 4 === 1 ? 'centered' : 'clean', sidebarVariant: index % 3 === 0 ? 'soft' : 'plain', sectionHeadingStyle: index % 2 === 0 ? 'uppercase-accent' : 'bold-plain', dividers: index % 2 === 0, photoAllowed: false, defaultAccentColor: fresherColors[index], recommendedFont: ['proxima-nova', 'inter', 'source-sans-3', 'arial'][index % 4] as ResumeFont, defaultFontSize: 10.2, defaultHeadingScale: 1.07, defaultLineSpacing: 1.28, defaultSectionSpacing: 13, defaultMargin: 0,
    description: 'Fresher-friendly resume with clean education, internship, project and skills hierarchy.',
  });
});

Array.from({ length: 10 }, (_, index) => {
  const id = `photo-${String(index + 1).padStart(2, '0')}` as TemplateId;
  TEMPLATE_PRESETS[id] = categoryPreset(id, `Photo Resume ${index + 1}`, 'Photo Resume', {
    layout: index % 2 === 0 ? 'two-column' : 'single-column', headerAlign: index % 3 === 0 ? 'center' : 'left', headerVariant: index % 3 === 0 ? 'banner' : index % 3 === 1 ? 'editorial' : 'clean', sidebarVariant: index % 2 === 0 ? 'solid' : 'soft', sectionHeadingStyle: index % 2 === 0 ? 'uppercase-accent' : 'small-caps-line', dividers: index % 3 !== 0, photoAllowed: true, defaultAccentColor: photoColors[index], recommendedFont: ['inter', 'proxima-nova', 'merriweather', 'georgia'][index % 4] as ResumeFont, defaultFontSize: 10.1, defaultHeadingScale: 1.08, defaultLineSpacing: 1.27, defaultSectionSpacing: 13, defaultMargin: 0,
    description: 'Photo-ready resume for hospitality, sales, customer-facing and creative profiles.',
  });
});

Array.from({ length: 10 }, (_, index) => {
  const id = `it-${String(index + 1).padStart(2, '0')}` as TemplateId;
  TEMPLATE_PRESETS[id] = categoryPreset(id, `IT / Tech ${index + 1}`, 'IT / Technology', {
    layout: index % 2 === 0 ? 'two-column' : 'single-column', headerAlign: 'left', headerVariant: index % 4 === 0 ? 'banner' : 'clean', sidebarVariant: index % 2 === 0 ? 'solid' : 'plain', sectionHeadingStyle: index % 2 === 0 ? 'uppercase-accent' : 'bold-plain', dividers: false, photoAllowed: false, defaultAccentColor: itColors[index], recommendedFont: ['ibm-plex-sans', 'inter', 'source-sans-3', 'arial'][index % 4] as ResumeFont, defaultFontSize: 10, defaultHeadingScale: 1.06, defaultLineSpacing: 1.25, defaultSectionSpacing: 12, defaultMargin: 0,
    description: 'Technical resume with clean project, technology, skills and achievement hierarchy.',
  });
});

Array.from({ length: 10 }, (_, index) => {
  const id = `bpo-${String(index + 1).padStart(2, '0')}` as TemplateId;
  TEMPLATE_PRESETS[id] = categoryPreset(id, `BPO / Customer Support ${index + 1}`, 'BPO / Customer Support', {
    layout: index % 3 === 0 ? 'two-column' : 'single-column', headerAlign: index % 3 === 1 ? 'center' : 'left', headerVariant: index % 4 === 0 ? 'centered' : index % 4 === 1 ? 'compact' : 'clean', sidebarVariant: index % 3 === 0 ? 'soft' : 'plain', sectionHeadingStyle: index % 2 === 0 ? 'uppercase-accent' : 'bold-plain', dividers: true, photoAllowed: index % 5 === 0, defaultAccentColor: bpoColors[index], recommendedFont: ['inter', 'source-sans-3', 'arial', 'proxima-nova'][index % 4] as ResumeFont, defaultFontSize: 10.1, defaultHeadingScale: 1.06, defaultLineSpacing: 1.27, defaultSectionSpacing: 12, defaultMargin: 0,
    description: 'Clean customer-service resume optimized for communication, process and operations roles.',
  });
});

export const TEMPLATE_LIST = Object.values(TEMPLATE_PRESETS);

export const TEMPLATE_CATEGORIES = ['All', 'Fresher', 'Photo Resume', 'IT / Technology', 'BPO / Customer Support', 'ATS / Professional', 'Professional', 'Corporate', 'Executive', 'Creative', 'Editorial', 'Minimal', 'Modern'] as const;
