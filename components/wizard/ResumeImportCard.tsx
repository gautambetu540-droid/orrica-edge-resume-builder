'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Check, FileSearch, LayoutTemplate, LockKeyhole, Loader2, Sparkles, UploadCloud } from 'lucide-react';
import { ResumeData } from '@/lib/types/resume';
import { toast } from '@/components/ui/toaster';

export function ResumeImportCard({ updateData }: { updateData: (updater: (data: ResumeData) => ResumeData) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [fileName, setFileName] = useState('');

  async function scan(file: File) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) { toast({ title: 'PDF required', description: 'Please upload your existing resume as a PDF.', variant: 'error' }); return; }
    if (file.size > 8 * 1024 * 1024) { toast({ title: 'PDF is too large', description: 'Please use a PDF smaller than 8 MB.', variant: 'error' }); return; }
    setFileName(file.name); setScanning(true); setDone(false);
    try {
      const formData = new FormData(); formData.append('file', file);
      const response = await fetch('/api/resume/scan', { method: 'POST', body: formData, cache: 'no-store', credentials: 'include' });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Could not scan your resume.');
      updateData(() => json.data as ResumeData); setDone(true);
      toast({ title: 'Resume imported', description: 'Only extracted resume data was loaded into the builder. The uploaded PDF is not saved.', variant: 'success' });
    } catch (error) { setDone(false); toast({ title: 'Scan failed', description: error instanceof Error ? error.message : 'Could not scan this resume.', variant: 'error' }); }
    finally { setScanning(false); }
  }
  const chooseFile = () => { if (!scanning) inputRef.current?.click(); };

  return (
    <section className="oe-glass oe-3d-card relative isolate overflow-hidden rounded-[22px] sm:rounded-[26px]">
      <div className="oe-glow-orb orange pointer-events-none -right-16 -top-24 h-48 w-48" />
      <div className="relative flex flex-col gap-3 p-3.5 sm:gap-4 sm:p-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-neutral-950 text-orange-300 shadow-lg shadow-neutral-950/10 sm:h-11 sm:w-11 sm:rounded-2xl"><Sparkles className="h-4.5 w-4.5 sm:h-5 sm:w-5" /></div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2"><h2 className="text-[14px] font-extrabold tracking-[-0.02em] text-neutral-950 sm:text-sm">Start faster</h2><span className="inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-bold text-orange-700">SCAN & BUILD</span>{done && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700"><Check className="h-3 w-3" /> Ready</span>}</div>
            <p className="mt-1 text-[11px] leading-[1.45] text-neutral-500 sm:text-[11px]">Import your existing PDF or pick a template first. Your uploaded PDF is processed for extraction and is not stored as a file.</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[9px] font-semibold text-neutral-400 sm:gap-3"><span className="inline-flex items-center gap-1"><FileSearch className="h-3 w-3" /> Extract details</span><span className="inline-flex items-center gap-1"><LockKeyhole className="h-3 w-3" /> No PDF storage</span><Link href="/templates" className="inline-flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700"><LayoutTemplate className="h-3 w-3" /> Browse templates</Link></div>
          </div>
        </div>
        <div role="button" tabIndex={0} aria-label="Upload resume PDF" onClick={chooseFile} onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && !scanning) chooseFile(); }} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) void scan(file); }} className={`group flex min-h-[70px] w-full shrink-0 cursor-pointer items-center gap-3 rounded-[18px] border border-dashed px-3.5 py-2.5 transition-all duration-300 sm:h-[76px] sm:px-4 lg:w-[285px] ${dragging ? 'scale-[1.01] border-orange-400 bg-orange-50 shadow-[0_12px_35px_-20px_rgba(234,88,12,.6)]' : 'border-neutral-300/90 bg-white/55 hover:border-orange-300 hover:bg-orange-50/55'} ${scanning ? 'cursor-wait' : ''}`}>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm ring-1 ring-neutral-200 transition-transform duration-300 ${dragging ? 'scale-105 rotate-2' : 'group-hover:-translate-y-0.5'}`}>{scanning ? <Loader2 className="h-5 w-5 animate-spin" /> : done ? <Check className="h-5 w-5 text-emerald-600" /> : <UploadCloud className="h-5 w-5" />}</div>
          <div className="min-w-0 flex-1 text-left"><div className="truncate text-[11px] font-extrabold text-neutral-800 sm:text-xs">{scanning ? 'Scanning resume…' : done ? 'Resume imported' : 'Upload PDF'}</div><div className="mt-0.5 truncate text-[9px] leading-4 text-neutral-400 sm:text-[10px]">{scanning ? 'Extracting your details' : done ? fileName : 'Drag & drop or browse · Max 8 MB'}</div></div>
          {!scanning && !done && <span className="oe-3d-button shrink-0 rounded-lg bg-neutral-950 px-3 py-2 text-[9px] font-bold text-white sm:px-3.5">Choose</span>}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void scan(file); event.currentTarget.value = ''; }} />
    </section>
  );
}
