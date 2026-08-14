export type BuilderFeatureKey =
  | 'onboarding'
  | 'resumeImport'
  | 'templates'
  | 'aiTools'
  | 'jobOptimizer'
  | 'autosave'
  | 'pdfExport'
  | 'print'
  | 'finalize';

export type BuilderFeatureConfig = Record<BuilderFeatureKey, boolean>;

export const BUILDER_FEATURES: BuilderFeatureConfig = {
  onboarding: true,
  resumeImport: true,
  templates: true,
  aiTools: true,
  jobOptimizer: true,
  autosave: true,
  pdfExport: true,
  print: true,
  finalize: true,
};

export const BUILDER_STEPS = [
  { key: 'personal', label: 'Personal info', hint: 'Contact details' },
  { key: 'summary', label: 'Summary', hint: 'Your professional story' },
  { key: 'experience', label: 'Experience', hint: 'Work history' },
  { key: 'education', label: 'Education', hint: 'Degrees & study' },
  { key: 'skills', label: 'Skills', hint: 'What you do best' },
  { key: 'projects', label: 'Projects', hint: 'Selected work' },
  { key: 'more', label: 'More', hint: 'Additional sections' },
  { key: 'finalize', label: 'Finalize', hint: 'Review & download' },
] as const;

export type BuilderStepKey = (typeof BUILDER_STEPS)[number]['key'];

export function getBuilderStepStorageKey(resumeId: string) {
  return `orrica-edge:builder-step:${resumeId}`;
}

export function readBuilderStep(resumeId: string): BuilderStepKey {
  if (typeof window === 'undefined') return 'personal';
  const value = window.sessionStorage.getItem(getBuilderStepStorageKey(resumeId));
  return BUILDER_STEPS.some((step) => step.key === value)
    ? (value as BuilderStepKey)
    : 'personal';
}

export function saveBuilderStep(resumeId: string, step: BuilderStepKey) {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(getBuilderStepStorageKey(resumeId), step);
}
