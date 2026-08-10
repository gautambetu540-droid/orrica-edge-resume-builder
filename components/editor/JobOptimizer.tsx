'use client';

import { useState } from 'react';
import { Loader2, Target, ChevronDown } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { ResumeData } from '@/lib/types/resume';

interface JobMatchResult {
  matchScore: number;
  missingKeywords: string[];
  skillsToHighlight: string[];
  sectionsToImprove: string[];
  recommendedChanges: string[];
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 75 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626';
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f1f1" strokeWidth="8" />
        <circle
          cx="40"
          cy="40"
          r="34"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold">{score}</span>
        <span className="text-[10px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

export function JobOptimizer({ data }: { data: ResumeData }) {
  const [open, setOpen] = useState(false);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);

  async function analyze() {
    if (jd.trim().length < 20) {
      toast({ title: 'Paste the full job description', description: 'Add more detail for an accurate match score.', variant: 'info' });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data, jobDescription: jd }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Analysis failed');
      setResult(json.result);
    } catch (err) {
      toast({ title: 'Could not analyze this job description', description: (err as Error).message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white">
      <button className="w-full flex items-center justify-between p-4" onClick={() => setOpen((v) => !v)}>
        <span className="flex items-center gap-2 font-medium text-sm">
          <Target className="h-4 w-4 text-primary" /> Optimize Resume for a Job
        </span>
        <ChevronDown className={`h-4 w-4 text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4">
          <Textarea rows={6} placeholder="Paste the full job description here…" value={jd} onChange={(e) => setJd(e.target.value)} />
          <Button onClick={analyze} disabled={loading} className="w-full sm:w-auto">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Analyze Match
          </Button>

          {result && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center gap-4">
                <ScoreRing score={result.matchScore} />
                <div>
                  <p className="font-semibold">ATS Match Score</p>
                  <p className="text-sm text-muted-foreground">
                    Based on keywords, skills, and requirements in the job description.
                  </p>
                </div>
              </div>

              <ResultList title="Missing Keywords" items={result.missingKeywords} tone="warn" />
              <ResultList title="Skills You May Want to Highlight" items={result.skillsToHighlight} tone="ok" />
              <ResultList title="Resume Sections to Improve" items={result.sectionsToImprove} tone="neutral" />
              <ResultList title="Recommended Changes" items={result.recommendedChanges} tone="neutral" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultList({ title, items, tone }: { title: string; items: string[]; tone: 'warn' | 'ok' | 'neutral' }) {
  if (!items?.length) return null;
  const chipClass =
    tone === 'warn' ? 'bg-amber-50 text-amber-700' : tone === 'ok' ? 'bg-green-50 text-green-700' : 'bg-secondary text-neutral-700';
  return (
    <div>
      <p className="text-sm font-medium mb-2">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span key={i} className={`text-xs px-2.5 py-1 rounded-full ${chipClass}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
