'use client';

import { useState } from 'react';
import { X, Loader2, Sparkles, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { SkillCategory } from '@/lib/types/resume';
import { StepProps } from '../WizardShell';

const CATEGORY_LABEL: Record<SkillCategory['category'], string> = {
  technical: 'Technical Skills',
  soft: 'Soft Skills',
  tools: 'Tools',
  languages: 'Languages',
};

function CategoryEditor({
  category,
  items,
  onAdd,
  onRemove,
}: {
  category: SkillCategory['category'];
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
}) {
  const [draft, setDraft] = useState('');

  function submit() {
    const value = draft.trim();
    if (value && !items.includes(value)) onAdd(value);
    setDraft('');
  }

  return (
    <div>
      <Label>{CATEGORY_LABEL[category]}</Label>
      <div className="flex gap-2 mb-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={`Add a ${CATEGORY_LABEL[category].toLowerCase()} and press Enter`}
        />
        <Button type="button" variant="outline" onClick={submit}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm">
            {item}
            <button onClick={() => onRemove(item)} aria-label={`Remove ${item}`}>
              <X className="h-3 w-3 text-neutral-500" />
            </button>
          </span>
        ))}
        {items.length === 0 && <p className="text-xs text-muted-foreground">No skills added yet.</p>}
      </div>
    </div>
  );
}

export function SkillsStep({ data, updateData }: StepProps) {
  const [suggesting, setSuggesting] = useState(false);

  function getCategory(cat: SkillCategory['category']) {
    return data.skills.find((s) => s.category === cat)?.items ?? [];
  }

  function addSkill(cat: SkillCategory['category'], value: string) {
    updateData((d) => ({
      ...d,
      skills: d.skills.map((s) => (s.category === cat ? { ...s, items: [...s.items, value] } : s)),
    }));
  }

  function removeSkill(cat: SkillCategory['category'], value: string) {
    updateData((d) => ({
      ...d,
      skills: d.skills.map((s) => (s.category === cat ? { ...s, items: s.items.filter((i) => i !== value) } : s)),
    }));
  }

  async function suggestSkills() {
    if (!data.experience.length && !data.projects.length) {
      toast({ title: 'Add experience or projects first', description: 'Suggestions are grounded in your actual background.', variant: 'info' });
      return;
    }
    setSuggesting(true);
    try {
      const existing = data.skills.flatMap((s) => s.items);
      const res = await fetch('/api/ai/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experience: data.experience,
          projects: data.projects,
          education: data.education,
          existingSkills: existing,
          targetRole: data.targetRole,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to suggest skills');
      const { technical = [], soft = [], tools = [] } = json.result ?? {};
      updateData((d) => ({
        ...d,
        skills: d.skills.map((s) => {
          if (s.category === 'technical') return { ...s, items: [...new Set([...s.items, ...technical])] };
          if (s.category === 'soft') return { ...s, items: [...new Set([...s.items, ...soft])] };
          if (s.category === 'tools') return { ...s, items: [...new Set([...s.items, ...tools])] };
          return s;
        }),
      }));
      toast({ title: 'Skills suggested', description: 'Review and remove anything that isn\u2019t accurate.', variant: 'success' });
    } catch (err) {
      toast({ title: 'Could not suggest skills', description: (err as Error).message, variant: 'error' });
    } finally {
      setSuggesting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Button type="button" variant="outline" onClick={suggestSkills} disabled={suggesting} className="text-primary border-primary/30">
        {suggesting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
        Suggest Relevant Skills
      </Button>
      {(['technical', 'soft', 'tools', 'languages'] as const).map((cat) => (
        <CategoryEditor
          key={cat}
          category={cat}
          items={getCategory(cat)}
          onAdd={(v) => addSkill(cat, v)}
          onRemove={(v) => removeSkill(cat, v)}
        />
      ))}
      <p className="text-xs text-muted-foreground">
        AI-suggested skills are based only on what you've entered — never claim a skill you don't have.
      </p>
    </div>
  );
}
