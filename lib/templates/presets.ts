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

const BASE_TEMPLATE_PRESETS: Record<string, TemplatePreset> = {
  'modern-ats': base('modern-ats', 'Modern ATS', { category: 'BPO / Customer Support', style: 'ATS', description: 'Text-first ATS structure with clear hierarchy for customer-facing roles.' }),
  'classic-professional': base('classic-professional', 'Classic Professional', { category: 'Finance / Accounting', style: 'Professional', recommendedFont: 'times-new-roman', defaultAccentColor: '#0F766E', description: 'Traditional corporate structure with polished finance and accounting hierarchy.' }),
  minimal: base('minimal', 'Minimal', { category: 'HR / Recruitment', style: 'Minimal', headerAlign: 'center', headerVariant: 'centered', sectionHeadingStyle: 'small-caps-line', dividers: false, defaultAccentColor: '#475569', recommendedFont: 'proxima-nova', defaultMargin: 16, description: 'Quiet, spacious design that keeps HR and recruiting profiles highly scannable.' }),
  executive: base('executive', 'Executive', { category: 'Executive / Management', style: 'Executive', headerAlign: 'center', headerVariant: 'banner', dividers: false, defaultAccentColor: '#1F2937', recommendedFont: 'merriweather', defaultMargin: 0, description: 'Premium leadership layout for directors, executives and senior managers.' }),
  'modern-two-column': base('modern-two-column', 'Modern Two Column', { category: 'Photo / Professional', style: 'Two Column', format: 'Photo', layout: 'two-column', sidebarVariant: 'solid', dividers: false, photoAllowed: true, defaultAccentColor: '#0891B2', defaultMargin: 0, description: 'Balanced two-column professional profile with an optional photo and confident sidebar.' }),
  'fresh-graduate': base('fresh-graduate', 'Fresh Graduate', { category: 'Fresher / Graduate', style: 'ATS', headerVariant: 'editorial', defaultAccentColor: '#16A34A', recommendedFont: 'proxima-nova', description: 'Education-forward structure for students, graduates and entry-level candidates.' }),
  'bold-header': base('bold-header', 'Bold Header', { category: 'Executive / Management', style: 'Executive', headerVariant: 'editorial', sectionHeadingStyle: 'bold-plain', defaultAccentColor: '#111827', recommendedFont: 'proxima-nova', defaultHeadingScale: 1.14, defaultMargin: 16, description: 'Strong nameplate and hierarchy for leadership and management applications.' }),
  'elegant-serif': base('elegant-serif', 'Elegant Serif', { category: 'HR / Recruitment', style: 'Minimal', headerVariant: 'editorial', sectionHeadingStyle: 'small-caps-line', defaultAccentColor: '#7C3AED', recommendedFont: 'times-new-roman', defaultMargin: 16, description: 'Refined serif typography for polished people and talent profiles.' }),
  'compact-ats': base('compact-ats', 'Compact ATS', { category: 'Operations / Administration', style: 'ATS', sectionHeadingStyle: 'bold-plain', defaultAccentColor: '#334155', recommendedFont: 'ibm-plex-sans', defaultFontSize: 9.6, defaultHeadingScale: 1.02, defaultLineSpacing: 1.2, defaultSectionSpacing: 9, defaultMargin: 13, description: 'Space-efficient ATS format for detailed operations and administrative histories.' }),
  'creative-sidebar': base('creative-sidebar', 'Creative Sidebar', { category: 'Photo / Professional', style: 'Creative', format: 'Photo', layout: 'two-column', sidebarVariant: 'soft', sectionHeadingStyle: 'uppercase-underline', photoAllowed: true, defaultAccentColor: '#DB2777', defaultMargin: 0, description: 'Distinctive photo-enabled sidebar layout for client-facing professionals.' }),
  'clean-corporate': base('clean-corporate', 'Clean Corporate', { category: 'Sales / Business Development', style: 'Professional', defaultAccentColor: '#2563EB', description: 'Crisp corporate format for sales, account management and business growth roles.' }),
  'tech-modern': base('tech-modern', 'Tech Modern', { category: 'IT / Software / Technology', style: 'Modern', format: 'Two Column', layout: 'two-column', sidebarVariant: 'solid', sectionHeadingStyle: 'uppercase-accent', dividers: false, defaultAccentColor: '#06B6D4', recommendedFont: 'ibm-plex-sans', defaultMargin: 0, description: 'Technical two-column layout for engineering, cloud and product technology roles.' }),
  'simple-chronological': base('simple-chronological', 'Simple Chronological', { category: 'Operations / Administration', style: 'ATS', headerVariant: 'compact', sectionHeadingStyle: 'uppercase-underline', defaultAccentColor: '#64748B', description: 'Straightforward reverse-chronological experience flow for operations roles.' }),
  'classic-two-column': base('classic-two-column', 'Classic Two Column', { category: 'Finance / Accounting', style: 'Professional', format: 'Two Column', layout: 'two-column', sidebarVariant: 'soft', sectionHeadingStyle: 'uppercase-underline', defaultAccentColor: '#0F766E', recommendedFont: 'times-new-roman', defaultMargin: 0, description: 'Traditional two-column finance format with clear sections and professional restraint.' }),
  'creative-modern': base('creative-modern', 'Creative Modern', { category: 'Marketing / Digital Marketing', style: 'Creative', format: 'Two Column', layout: 'two-column', headerAlign: 'center', headerVariant: 'centered', sidebarVariant: 'soft', dividers: false, photoAllowed: true, defaultAccentColor: '#8B5CF6', recommendedFont: 'proxima-nova', defaultMargin: 0, description: 'Contemporary visual hierarchy for digital marketing and brand professionals.' }),
  'dark-executive': base('dark-executive', 'Dark Executive', { category: 'Executive / Management', style: 'Executive', format: 'Two Column', layout: 'two-column', headerVariant: 'editorial', sidebarVariant: 'solid', sectionHeadingStyle: 'bold-plain', dividers: false, defaultAccentColor: '#111827', defaultMargin: 0, description: 'High-contrast leadership format with a strong dark sidebar.' }),
  'blue-accent': base('blue-accent', 'Blue Accent', { category: 'Healthcare / Medical', style: 'Professional', defaultAccentColor: '#2563EB', recommendedFont: 'source-sans-3', description: 'Calm, trustworthy structure for healthcare and medical applications.' }),
  'orange-accent': base('orange-accent', 'Orrica Signature', { category: 'Creative / Design', style: 'Creative', headerVariant: 'editorial', defaultAccentColor: '#F97316', recommendedFont: 'proxima-nova', description: 'Orrica Edge signature orange with a polished creative hierarchy.' }),
  'editorial-clean': base('editorial-clean', 'Editorial Clean', { category: 'Creative / Design', style: 'Creative', headerAlign: 'center', headerVariant: 'centered', sectionHeadingStyle: 'small-caps-line', defaultAccentColor: '#7C3AED', recommendedFont: 'georgia', defaultMargin: 16, description: 'Editorial typography for design and content roles without sacrificing clarity.' }),
  'timeline-pro': base('timeline-pro', 'Timeline Pro', { category: 'Operations / Administration', style: 'Two Column', format: 'Two Column', layout: 'two-column', sidebarVariant: 'plain', sectionHeadingStyle: 'bold-plain', defaultAccentColor: '#0EA5E9', recommendedFont: 'source-sans-3', defaultMargin: 0, description: 'Progression-focused two-column layout for detailed career histories.' }),
};

