'use client';

import { useState } from 'react';
import { Plus, Trash2, Loader2, Sparkles, Undo2, GripVertical } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/toaster';
import { genId } from '@/lib/utils';
import { ExperienceEntry } from '@/lib/types/resume';
import { StepProps } from '../WizardShell';

function emptyExperience(): ExperienceEntry {
  return {
    id: genId(),
    company: '',
    jobTitle: '',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    responsibilities: '',
    achievements: [],
  };
}

function ExperienceCard({
  entry,
  onChange,
  onRemove,
  targetRole,
}: {
  entry: ExperienceEntry;
  onChange: (e: ExperienceEntry) => void;
  onRemove: () => void;
  targetRole?: string;
}) {
  const [generating, setGenerating] = useState(false);
  const [previousBullets, setPreviousBullets] = useState<string[] | null>(null);

  function set<K extends keyof ExperienceEntry>(key: K, value: ExperienceEntry[K]) {
    onChange({ ...entry, [key]: value });
  }

  async function generateBullets() {
    if (!entry.responsibilities.trim()) {
      toast({ title: 'Describe your responsibilities first', description: 'Add a few notes so AI has something to work from.', variant: 'info' });
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-bullets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: entry.jobTitle,
          company: entry.company,
          rawText: entry.responsibilities,
          targetRole,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to generate bullet points');
      setPreviousBullets(entry.achievements);
      set('achievements', json.bullets);
    } catch (err) {
      toast({ title: 'Could not generate bullet points', description: (err as Error).message, variant: 'error' });
    } finally {
      setGenerating(false);
    }
  }

  function undo() {
    if (previousBullets) {
      set('achievements', previousBullets);
      setPreviousBullets(null);
    }
  }

  function updateBullet(i: number, value: string) {
    const next = [...entry.achievements];
    next[i] = value;
    set('achievements', next);
  }

  function removeBullet(i: number) {
    set('achievements', entry.achievements.filter((_, idx) => idx !== i));
  }

  return (
    <div className="rounded-xl border bg-white p-4 sm:p-5 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <GripVertical className="h-4 w-4 text-neutral-300 mt-2.5 shrink-0" />
        <div className="grid sm:grid-cols-2 gap-3 flex-1">
          <div>
            <Label>Job Title</Label>
            <Input value={entry.jobTitle} onChange={(e) => set('jobTitle', e.target.value)} placeholder="Product Manager" />
          </div>
          <div>
            <Label>Company</Label>
            <Input value={entry.company} onChange={(e) => set('company', e.target.value)} placeholder="Acme Inc." />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={entry.location} onChange={(e) => set('location', e.target.value)} placeholder="Remote" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Start Date</Label>
              <Input type="month" value={entry.startDate} onChange={(e) => set('startDate', e.target.value)} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="month"
                value={entry.endDate}
                disabled={entry.currentlyWorking}
                onChange={(e) => set('endDate', e.target.value)}
              />
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onRemove} aria-label="Remove experience">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={entry.currentlyWorking} onCheckedChange={(v) => set('currentlyWorking', v)} id={`current-${entry.id}`} />
        <Label htmlFor={`current-${entry.id}`} className="mb-0">
          I currently work here
        </Label>
      </div>

      <div>
        <Label>Responsibilities (notes)</Label>
        <Textarea
          rows={4}
          placeholder="Describe what you did day-to-day — AI will turn this into strong bullet points."
          value={entry.responsibilities}
          onChange={(e) => set('responsibilities', e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={generateBullets} disabled={generating} className="text-primary border-primary/30">
          {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Generate Bullet Points
        </Button>
        {previousBullets && (
          <Button type="button" variant="ghost" size="sm" onClick={undo}>
            <Undo2 className="h-3.5 w-3.5" /> Undo
          </Button>
        )}
      </div>

      {entry.achievements.length > 0 && (
        <div className="space-y-2">
          <Label>Achievements</Label>
          {entry.achievements.map((b, i) => (
            <div key={i} className="flex gap-2">
              <Textarea rows={2} value={b} onChange={(e) => updateBullet(i, e.target.value)} className="flex-1" />
              <Button variant="ghost" size="icon" onClick={() => removeBullet(i)}>
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ExperienceStep({ data, updateData }: StepProps) {
  function addEntry() {
    updateData((d) => ({ ...d, experience: [...d.experience, emptyExperience()] }));
  }

  function updateEntry(id: string, next: ExperienceEntry) {
    updateData((d) => ({ ...d, experience: d.experience.map((e) => (e.id === id ? next : e)) }));
  }

  function removeEntry(id: string) {
    updateData((d) => ({ ...d, experience: d.experience.filter((e) => e.id !== id) }));
  }

  return (
    <div className="space-y-4">
      {data.experience.map((entry) => (
        <ExperienceCard
          key={entry.id}
          entry={entry}
          targetRole={data.targetRole}
          onChange={(e) => updateEntry(entry.id, e)}
          onRemove={() => removeEntry(entry.id)}
        />
      ))}
      <Button type="button" variant="outline" onClick={addEntry} className="w-full border-dashed">
        <Plus className="h-4 w-4" /> Add Work Experience
      </Button>
    </div>
  );
}
