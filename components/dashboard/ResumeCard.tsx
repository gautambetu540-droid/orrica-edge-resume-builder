'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Pencil, Copy, Trash2, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import { useDownloadPdf } from '@/components/editor/DownloadButton';
import { SampleResumeCard } from '@/components/landing/SampleResumeCard';
import { TEMPLATE_PRESETS } from '@/lib/templates/presets';
import { ResumeData, TemplateId } from '@/lib/types/resume';
import { getResumeProgress } from '@/lib/resume-progress';

export interface ResumeCardData {
  id: string;
  title: string;
  template: TemplateId;
  updated_at: string;
  resume_data: ResumeData;
}

function formatRelative(dateStr: string) {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function ResumeCard({ resume, onDeleted }: { resume: ResumeCardData; onDeleted: (id: string) => void }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { download, downloading } = useDownloadPdf(resume.id, `${(resume.resume_data?.personalInfo?.fullName || resume.title).replace(/\s+/g, '_')}_Resume.pdf`);
  const preset = TEMPLATE_PRESETS[resume.template];
  const progress = getResumeProgress(resume.resume_data);

  async function handleDuplicate() {
    setDuplicating(true);
    try {
      const res = await fetch(`/api/resume/${resume.id}/duplicate`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Could not duplicate');
      router.refresh();
      toast({ title: 'Resume duplicated', variant: 'success' });
    } catch (err) {
      toast({ title: 'Could not duplicate resume', description: (err as Error).message, variant: 'error' });
    } finally {
      setDuplicating(false);
      setMenuOpen(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete "${resume.title}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/resume/${resume.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Could not delete');
      onDeleted(resume.id);
      toast({ title: 'Resume deleted', variant: 'success' });
    } catch (err) {
      toast({ title: 'Could not delete resume', description: (err as Error).message, variant: 'error' });
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white overflow-hidden group relative">
      <Link href={`/resume/${resume.id}`} className="block">
        <div className="aspect-[3/4] bg-neutral-50 relative overflow-hidden">
          <SampleResumeCard accent={preset.defaultAccentColor} layout={preset.layout} compact />
        </div>
      </Link>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{resume.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {preset.name} · Edited {formatRelative(resume.updated_at)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${progress.percent}%` }} /></div>
              <span className="text-[10px] font-semibold text-muted-foreground">{progress.percent}%</span>
            </div>
          </div>
          <div className="relative shrink-0">
            <button onClick={() => setMenuOpen((v) => !v)} className="p-1.5 rounded-md hover:bg-secondary">
              <MoreVertical className="h-4 w-4 text-neutral-500" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-50 mt-1 w-44 rounded-lg border bg-white shadow-lg p-1">
                  <Link href={`/resume/${resume.id}`} className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      download();
                    }}
                    disabled={downloading}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary text-left"
                  >
                    {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />} Download
                  </button>
                  <button onClick={handleDuplicate} disabled={duplicating} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary text-left">
                    {duplicating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Copy className="h-3.5 w-3.5" />} Duplicate
                  </button>
                  <button onClick={handleDelete} disabled={deleting} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-red-50 text-destructive text-left">
                    {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