const CATEGORY_CONFIG: Array<{ category: string; ids: TemplateId[]; names: string[]; accents: string[]; fonts: ResumeFont[]; photo?: boolean }> = [
  { category: 'Fresher / Graduate', ids: ['fresh-graduate','fresher-01','fresher-02','fresher-03','fresher-04','fresher-05','fresher-06','fresher-07','fresher-08','fresher-09'], names: ['Graduate Focus','Campus Ready','First Job ATS','Entry-Level Modern','Internship Ready','Academic Pro','Graduate Minimal','Placement Ready','Career Starter','Junior Professional'], accents: ['#16A34A','#2563EB','#0F766E','#7C3AED','#0891B2','#4F46E5','#15803D','#1D4ED8','#0D9488','#475569'], fonts: ['proxima-nova','inter','source-sans-3','ibm-plex-sans','arial'] },
  { category: 'IT / Software / Technology', ids: ['tech-modern','it-01','it-02','it-03','it-04','it-05','it-06','it-07','it-08','it-09'], names: ['Tech Modern','Software Engineer','Full Stack Developer','Data Analyst','DevOps Engineer','Cloud Engineer','Cybersecurity Pro','Product Tech','Developer ATS','Technology Executive'], accents: ['#06B6D4','#2563EB','#0891B2','#0F766E','#4F46E5','#0284C7','#334155','#0369A1','#0E7490','#1D4ED8'], fonts: ['ibm-plex-sans','inter','source-sans-3','arial'] },
  { category: 'BPO / Customer Support', ids: ['modern-ats','bpo-01','bpo-02','bpo-03','bpo-04','bpo-05','bpo-06','bpo-07','bpo-08','bpo-09'], names: ['Modern ATS','International Voice','Customer Support','Technical Support','Customer Success','Non-Voice Support','BPO Team Lead','Call Center Pro','Service Desk','Support Specialist'], accents: ['#2563EB','#0F766E','#7C3AED','#0891B2','#16A34A','#4F46E5','#DB2777','#0E7490','#15803D','#1D4ED8'], fonts: ['arial','source-sans-3','inter'] },
  { category: 'Finance / Accounting', ids: ['classic-professional','classic-two-column','finance-01','finance-02','finance-03','finance-04','finance-05','finance-06','finance-07','finance-08'], names: ['Classic Professional','Finance Two Column','Financial Analyst','Accountant','Accounts Executive','Banking Operations','Audit Professional','FP&A Analyst','Tax Specialist','Finance Manager'], accents: ['#0F766E','#0F766E','#1D4ED8','#475569','#2563EB','#0F766E','#334155','#0891B2','#15803D','#1F2937'], fonts: ['times-new-roman','inter','source-sans-3','arial'] },
  { category: 'Sales / Business Development', ids: ['clean-corporate','sales-01','sales-02','sales-03','sales-04','sales-05','sales-06','sales-07','sales-08','sales-09'], names: ['Clean Corporate','Sales Executive','Account Manager','Business Development','Enterprise Sales','Retail Sales','Inside Sales','Key Account Pro','Growth Manager','Revenue Leader'], accents: ['#2563EB','#0F766E','#F97316','#7C3AED','#0891B2','#16A34A','#1D4ED8','#0E7490','#4F46E5','#334155'], fonts: ['inter','proxima-nova','arial','source-sans-3'] },
  { category: 'Marketing / Digital Marketing', ids: ['creative-modern','marketing-01','marketing-02','marketing-03','marketing-04','marketing-05','marketing-06','marketing-07','marketing-08','marketing-09'], names: ['Creative Modern','Digital Marketing','SEO Specialist','Social Media','Content Strategist','Brand Marketing','Performance Marketing','Growth Marketing','Communications Pro','Marketing Manager'], accents: ['#8B5CF6','#7C3AED','#DB2777','#F97316','#0891B2','#2563EB','#16A34A','#4F46E5','#C2410C','#0F766E'], fonts: ['proxima-nova','inter','source-sans-3','georgia'] },
  { category: 'HR / Recruitment', ids: ['minimal','elegant-serif','hr-01','hr-02','hr-03','hr-04','hr-05','hr-06','hr-07','hr-08'], names: ['Minimal','Elegant Serif','HR Generalist','Recruiter Pro','Talent Acquisition','People Operations','HR Business Partner','Learning & Development','Talent Manager','HR Executive'], accents: ['#475569','#7C3AED','#2563EB','#0F766E','#0891B2','#16A34A','#4F46E5','#DB2777','#1D4ED8','#334155'], fonts: ['proxima-nova','times-new-roman','inter','georgia'] },
  { category: 'Operations / Administration', ids: ['compact-ats','simple-chronological','timeline-pro','operations-01','operations-02','operations-03','operations-04','operations-05','operations-06','operations-07'], names: ['Compact ATS','Simple Chronological','Timeline Pro','Operations Pro','Administrative ATS','Process Manager','Office Administrator','Program Coordinator','Supply Chain Pro','Operations Manager'], accents: ['#334155','#64748B','#0EA5E9','#2563EB','#0F766E','#475569','#0891B2','#4F46E5','#15803D','#1D4ED8'], fonts: ['ibm-plex-sans','arial','source-sans-3','inter'] },
  { category: 'Healthcare / Medical', ids: ['blue-accent','healthcare-01','healthcare-02','healthcare-03','healthcare-04','healthcare-05','healthcare-06','healthcare-07','healthcare-08','healthcare-09'], names: ['Blue Accent','Registered Nurse','Medical Assistant','Healthcare Admin','Clinical Coordinator','Pharmacy Pro','Medical Billing','Hospital Operations','Public Health','Healthcare Manager'], accents: ['#2563EB','#0F766E','#0891B2','#16A34A','#1D4ED8','#0E7490','#475569','#4F46E5','#15803D','#334155'], fonts: ['source-sans-3','inter','arial'] },
  { category: 'Creative / Design', ids: ['editorial-clean','orange-accent','creative-01','creative-02','creative-03','creative-04','creative-05','creative-06','creative-07','creative-08'], names: ['Editorial Clean','Orrica Signature','UI/UX Designer','Graphic Designer','Art Director','Content Designer','Creative Director','Motion Designer','Brand Designer','Creative Strategist'], accents: ['#7C3AED','#F97316','#DB2777','#8B5CF6','#0891B2','#F97316','#C2410C','#4F46E5','#0F766E','#1D4ED8'], fonts: ['georgia','proxima-nova','inter','merriweather'] },
  { category: 'Executive / Management', ids: ['executive','bold-header','dark-executive','executive-01','executive-02','executive-03','executive-04','executive-05','executive-06','executive-07'], names: ['Executive','Bold Executive','Dark Executive','Senior Manager','Operations Director','Business Leader','General Manager','VP Professional','Director Pro','C-Suite Classic'], accents: ['#1F2937','#111827','#111827','#0F766E','#1D4ED8','#334155','#0F766E','#4F46E5','#475569','#111827'], fonts: ['merriweather','proxima-nova','inter','georgia'] },
  { category: 'Photo / Professional', ids: ['modern-two-column','creative-sidebar','photo-01','photo-02','photo-03','photo-04','photo-05','photo-06','photo-07','photo-08'], names: ['Modern Two Column','Creative Sidebar','Professional Photo','Consultant Photo','Hospitality Pro','Front Office','Sales Photo','Customer Success Photo','Personal Brand','Client Services'], accents: ['#0891B2','#DB2777','#2563EB','#0F766E','#C2410C','#7C3AED','#0891B2','#16A34A','#4F46E5','#15803D'], fonts: ['inter','proxima-nova','source-sans-3','arial'], photo: true },
];

