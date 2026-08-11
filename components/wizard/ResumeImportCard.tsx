'use client';

import { useRef, useState } from 'react';
import { Check, FileText, Loader2, Sparkles, UploadCloud } from 'lucide-react';
import { ResumeData } from '@/lib/types/resume';
import { toast } from '@/components/ui/toaster';

export function ResumeImportCard({ updateData }: { updateData: (updater: (data: ResumeData) => ResumeData) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);

  async function scan(file: File) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast({ title: 'PDF required', description: 'Please upload your existing resume as a PDF.', variant: 'error' });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: 'PDF is too large', description: 'Please use a PDF smaller than 8 MB.', variant: 'error' });
      return;
    }

    setScanning(true);
    setDone(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/resume/scan', { method: 'POST', body: formData });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Could not scan your resume.');

      updateData(() => json.data as ResumeData);
      setDone(true);
      toast({ title: 'Resume imported', description: 'Your existing resume has been mapped into the builder. Review every section before exporting.', variant: 'success' });
    } catch (error) {
      toast({ title: 'Scan failed', description: error instanceof Error ? error.message : 'Could not scan this resume.', variant: 'error' });
    } finally {
      setScanning(false);
    }
  }

  return (
    <section className="relative overflow-hidden rounded-[24px] border border-orange-200/70 bg-gradient-to-br from-orange-50 via-white to-neutral-50 p-5 shadow-[0_18px_55px_-35px_rgba(234,88,12,.35)] sm:p-6">
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-300/20 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-orange-400 shadow-sm"><Sparkles className="h-5 w-5" /></div>
          <div>
            <div className="flex items-center gap-2"><h2 className="text-sm font-black text-neutral-950">Already have a resume?</h2>{done && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700"><Check className="h-3 w-3" /> Imported</span>}</div>
            <p className="mt-1 max-w-xl text-xs leading-5 text-neutral-500">Upload your PDF and Orrica Edge will extract your details into the builder so you can edit, improve and redesign it instead of starting from zero.</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[9px] font-semibold text-neutral-400"><span>AI-assisted extraction</span><span>·</span><span>Up to 8 MB</span><span>·</span><span>PDF only</span></div>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => !scanning && inputRef.current?.click()}
          onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && !scanning) inputRef.current?.click(); }}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) void scan(file); }}
          className={`group flex min-h-[92px] min-w-[220px] cursor-pointer items-center justify-center rounded-2xl border border-dashed px-5 text-center transition-all ${dragging ? 'border-orange-500 bg-orange-100/80 scale-[1.01]' : 'border-neutral-300 bg-white/80 hover:border-orange-300 hover:bg-white'} ${scanning ? 'cursor-wait opacity-80' : ''}`}
        >
          {scanning ? <div><Loader2 className="mx-auto h-5 w-5 animate-spin text-orange-600" /><div className="mt-2 text-[11px] font-bold text-neutral-700">Scanning your resume…</div><div className="mt-0.5 text-[9px] text-neutral-400">Extracting experience, skills and education</div></div> : <div><UploadCloud className="mx-auto h-5 w-5 text-orange-600 transition-transform group-hover:-translate-y-0.5" /><div className="mt-2 text-[11px] font-black text-neutral-800">Upload PDF</div><div className="mt-0.5 text-[9px] text-neutral-400">or drag & drop here</div></div>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void scan(file); event.currentTarget.value = ''; }} />
      <div className="relative mt-4 flex items-center gap-2 rounded-xl border border-white/80 bg-white/70 px-3 py-2 text-[9px] leading-4 text-neutral-400"><FileText className="h-3.5 w-3.5 shrink-0 text-neutral-500" /> AI extracts information from the PDF; always review the imported content for accuracy before using it.</div>
    </section>
  );
}
