'use client';

import { useRef, useState } from 'react';
import { FileUp, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toaster';
import type { ResumeData } from '@/lib/types/resume';

export function ImportResumeCard({ onImported }: { onImported: (data: ResumeData) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function scan(file: File) {
    setScanning(true);
    setDone(false);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/resume/scan', { method: 'POST', body });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Could not scan the resume');
      onImported(json.data as ResumeData);
      setDone(true);
      toast({ title: 'Resume imported', description: 'Your old resume has been scanned and its details are now in the builder.', variant: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not scan the resume';
      setError(message);
      toast({ title: 'Resume scan failed', description: message, variant: 'error' });
    } finally {
      setScanning(false);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void scan(file);
    event.target.value = '';
  }

  return (
    <section className="mb-6 overflow-hidden rounded-3xl border border-orange-200/70 bg-gradient-to-br from-orange-50 via-white to-indigo-50 shadow-sm">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-orange-400 shadow-lg"><Sparkles className="h-5 w-5" /></div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold text-neutral-950">Already have a resume?</h2>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-orange-700">AI Import</span>
            </div>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-500">Upload your old PDF and we’ll scan the content, detect your sections and automatically fill the resume builder. Review everything before saving or exporting.</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-semibold text-neutral-500"><span className="rounded-full bg-white px-2.5 py-1 shadow-sm">Personal details</span><span className="rounded-full bg-white px-2.5 py-1 shadow-sm">Experience</span><span className="rounded-full bg-white px-2.5 py-1 shadow-sm">Education</span><span className="rounded-full bg-white px-2.5 py-1 shadow-sm">Skills</span><span className="rounded-full bg-white px-2.5 py-1 shadow-sm">Projects</span></div>
          </div>
        </div>
        <div className="shrink-0">
          <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={handleChange} />
          <Button type="button" onClick={() => inputRef.current?.click()} disabled={scanning} className="h-11 w-full rounded-xl px-5 font-bold sm:w-auto">
            {scanning ? <><Loader2 className="h-4 w-4 animate-spin" /> Scanning resume...</> : done ? <><CheckCircle2 className="h-4 w-4" /> Imported successfully</> : <><FileUp className="h-4 w-4" /> Scan old resume</>}
          </Button>
        </div>
      </div>
      {scanning && <div className="h-1 w-full overflow-hidden bg-orange-100"><div className="h-full w-1/3 animate-pulse rounded-full bg-orange-500" /></div>}
      {error && <div className="flex items-start gap-2 border-t border-red-100 bg-red-50 px-5 py-3 text-[11px] leading-5 text-red-700"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{error}</div>}
    </section>
  );
}
