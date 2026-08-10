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
    <div className="grid sm:grid-cols-2 gap-4">
      {FIELDS.map((f) => (
        <div key={f.key} className={f.key === 'fullName' || f.key === 'professionalTitle' ? 'sm:col-span-2' : ''}>
          <Label htmlFor={f.key}>
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
          />
        </div>
      ))}
    </div>
  );
}
