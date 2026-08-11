'use client';

import { useRef, useState } from 'react';
import { Check, FileSearch, FileText, LockKeyhole, Loader2, Sparkles, UploadCloud, WandSparkles } from 'lucide-react';
import { ResumeData } from '@/lib/types/resume';
import { toast } from '@/components/ui/toaster';

export function ResumeImportCard({ updateData }: { updateData: (updater: (data: ResumeData) => ResumeData) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const [fileName, setFileName] = useState('');

  async function scan(file: File) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast({ title: 'PDF required', description: 'Please upload your existing resume as a PDF.', variant: 'error' });
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: 'PDF is too large', description: 'Please use a PDF smaller than 8 MB.', variant: 'error' });
      return;
    }

    setFileName(file.name);
    setScanning(true);
    setDone(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/resume/scan', {
        method: 'POST',
        body: formData,
        cache: 'no-store',
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Could not scan your resume.');

      // Only extracted ResumeData is passed into the editor. The uploaded File is
      // never written to the database or a storage bucket by this client flow.
      updateData(() => json.data as ResumeData);
      setDone(true);
      toast({ title: 'Resume imported', description: 'Your resume data is ready. Review every section before exporting.', variant: 'success' });
    } catch (error) {
      setDone(false);
      toast({ title: 'Scan failed', description: error instanceof Error ? error.message : 'Could not scan this resume.', variant: 'error' });
    } finally {
      setScanning(false);
    }
  }

  const chooseFile = () => {
    if (!scanning) inputRef.current?.click();
  };

  return (
    <section className="relative isolate overflow-hidden rounded-[32px] border border-neutral-200/80 bg-[#0b0b0d] text-white shadow-[0_30px_100px_-45px_rgba(0,0,0,.75)]">
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />

      <div className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
          <div className="flex-1 lg:max-w-[52%]">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-300">
              <Sparkles className="h-3.5 w-3.5" /> AI Resume Import
            </div>

            <h2 className="mt-5 max-w-xl text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
              Your old resume.<br />
              <span className="bg-gradient-to-r from-orange-300 via-amber-200 to-white bg-clip-text text-transparent">A smarter starting point.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-400 sm:text-[15px]">
              Drop in your existing PDF and Orrica Edge extracts the useful details into your new resume. No retyping. No starting over.
            </p>

            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: FileSearch, title: 'Extract', text: 'Experience, education & skills' },
                { icon: WandSparkles, title: 'Refine', text: 'Edit and improve every section' },
                { icon: LockKeyhole, title: 'Private', text: 'PDF is not stored in your account' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
                  <Icon className="h-4 w-4 text-orange-300" />
                  <div className="mt-3 text-xs font-bold text-white">{title}</div>
                  <div className="mt-1 text-[10px] leading-4 text-neutral-500">{text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-1 items-center lg:justify-end">
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload your resume PDF"
              onClick={chooseFile}
              onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && !scanning) chooseFile(); }}
              onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files[0]; if (file) void scan(file); }}
              className={`group relative flex min-h-[270px] w-full max-w-[430px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[28px] border px-6 text-center transition-all duration-500 ${dragging ? 'scale-[1.015] border-orange-300 bg-orange-500/10 shadow-[0_0_70px_-25px_rgba(251,146,60,.8)]' : 'border-dashed border-white/15 bg-white/[0.035] hover:border-orange-300/50 hover:bg-orange-500/[0.055]'} ${scanning ? 'cursor-wait' : ''}`}
            >
              <div className="absolute inset-3 rounded-[22px] border border-white/[0.045]" />
              <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-300/20 bg-orange-400/10 text-orange-300 shadow-[0_0_45px_-15px_rgba(251,146,60,.8)] transition-all duration-500 ${dragging ? 'scale-110 rotate-2' : 'group-hover:-translate-y-1 group-hover:scale-105'}`}>
                {scanning ? <Loader2 className="h-7 w-7 animate-spin" /> : done ? <Check className="h-7 w-7 animate-in zoom-in duration-300" /> : <UploadCloud className="h-7 w-7" />}
              </div>

              {scanning ? (
                <>
                  <div className="relative mt-5 text-sm font-bold">Reading your resume…</div>
                  <div className="relative mt-2 max-w-xs text-[11px] leading-5 text-neutral-500">Extracting experience, education, skills and contact details</div>
                  <div className="relative mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-orange-400 to-amber-200" /></div>
                </>
              ) : done ? (
                <>
                  <div className="relative mt-5 text-sm font-bold text-emerald-300">Resume imported successfully</div>
                  <div className="relative mt-2 max-w-xs truncate text-[11px] text-neutral-500">{fileName}</div>
                  <div className="relative mt-5 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-300">Your extracted data is ready to review</div>
                </>
              ) : (
                <>
                  <div className="relative mt-5 text-sm font-bold">Drop your PDF here</div>
                  <div className="relative mt-1 text-[11px] text-neutral-500">or click to browse your device</div>
                  <div className="relative mt-5 flex items-center gap-2 text-[10px] font-semibold text-neutral-600"><FileText className="h-3.5 w-3.5" /> PDF only · up to 8 MB</div>
                </>
              )}
            </div>
          </div>
        </div>

        <input ref={inputRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void scan(file); event.currentTarget.value = ''; }} />

        <div className="mt-7 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3.5 text-[10px] leading-5 text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /><span><strong className="text-neutral-300">Privacy first.</strong> We process the uploaded PDF to extract resume information; the original PDF is not saved to your Orrica Edge account or storage.</span></div>
          <span className="shrink-0 font-semibold text-neutral-600">You stay in control</span>
        </div>
      </div>
    </section>
  );
}
