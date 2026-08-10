import { ResumeFont, TemplateId } from '@/lib/types/resume';

// Maps our curated font choices to real font-family stacks. Inter, Source
// Sans 3 and IBM Plex Sans are loaded via next/font in app/layout.tsx and
// app/resume/[id]/print/page.tsx; Merriweather/Georgia use safe fallbacks so
// PDF rendering never silently substitutes an unintended font.
export const FONT_STACKS: Record<ResumeFont, string> = {
  inter: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
  'source-sans-3': "var(--font-source-sans-3), ui-sans-serif, system-ui, sans-serif",
  'ibm-plex-sans': "var(--font-ibm-plex-sans), ui-sans-serif, system-ui, sans-serif",
  merriweather: "var(--font-merriweather), Georgia, 'Times New Roman', serif",
  georgia: "Georgia, 'Times New Roman', serif",
};

export type TemplateLayout = 'single-column' | 'two-column';

export interface TemplatePreset {
  id: TemplateId;
  name: string;
  layout: TemplateLayout;
  headerAlign: 'left' | 'center';
  sectionHeadingStyle: 'uppercase-underline' | 'uppercase-accent' | 'small-caps-line' | 'bold-plain';
  dividers: boolean;
  photoAllowed: boolean;
  defaultAccentColor: string;
  description: string;
}

export const TEMPLATE_PRESETS: Record<TemplateId, TemplatePreset> = {
  'modern-ats': {
    id: 'modern-ats',
    name: 'Modern ATS',
    layout: 'single-column',
    headerAlign: 'left',
    sectionHeadingStyle: 'uppercase-accent',
    dividers: false,
    photoAllowed: false,
    defaultAccentColor: '#4338ca',
    description: 'Clean single-column layout tuned for maximum ATS parsing accuracy.',
  },
  'classic-professional': {
    id: 'classic-professional',
    name: 'Classic Professional',
    layout: 'single-column',
    headerAlign: 'center',
    sectionHeadingStyle: 'uppercase-underline',
    dividers: true,
    photoAllowed: false,
    defaultAccentColor: '#1f2937',
    description: 'Traditional centered header with underlined section headings.',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    layout: 'single-column',
    headerAlign: 'left',
    sectionHeadingStyle: 'small-caps-line',
    dividers: false,
    photoAllowed: false,
    defaultAccentColor: '#0f172a',
    description: 'Understated typography-first design with generous whitespace.',
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    layout: 'single-column',
    headerAlign: 'left',
    sectionHeadingStyle: 'bold-plain',
    dividers: true,
    photoAllowed: false,
    defaultAccentColor: '#7c2d12',
    description: 'Confident serif-friendly design suited for senior leadership resumes.',
  },
  'modern-two-column': {
    id: 'modern-two-column',
    name: 'Modern Two Column',
    layout: 'two-column',
    headerAlign: 'left',
    sectionHeadingStyle: 'uppercase-accent',
    dividers: false,
    photoAllowed: true,
    defaultAccentColor: '#0369a1',
    description: 'Sidebar for contact/skills, main column for experience — great information density.',
  },
  'fresh-graduate': {
    id: 'fresh-graduate',
    name: 'Fresh Graduate',
    layout: 'single-column',
    headerAlign: 'left',
    sectionHeadingStyle: 'uppercase-accent',
    dividers: false,
    photoAllowed: false,
    defaultAccentColor: '#15803d',
    description: 'Education-forward ordering, ideal for early-career candidates with limited work history.',
  },
  'bold-header': {
    id: 'bold-header',
    name: 'Bold Header',
    layout: 'single-column',
    headerAlign: 'center',
    sectionHeadingStyle: 'uppercase-accent',
    dividers: false,
    photoAllowed: false,
    defaultAccentColor: '#be123c',
    description: 'A confident centered header with vivid section accents — great for standing out.',
  },
  'elegant-serif': {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    layout: 'single-column',
    headerAlign: 'left',
    sectionHeadingStyle: 'small-caps-line',
    dividers: true,
    photoAllowed: false,
    defaultAccentColor: '#78350f',
    description: 'Refined serif-friendly styling with hairline dividers — a timeless, editorial feel.',
  },
  'compact-ats': {
    id: 'compact-ats',
    name: 'Compact ATS',
    layout: 'single-column',
    headerAlign: 'left',
    sectionHeadingStyle: 'bold-plain',
    dividers: false,
    photoAllowed: false,
    defaultAccentColor: '#334155',
    description: 'Tight spacing and dense layout to fit more content on one page without losing clarity.',
  },
  'creative-sidebar': {
    id: 'creative-sidebar',
    name: 'Creative Sidebar',
    layout: 'two-column',
    headerAlign: 'left',
    sectionHeadingStyle: 'uppercase-accent',
    dividers: false,
    photoAllowed: true,
    defaultAccentColor: '#9333ea',
    description: 'Vivid sidebar layout with photo support — ideal for design and creative roles.',
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATE_PRESETS);
