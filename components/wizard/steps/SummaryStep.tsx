'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Undo2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { AiActionMenu } from '@/components/editor/AiActionMenu';
import { StepProps } from '../WizardShell';

export function SummaryStep({ data, updateData }: StepProps) {
  const [generating, setGenerating] = useState(false);
  const [previous, setPrevious] = useState<string | null>(null);

  function setSummary(value: string) {
    updateData((d) => ({ ...d, summary: value }));
  }

  async function generate() {
    if (!data.experience.length && !data.education.length) {
      toast({
        title: 'Add experience or education first',
        description: 'AI needs at least one entry to write an accurate summary.',
        variant: 'info',
      });
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalInfo: data.personalInfo,
          experience: data.experience,
          education: data.education,
          skills: data.skills,
          targetRole: data.targetRole,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to generate summary');
      setPrevious(data.summary);
      setSummary(json.summary);
    } catch (err) {
      toast({ title: 'Could not generate summary', description: (err as Error).message, variant: 'error' });
    } finally {
      setGenerating(false);
    }
  }

  function undo() {
    if (previous !== null) {
      setSummary(previous);
      setPrevious(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={generate} disabled={generating} variant="outline" className="text-primary border-primary/30">
          {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          Generate with AI
        </Button>
        <AiActionMenu
          section="summary"
          content={data.summary}
          actions={['rewrite', 'make-professional', 'make-concise', 'ats-optimize']}
          targetRole={data.targetRole}
          onApply={(improved) => {
            setPrevious(data.summary);
            setSummary(improved);
          }}
        />
        {previous !== null && (
          <Button type="button" variant="ghost" size="sm" onClick={undo}>
            <Undo2 className="h-3.5 w-3.5" /> Undo
          </Button>
        )}
      </div>
      <Textarea
        rows={7}
        placeholder="A 3-4 sentence summary highlighting your experience, strengths, and career focus…"
        value={data.summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <p className="text-xs text-muted-foreground">
        AI only writes from information you've entered — it never invents experience.
      </p>
    </div>
  );
}
