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
  { key: 'linkedin', label: 'LinkedIn (optional)', placeholder: 'linkedin.com/in/janedoe' },
  { key: 'portfolio', label: 'Portfolio (optional)', placeholder: 'janedoe.com' },
  { key: 'github', label: 'GitHub (optional)', placeholder: 'github.com/janedoe' },
];

export function PersonalStep({ data, updateData }: StepProps) {
  const info = data.personalInfo;

  function set(key: keyof typeof info, value: string) {
    updateData((d) => ({ ...d, personalInfo: { ...d.personalInfo, [key]: value } }));
  }

  return (
    <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-4">
      {FIELDS.map((f) => (
        <div key={f.key} className={`min-w-0 ${f.key === 'fullName' || f.key === 'professionalTitle' ? 'sm:col-span-2' : ''}`}>
          <Label htmlFor={f.key} className="mb-1.5 text-[13px] font-semibold leading-5 text-neutral-800 sm:mb-2 sm:text-sm">
            {f.label}
            {f.required && <span className="text-destructive"> *</span>}
          </Label>
          <Input
            id={f.key}
            type={f.type ?? 'text'}
            required={f.required}
            placeholder={f.placeholder}
            value={info[f.key] ?? ''}
            onChange={(e) => set(f.key, e.target.value)}
            className="h-11 rounded-xl px-3.5 text-[14px] shadow-[0_1px_0_rgba(15,23,42,.02)] placeholder:text-[13px] sm:h-11 sm:text-sm"
          />
        </div>
      ))}
    </div>
  );
}
