'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { genId } from '@/lib/utils';
import { EducationEntry } from '@/lib/types/resume';
import { StepProps } from '../WizardShell';

function emptyEducation(): EducationEntry {
  return { id: genId(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '', description: '' };
}

export function EducationStep({ data, updateData }: StepProps) {
  function addEntry() {
    updateData((d) => ({ ...d, education: [...d.education, emptyEducation()] }));
  }
  function updateEntry(id: string, patch: Partial<EducationEntry>) {
    updateData((d) => ({ ...d, education: d.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  }
  function removeEntry(id: string) {
    updateData((d) => ({ ...d, education: d.education.filter((e) => e.id !== id) }));
  }

  return (
    <div className="space-y-4">
      {data.education.map((entry) => (
        <div key={entry.id} className="rounded-xl border bg-white p-4 sm:p-5 space-y-3">
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => removeEntry(entry.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Institution</Label>
              <Input value={entry.institution} onChange={(e) => updateEntry(entry.id, { institution: e.target.value })} placeholder="Stanford University" />
            </div>
            <div>
              <Label>Degree</Label>
              <Input value={entry.degree} onChange={(e) => updateEntry(entry.id, { degree: e.target.value })} placeholder="B.S." />
            </div>
            <div>
              <Label>Field of Study</Label>
              <Input value={entry.fieldOfStudy} onChange={(e) => updateEntry(entry.id, { fieldOfStudy: e.target.value })} placeholder="Computer Science" />
            </div>
            <div>
              <Label>Grade / GPA</Label>
              <Input value={entry.grade} onChange={(e) => updateEntry(entry.id, { grade: e.target.value })} placeholder="3.8 / 4.0" />
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="month" value={entry.startDate} onChange={(e) => updateEntry(entry.id, { startDate: e.target.value })} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="month" value={entry.endDate} onChange={(e) => updateEntry(entry.id, { endDate: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea rows={3} value={entry.description} onChange={(e) => updateEntry(entry.id, { description: e.target.value })} />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addEntry} className="w-full border-dashed">
        <Plus className="h-4 w-4" /> Add Education
      </Button>
    </div>
  );
}
