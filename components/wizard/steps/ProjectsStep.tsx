'use client';

import { Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AiActionMenu } from '@/components/editor/AiActionMenu';
import { genId } from '@/lib/utils';
import { ProjectEntry } from '@/lib/types/resume';
import { StepProps } from '../WizardShell';

function emptyProject(): ProjectEntry {
  return { id: genId(), name: '', role: '', description: '', technologies: [], url: '' };
}

function TechInput({ items, onChange }: { items: string[]; onChange: (items: string[]) => void }) {
  const [draft, setDraft] = useState('');
  function add() {
    const v = draft.trim();
    if (v && !items.includes(v)) onChange([...items, v]);
    setDraft('');
  }
  return (
    <div>
      <Label>Technologies</Label>
      <div className="flex gap-2 mb-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder="React, Node.js, PostgreSQL…"
        />
        <Button type="button" variant="outline" onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
            {t}
            <button onClick={() => onChange(items.filter((i) => i !== t))}>
              <X className="h-3 w-3 text-neutral-500" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProjectsStep({ data, updateData }: StepProps) {
  function addEntry() {
    updateData((d) => ({ ...d, projects: [...d.projects, emptyProject()] }));
  }
  function updateEntry(id: string, patch: Partial<ProjectEntry>) {
    updateData((d) => ({ ...d, projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }
  function removeEntry(id: string) {
    updateData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));
  }

  return (
    <div className="space-y-4">
      {data.projects.map((entry) => (
        <div key={entry.id} className="rounded-xl border bg-white p-4 sm:p-5 space-y-3">
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => removeEntry(entry.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Project Name</Label>
              <Input value={entry.name} onChange={(e) => updateEntry(entry.id, { name: e.target.value })} placeholder="Internal Analytics Dashboard" />
            </div>
            <div>
              <Label>Your Role</Label>
              <Input value={entry.role} onChange={(e) => updateEntry(entry.id, { role: e.target.value })} placeholder="Lead Developer" />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea rows={3} value={entry.description} onChange={(e) => updateEntry(entry.id, { description: e.target.value })} />
            <div className="mt-2">
              <AiActionMenu
                section="project"
                content={entry.description}
                actions={['generate-bullets', 'make-professional', 'shorten', 'fix-grammar']}
                context={entry.name}
                onApply={(improved) => updateEntry(entry.id, { description: improved })}
              />
            </div>
          </div>
          <TechInput items={entry.technologies} onChange={(technologies) => updateEntry(entry.id, { technologies })} />
          <div>
            <Label>Project URL (optional)</Label>
            <Input value={entry.url} onChange={(e) => updateEntry(entry.id, { url: e.target.value })} placeholder="https://…" />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addEntry} className="w-full border-dashed">
        <Plus className="h-4 w-4" /> Add Project
      </Button>
    </div>
  );
}
