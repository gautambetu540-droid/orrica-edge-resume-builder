// Core data model for a resume. This shape is what's stored in
// `resumes.resume_data` (JSONB) in Supabase and passed to AI endpoints.

export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  linkedin?: string;
  portfolio?: string;
  github?: string;
  photoUrl?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  jobTitle: string;
  location?: string;
  startDate: string; // YYYY-MM
  endDate?: string; // YYYY-MM, empty if current
  currentlyWorking: boolean;
  responsibilities: string; // raw/manual text
  achievements: string[]; // bullet points (AI or manual)
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

export interface SkillCategory {
  category: 'technical' | 'soft' | 'tools' | 'languages';
  items: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  role?: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export type LanguageProficiency =
  | 'basic'
  | 'conversational'
  | 'professional'
  | 'fluent'
  | 'native';

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: LanguageProficiency;
}

export interface AchievementEntry {
  id: string;
  type: 'award' | 'achievement' | 'publication' | 'volunteer' | 'other';
  title: string;
  description?: string;
  date?: string;
}

export type ResumeSectionId =
  | 'header'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'achievements';

export const DEFAULT_SECTION_ORDER: ResumeSectionId[] = [
  'header',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'achievements',
];

export type TemplateId =
  | 'modern-ats'
  | 'classic-professional'
  | 'minimal'
  | 'executive'
  | 'modern-two-column'
  | 'fresh-graduate'
  | 'bold-header'
  | 'elegant-serif'
  | 'compact-ats'
  | 'creative-sidebar';

export type ResumeFont =
  | 'proxima-nova'
  | 'arial'
  | 'times-new-roman'
  | 'inter'
  | 'source-sans-3'
  | 'ibm-plex-sans'
  | 'merriweather'
  | 'georgia';

export interface ResumeSettings {
  template: TemplateId;
  font: ResumeFont;
  fontSize: number; // base body pt, 9-12
  headingScale: number; // multiplier, 1.0-1.4
  lineSpacing: number; // 1.0-1.6
  sectionSpacing: number; // px, 8-32
  margin: number; // mm, 10-25
  accentColor: string; // hex
  sections: SectionConfig[];
}

export interface SectionConfig {
  id: ResumeSectionId;
  visible: boolean;
  order: number;
}

export const DEFAULT_SETTINGS: ResumeSettings = {
  template: 'modern-ats',
  font: 'arial',
  fontSize: 10.5,
  headingScale: 1.15,
  lineSpacing: 1.35,
  sectionSpacing: 16,
  margin: 16,
  accentColor: '#0EA5E9',
  sections: DEFAULT_SECTION_ORDER.map((id, i) => ({ id, visible: true, order: i })),
};

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: SkillCategory[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  achievements: AchievementEntry[];
  targetRole?: string;
}

export const EMPTY_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: '',
    professionalTitle: '',
    email: '',
    phone: '',
    city: '',
    country: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [
    { category: 'technical', items: [] },
    { category: 'soft', items: [] },
    { category: 'tools', items: [] },
    { category: 'languages', items: [] },
  ],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
};

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  resume_data: ResumeData;
  template: TemplateId;
  settings: ResumeSettings;
  created_at: string;
  updated_at: string;
}
