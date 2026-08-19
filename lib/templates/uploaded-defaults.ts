import { DEFAULT_SETTINGS, ResumeData, ResumeSettings } from '@/lib/types/resume';

export const UPLOADED_TEMPLATE_EMAIL = 'hello@orricaedge.com';

export const UPLOADED_TEMPLATE_DEFAULTS: Record<string, Partial<ResumeSettings & { data: Partial<ResumeData> }>> = {
  'uploaded-blue-professional': { ...DEFAULT_SETTINGS, email: UPLOADED_TEMPLATE_EMAIL } as never,
  'uploaded-navy-modern': { ...DEFAULT_SETTINGS, email: UPLOADED_TEMPLATE_EMAIL } as never,
  'uploaded-blue-minimal-ats': { ...DEFAULT_SETTINGS, email: UPLOADED_TEMPLATE_EMAIL } as never,
  'uploaded-accountant-minimal': { ...DEFAULT_SETTINGS, email: UPLOADED_TEMPLATE_EMAIL } as never,
};
