'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { StepProps } from '../WizardShell';

const FIELDS: { key: keyof StepProps['data']['personalInfo']; label: string; placeholder: string; type?: string; required?: boolean }[] = [
  { key: 'fullName', label: 'Full Name', placeholder: 'Jane Doe', required: true },
  { key: 'professionalTitle', label: 'Professional Title', placeholder: 'Senior Product Designer' },
  { key: 'email', label: 'Email', placeholder: 'jane@example.com', type: 'email', required: true },
  { key: 'phone', label: 'Phone', placeholder: '+1 555 123 4567', type: 'tel', required: true },
  { key: 'city', label: 'City', placeholder: 'San Francisco' },
  { key: 'country', label: 'Country', placeholder: 'United States' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/janedoe' },
  { key: 'portfolio', label: 'Portfolio', placeholder: 'janedoe.com' },
  { key: 'github', label: 'GitHub', placeholder: 'github.com/janedoe' },
];

export function PersonalStep({ data, updateData }: StepProps) {
  const info = data.personalInfo;

  function set(key: keyof typeof info, value: string) {
    updateData((d) => ({ ...d, personalInfo: { ...d.personalInfo, [key]: value } }));
  }

  return (
    <div className="oe-personal-form grid gap-4 sm:grid-cols-2 sm:gap-4">
      {FIELDS.map((f) => (
        <div key={f.key} className={`min-w-0 ${f.key === 'fullName' || f.key === 'professionalTitle' ? 'sm:col-span-2' : ''}`}>
          <Label htmlFor={f.key} className="mb-1.5 block text-[11px] font-bold leading-4 text-neutral-700 sm:mb-2 sm:text-xs">
            {f.label}
            {f.required && <span className="ml-0.5 text-orange-600">*</span>}
          </Label>
          <Input
            id={f.key}
            type={f.type ?? 'text'}
            required={f.required}
            placeholder={f.placeholder}
            value={info[f.key] ?? ''}
            onChange={(e) => set(f.key, e.target.value)}
            className="h-11 rounded-[13px] border-neutral-200 bg-white px-3.5 text-[14px] font-medium text-neutral-900 shadow-[0_1px_0_rgba(15,23,42,.02)] transition-colors placeholder:text-[13px] placeholder:font-normal placeholder:text-neutral-400 focus-visible:border-orange-300 focus-visible:ring-orange-500/15 sm:h-11 sm:text-sm"
          />
        </div>
      ))}
    </div>
  );
}