const generatedPresets: Record<string, TemplatePreset> = {};
for (const group of CATEGORY_CONFIG) {
  group.ids.forEach((id, index) => {
    if (BASE_TEMPLATE_PRESETS[id]) {
      generatedPresets[id] = { ...BASE_TEMPLATE_PRESETS[id], category: group.category };
      return;
    }
    const layout: TemplateLayout = index % 3 === 0 ? 'two-column' : 'single-column';
    const style = (layout === 'two-column' ? 'Two Column' : (index % 3 === 0 ? 'ATS' : 'Modern')) as TemplatePreset['style'];
    generatedPresets[id] = base(id, group.names[index], {
      category: group.category,
      style,
      format: group.photo ? 'Photo' : (layout === 'two-column' ? 'Two Column' : 'Single Column'),
      layout,
      headerAlign: index % 4 === 0 ? 'center' : 'left',
      headerVariant: (['clean','centered','banner','editorial','compact'] as HeaderVariant[])[index % 5],
      sidebarVariant: layout === 'two-column' ? (index % 2 === 0 ? 'solid' : 'soft') : 'plain',
      sectionHeadingStyle: (['uppercase-accent','uppercase-underline','small-caps-line','bold-plain'] as TemplatePreset['sectionHeadingStyle'][])[index % 4],
      dividers: index % 3 !== 0,
      photoAllowed: Boolean(group.photo),
      defaultAccentColor: group.accents[index],
      recommendedFont: group.fonts[index % group.fonts.length],
      defaultFontSize: index % 4 === 0 ? 9.8 : 10.2,
      defaultHeadingScale: 1.05 + (index % 3) * 0.03,
      defaultLineSpacing: 1.22 + (index % 4) * 0.03,
      defaultSectionSpacing: 10 + (index % 4) * 2,
      defaultMargin: layout === 'two-column' ? 0 : 14 + (index % 3),
      description: `${group.names[index]} — ${group.category} template with recruiter-friendly structure, polished typography and customizable spacing.`,
    });
  });
}

export const TEMPLATE_PRESETS: Record<TemplateId, TemplatePreset> = generatedPresets as Record<TemplateId, TemplatePreset>;
export const TEMPLATE_LIST = Object.values(TEMPLATE_PRESETS);
export const TEMPLATE_CATEGORIES = CATEGORY_CONFIG.map((group) => group.category);