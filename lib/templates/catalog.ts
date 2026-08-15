import { TemplateId } from '@/lib/types/resume';
import { TEMPLATE_LIST, TEMPLATE_CATEGORIES } from './presets';

export type TemplateCollection = {
  id: string;
  label: string;
  description: string;
  templateIds: TemplateId[];
};

const ids = (prefix: string) => TEMPLATE_LIST.filter((template) => template.id.startsWith(prefix)).map((template) => template.id);

export const TEMPLATE_COLLECTIONS: TemplateCollection[] = [
  { id: 'fresher', label: 'Fresher Resume', description: 'Entry-level layouts focused on education, projects, internships and skills.', templateIds: ids('fresher-') },
  { id: 'photo', label: 'Photo Resume', description: 'Professional photo-ready layouts for customer-facing and profile-driven roles.', templateIds: ids('photo-') },
  { id: 'it', label: 'IT / Technology', description: 'Technical layouts for software, engineering, data, product and IT profiles.', templateIds: ids('it-') },
  { id: 'bpo', label: 'BPO / Customer Support', description: 'Clean communication, operations and customer-service focused layouts.', templateIds: ids('bpo-') },
  { id: 'existing', label: 'Orrica Professional Collection', description: 'The original Orrica Edge templates, refreshed with varied accent systems and cleaner visual hierarchy.', templateIds: TEMPLATE_LIST.filter((template) => !/^fresher-|^photo-|^it-|^bpo-/.test(template.id)).map((template) => template.id) },
];

export { TEMPLATE_CATEGORIES };
