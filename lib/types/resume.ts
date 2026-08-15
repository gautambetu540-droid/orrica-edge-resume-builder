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
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  responsibilities: string;
  achievements: string[];
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

export type LanguageProficiency = 'basic' | 'conversational' | 'professional' | 'fluent' | 'native';

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
  'header', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'achievements',
];

export type TemplateId =
  | 'modern-ats' | 'classic-professional' | 'minimal' | 'executive' | 'modern-two-column'
  | 'fresh-graduate' | 'bold-header' | 'elegant-serif' | 'compact-ats' | 'creative-sidebar'
  | 'clean-corporate' | 'tech-modern' | 'simple-chronological' | 'classic-two-column'
  | 'creative-modern' | 'dark-executive' | 'blue-accent' | 'orange-accent' | 'editorial-clean'
  | 'timeline-pro'
  | 'fresher-01' | 'fresher-02' | 'fresher-03' | 'fresher-04' | 'fresher-05' | 'fresher-06' | 'fresher-07' | 'fresher-08' | 'fresher-09' | 'fresher-10'
  | 'photo-01' | 'photo-02' | 'photo-03' | 'photo-04' | 'photo-05' | 'photo-06' | 'photo-07' | 'photo-08' | 'photo-09' | 'photo-10'
  | 'it-01' | 'it-02' | 'it-03' | 'it-04' | 'it-05' | 'it-06' | 'it-07' | 'it-08' | 'it-09' | 'it-10'
  | 'bpo-01' | 'bpo-02' | 'bpo-03' | 'bpo-04' | 'bpo-05' | 'bpo-06' | 'bpo-07' | 'bpo-08' | 'bpo-09' | 'bpo-10';

export type ResumeFont =
  | 'proxima-nova' | 'arial' | 'times-new-roman' | 'inter' | 'source-sans-3'
  | 'ibm-plex-sans' | 'merriweather' | 'georgia';

export interface ResumeSettings {
  template: TemplateId;
  font: ResumeFont;
  fontSize: number;
  headingScale: number;
  lineSpacing: number;
  sectionSpacing: number;
  margin: number;
  accentColor: string;
  textColor?: string;
  headingColor?: string;
  backgroundColor?: string;
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
  accentColor: '#2563EB',
  textColor: '#1F2937',
  headingColor: '#111827',
  backgroundColor: '#FFFFFF',
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
  personalInfo: { fullName: '', professionalTitle: '', email: '', phone: '', city: '', country: '' },
  summary: '', experience: [], education: [], projects: [], certifications: [], languages: [], achievements: [],
  skills: [
    { category: 'technical', items: [] }, { category: 'soft', items: [] },
    { category: 'tools', items: [] }, { category: 'languages', items: [] },
  ],
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
