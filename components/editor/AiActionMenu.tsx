'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toaster';

export type ImproveAction =
  | 'rewrite'
  | 'make-professional'
  | 'make-concise'
  | 'ats-optimize'
  | 'generate-bullets'
  | 'make-ats-friendly'
  | 'shorten'
  | 'fix-grammar';

const ACTION_LABELS: Record<ImproveAction, string> = {
  rewrite: 'Rewrite',
  'make-professional': 'Make Professional',
  'make-concise': 'Make Concise',
  'ats-optimize': 'ATS Optimize',
  'generate-bullets': 'Generate Bullet Points',
  'make-ats-friendly': 'Make ATS Friendly',
  shorten: 'Shorten',
  'fix-grammar': 'Fix Grammar',
};

interface AiActionMenuProps {
  section: 'summary' | 'experience' | 'project';
  content: string;
  actions: ImproveAction[];
  targetRole?: string;
  context?: string;
  onApply: (improved: string) => void;
  disabled?: boolean;
}

export function AiActionMenu({
  section,
  content,
  actions,
  targetRole,
  context,
  onApply,
  disabled,
}: AiActionMenuProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<ImproveAction | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  async function run(action: ImproveAction) {
    if (!content.trim()) {
      toast({ title: 'Add some content first', description: 'Write a draft before asking AI to improve it.', variant: 'info' });
      return;
    }
    setMenuOpen(false);
    setActiveAction(action);
    setOpen(true);
    setLoading(true);
    setSuggestion(null);
    try {
      const res = await fetch('/api/ai/improve-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, content, action, targetRole, context }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'AI request failed');
      setSuggestion(json.improved);
    } catch (err) {
      toast({ title: 'AI is improving your resume... failed', description: (err as Error).message, variant: 'error' });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative inline-block">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={() => setMenuOpen((v) => !v)}
        className="text-primary border-primary/30"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Improve with AI
      </Button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute z-50 mt-1 w-56 rounded-lg border bg-white shadow-lg p-1">
            {actions.map((a) => (
              <button
                key={a}
                onClick={() => run(a)}
                className="w-full text-left text-sm px-3 py-2 rounded-md hover:bg-secondary flex items-center gap-2"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {ACTION_LABELS[a]}
              </button>
            ))}
          </div>
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>AI Suggested Improvement</DialogTitle>
          <DialogDescription>
            {activeAction ? ACTION_LABELS[activeAction] : ''} — review before applying to your resume.
          </DialogDescription>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p className="text-sm">AI is improving your resume...</p>
            </div>
          ) : (
            <div className="rounded-lg border bg-secondary/50 p-4 text-sm whitespace-pre-line max-h-72 overflow-y-auto">
              {suggestion}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-5">
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => activeAction && run(activeAction)} disabled={loading}>
              Try Again
            </Button>
            <Button
              onClick={() => {
                if (suggestion) {
                  onApply(suggestion);
                  setOpen(false);
                  toast({ title: 'Applied', description: 'AI suggestion added. You can undo from the section menu.', variant: 'success' });
                }
              }}
              disabled={loading || !suggestion}
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
