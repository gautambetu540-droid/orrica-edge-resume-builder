import { ResumeData } from './types/resume';

export interface ResumeProgress {
  percent: number;
  completed: string[];
  next: string;
  status: 'Not started' | 'In progress' | 'Ready';
}

export function getResumeProgress(data?: Partial<ResumeData> | null): ResumeProgress {
  const d = data || {};
  const personal = d.personalInfo || {};
  const completed: string[] = [];

  if (personal.fullName?.trim() && personal.email?.trim() && personal.phone?.trim()) completed.push('Personal');
  if (d.summary?.trim()) completed.push('Summary');
  if (d.experience?.length) completed.push('Experience');
  if (d.education?.length) completed.push('Education');
  if (d.skills?.some((s) => s.items?.length)) completed.push('Skills');
  if (d.projects?.length) completed.push('Projects');
  if (d.certifications?.length || d.languages?.length || d.achievements?.length) completed.push('More');

  const weights: Record<string, number> = {
    Personal: 25,
    Summary: 15,
    Experience: 15,
    Education: 10,
    Skills: 15,
    Projects: 10,
    More: 10,
  };
  const percent = Math.min(100, completed.reduce((sum, key) => sum + weights[key], 0));
  const order = Object.keys(weights);
  const next = order.find((key) => !completed.includes(key)) || 'Finish & download';
  const status = percent === 0 ? 'Not started' : percent >= 90 ? 'Ready' : 'In progress';
  return { percent, completed, next, status };
}
