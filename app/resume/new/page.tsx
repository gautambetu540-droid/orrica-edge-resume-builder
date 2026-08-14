'use client';

import { DragEvent, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, FilePlus2, FileUp, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OrricaResumeWizard } from '@/components/wizard/OrricaResumeWizard';
import { useDraftResume } from '@/lib/hooks/useDraftResume';
import { createClient } from '@/lib/supabase/client';
import { EMPTY_RESUME_DATA } from '@/lib/types/resume';
import { toast } from '@/components/ui/toaster';

function UploadIllustration() {
  return (
    <svg viewBox="0 0 520 300" className="h-48 w-full sm:h-56" role="img" aria-label="Upload an existing resume illustration">
      <rect x="5" y="5" width="510" height="290" rx="30" fill="#fffaf7" />
      <circle cx="96" cy="70" r="30" fill="#fff0e6" />
      <circle cx="430" cy="235" r="42" fill="#fff0e6" />
      <path d="M164 47h165l58 58v145H164z" fill="#fff" stroke="#f47c3c" strokeWidth="5" />
      <path d="M329 47v60h58" fill="#ffe1cf" stroke="#f47c3c" strokeWidth="5" strokeLinejoin="round" />
      <rect x="198" y="129" width="145" height="9" rx="4.5" fill="#eceef1" />
      <rect x="198" y="151" width="110" height="9" rx="4.5" fill="#eceef1" />
      <rect x="198" y="173" width="134" height="9" rx="4.5" fill="#eceef1" />
      <circle cx="274" cy="103" r="24" fill="#f47c3c" />
      <path d="M274 116V87m0 0-12 12m12-12 12 12" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="120" cy="220" r="42" fill="#fff" stroke="#230939" strokeWidth="4" />
      <path d="M120 242v-30m0 0-10 10m10-10 10 10" fill="none" stroke="#f47c3c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M96 253h48" stroke="#230939" strokeWidth="4" strokeLinecap="round" />
      <path d="M405 55l4 10 10 4-10 4-4 10-4-10-10-4 10-4 4-10Z" fill="#f47c3c" opacity=".55" />
    </svg>
  );
}

function ScratchIllustration() {
  return (
    <svg viewBox="0 0 520 300" className="h-48 w-full sm:h-56" role="img" aria-label="Start a resume from scratch illustration">
      <rect x="5" y="5" width="510" height="290" rx="30" fill="#f9fbff" />
      <circle cx="92" cy="78" r="30" fill="#edf3ff" />
      <circle cx="426" cy="218" r="40" fill="#eef4ff" />
      <rect x="154" y="44" width="212" height="212" rx="14" fill="#fff" stroke="#230939" strokeWidth="5" />
      <rect x="188" y="80" width="115" height="12" rx="6" fill="#e6e7eb" />
      <rect x="188" y="108" width="147" height="9" rx="4.5" fill="#f0f0f0" />
      <rect x="188" y="130" width="129" height="9" rx="4.5" fill="#f0f0f0" />
      <rect x="188" y="152" width="142" height="9" rx="4.5" fill="#f0f0f0" />
      <circle cx="340" cy="210" r="39" fill="#f47c3c" />
      <path d="M340 189v42M319 210h42" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
      <circle cx="105" cy="96" r="22" fill="#fff1e8" />
      <path d="M105 83v26M92 96h26" stroke="#f47c3c" strokeWidth="5" strokeLinecap="round" />
      <circle cx="406" cy="82" r="16" fill="#fff1e8" />
      <path d="m401 82 4 4 8-9" fill="none" stroke="#f47c3c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M76 225c28 16 44 16 62 4" fill="none" stroke="#8eb1f2" strokeWidth="3" strokeLinecap="round" strokeDasharray="7 8" />
    </svg>
  );
}

function HeroDecor() {
  return (
    <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 1100 330" fill="none" aria-hidden="true">
      <path d="M72 218c38-18 56-56 28-91-21-26-8-55 20-73" stroke="#f7b28e" strokeWidth="2" strokeDasharray="7 9" />
      <path d="M102 54l-12 18 22-6-10 20 28-26-18 3 7-19-17 10Z" fill="#ffeadf" stroke="#f47c3c" strokeWidth="2" />
      <path d="M1020 72c-35 16-52 47-30 76 20 27 9 59-17 78" stroke="#f7b28e" strokeWidth="2" strokeDasharray="7 9" />
      <path d="M1002 60l5 12 12 5-12 5-5 12-5-12-12-5 12-5 5-12Z" fill="#fff0e6" stroke="#f47c3c" strokeWidth="2" />
      <rect x="890" y="160" width="118" height="82" rx="10" fill="#fff" stroke="#e9d9d1" strokeWidth="2" transform="rotate(7 890 160)" />
      <path d="M910 183h70M910 199h55M910 215h63" stroke="#d9dde4" strokeWidth="5" strokeLinecap="round" transform="rotate(7 890 160)" />
      <circle cx="1000" cy="231" r="19" fill="#f47c3c" />
      <path d="m992 231 6 6 11-13" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ResumeStartScreen({ onContinue }: { onContinue: (mode: 'upload' | 'scratch') => void }) {
  const [selected, setSelected] = useState<'upload' | 'scratch' | null>(null);

  return (
    <div className="oe-start min-h-dvh bg-white text-[#000]">
      <header className="flex h-[72px] items-center justify-center border-b border-[#f0f0f0] bg-white px-5 sm:h-[76px]">
        <a href="/" aria-label="Orrica Edge home" className="inline-flex items-center justify-center">
          <img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[32px] w-auto sm:h-[36px]" />
        </a>
      </header>

      <main className="relative mx-auto max-w-6xl overflow-hidden px-4 py-10 sm:px-8 sm:py-14">
        <section className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-[#f3e4dc] bg-[linear-gradient(135deg,#fff_0%,#fffaf7_52%,#f8fbff_100%)] px-5 py-10 text-center shadow-[0_24px_70px_-48px_rgba(35,9,57,.28)] sm:px-10 sm:py-14">
          <HeroDecor />
          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#f7d9c8] bg-white text-[#f47c3c] shadow-[0_12px_30px_-20px_rgba(244,124,60,.55)]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.04] tracking-[-.045em] text-[#101828] sm:text-6xl">How would you like to create your resume?</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#667085] sm:text-lg">Choose an option to get started. You can edit everything later.</p>
            <div className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full border border-[#e8edf4] bg-white/90 px-4 py-2 text-xs font-semibold text-[#667085] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#f47c3c]" /> Smart guidance · AI assisted · A4 ready
            </div>
          </div>
        </section>

        <div className="mx-auto mt-7 grid max-w-5xl gap-5 md:grid-cols-2">
          {([
            { id: 'upload' as const, title: 'Upload an existing resume', desc: "Already have a resume? Upload it and we'll use your information to help you create a polished, professional resume.", meta: 'PDF, DOC, DOCX, RTF or TXT', badge: 'RECOMMENDED' },
            { id: 'scratch' as const, title: 'Start from scratch', desc: "Don't have a resume yet? Start with a blank resume and build it step by step.", meta: 'Build your resume step by step' },
          ]).map((card) => {
            const active = selected === card.id;
            return (
              <button key={card.id} type="button" onClick={() => setSelected(card.id)} className={`group relative overflow-hidden rounded-[24px] border-2 bg-white p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#f47c3c] hover:shadow-[0_24px_60px_-36px_rgba(35,9,57,.38)] sm:p-5 ${active ? 'border-[#f47c3c] bg-[#fffaf7] shadow-[0_24px_60px_-36px_rgba(244,124,60,.35)]' : 'border-[#e7e9ee]'}`}>
                {card.badge && <span className="absolute left-5 top-5 z-10 rounded-full bg-[#f47c3c] px-3 py-1.5 text-[10px] font-extrabold tracking-[.08em] text-white">{card.badge}</span>}
                {active && <span className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#f47c3c] text-white shadow-sm"><Check className="h-4 w-4" /></span>}
                <div className="overflow-hidden rounded-[18px] border border-[#f1f2f5] bg-[#fafafa] p-2">{card.id === 'upload' ? <UploadIllustration /> : <ScratchIllustration />}</div>
                <div className="mt-5 flex items-start gap-3 px-1 pb-1">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff1e8] text-[#f47c3c] shadow-sm">{card.id === 'upload' ? <FileUp className="h-5 w-5" /> : <FilePlus2 className="h-5 w-5" />}</span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-extrabold tracking-[-.025em] text-[#230939]">{card.title}</h2>
                    <p className="mt-1.5 text-sm leading-6 text-[#667085]">{card.desc}</p>
                    <p className="mt-3 text-xs font-bold text-[#8a919d]">{card.meta}</p>
                  </div>
                  <span className="mt-1 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#eceef2] bg-white text-[#f47c3c] shadow-sm sm:flex"><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-7 flex max-w-5xl items-center justify-between gap-3 border-t border-[#f0f0f0] pt-5">
          <a href="/" className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white px-4 text-sm font-bold text-[#230939] hover:border-[#f47c3c]"><ArrowLeft className="h-4 w-4" /> Back</a>
          <button type="button" disabled={!selected} onClick={() => selected && onContinue(selected)} className="inline-flex h-11 min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#f47c3c] px-5 text-sm font-bold text-white shadow-[0_12px_28px_-16px_rgba(244,124,60,.75)] transition hover:bg-[#e5682e] disabled:cursor-not-allowed disabled:bg-[#e6e7eb] disabled:text-[#98a2b3] disabled:shadow-none">Continue <ArrowRight className="h-4 w-4" /></button>
        </div>
      </main>

      <style jsx global>{`.oe-start,.oe-start *{font-family:"Proxima Nova",Arial,sans-serif}.oe-start h1,.oe-start h2,.oe-start button{font-weight:700}.oe-start button{touch-action:manipulation}@media(max-width:767px){.oe-start main{padding-top:24px}.oe-start section h1{font-size:2.35rem}.oe-start section{border-radius:22px}.oe-start section p{font-size:.95rem}.oe-start .group{border-radius:20px}.oe-start .group svg{max-height:210px}.oe-start .group h2{font-size:1.15rem}}`}</style>
    </div>
  );
}

function UploadResumeScreen({ onBack, onImported }: { onBack: () => void; onImported: (data: any) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('');

  async function importFile(file: File) {
    if (!/\.(pdf|doc|docx|rtf|txt)$/i.test(file.name)) { toast({ title: 'Unsupported file', description: 'Please upload PDF, DOC, DOCX, RTF or TXT.', variant: 'error' }); return; }
    if (file.size > 8 * 1024 * 1024) { toast({ title: 'File is too large', description: 'Please upload a file smaller than 8 MB.', variant: 'error' }); return; }
    if (!/\.pdf$/i.test(file.name)) { toast({ title: 'PDF import is currently supported', description: 'Please export your resume as PDF and try again.', variant: 'error' }); return; }

    setFileName(file.name); setBusy(true); setStatus('Analyzing your resume...');
    try {
      const form = new FormData(); form.append('file', file);
      const response = await fetch('/api/resume/scan', { method: 'POST', body: form });
      const payload = await response.json();
      if (response.status === 401) { window.location.href = '/login?returnTo=/resume/new&reason=import'; return; }
      if (!response.ok) throw new Error(payload?.error || 'Could not import this resume.');
      setStatus('Resume imported successfully');
      onImported(payload.data);
    } catch (error) {
      setStatus('');
      toast({ title: 'Could not import resume', description: error instanceof Error ? error.message : 'Please try again.', variant: 'error' });
    } finally { setBusy(false); }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) { event.preventDefault(); setDragging(false); const file = event.dataTransfer.files?.[0]; if (file) void importFile(file); }

  return (
    <div className="oe-upload min-h-dvh bg-white text-[#000]">
      <header className="flex h-[68px] items-center border-b border-[#f0f0f0] px-5 sm:px-8"><button type="button" onClick={onBack} className="mr-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#230939] hover:text-[#f47c3c]"><ArrowLeft className="h-4 w-4" /> Back</button><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-[28px] w-auto" /></header>
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center"><span className="text-xs font-bold uppercase tracking-[.12em] text-[#f47c3c]">Upload existing resume</span><h1 className="mt-3 text-3xl font-bold tracking-[-.03em] sm:text-5xl">Upload your resume</h1><p className="mt-4 text-sm leading-6 text-[#667085] sm:text-base">Upload your existing resume and we'll help you turn it into a polished, professional resume.</p></div>
        <div onDragOver={(e)=>{e.preventDefault();setDragging(true)}} onDragLeave={()=>setDragging(false)} onDrop={onDrop} className={`mx-auto mt-10 max-w-3xl rounded-2xl border-2 border-dashed p-8 text-center transition sm:p-14 ${dragging ? 'border-[#f47c3c] bg-[#fff8f3]' : 'border-[#e4e6e9] bg-white'}`}>
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff1e8] text-[#f47c3c]">{busy ? <Loader2 className="h-7 w-7 animate-spin" /> : <FileUp className="h-7 w-7" />}</div>
          <h2 className="mt-5 text-xl font-bold text-[#230939]">{busy ? 'Analyzing your resume...' : 'Drag & drop your resume here'}</h2>
          <p className="mt-2 text-sm text-[#667085]">or</p>
          <button type="button" disabled={busy} onClick={()=>inputRef.current?.click()} className="mt-2 inline-flex h-11 items-center rounded-lg bg-[#f47c3c] px-6 text-sm font-bold text-white hover:bg-[#e5682e] disabled:opacity-60">Browse files</button>
          <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.rtf,.txt" className="hidden" onChange={(e)=>{const f=e.target.files?.[0];if(f)void importFile(f)}} />
          <p className="mt-5 text-xs font-semibold text-[#8a919d]">PDF • DOC • DOCX • RTF • TXT · Max 8 MB</p>
          {fileName && <div className="mx-auto mt-6 max-w-md rounded-xl border border-[#f8d8c6] bg-[#fff8f3] px-4 py-3 text-left text-sm"><div className="font-bold text-[#230939]">{fileName}</div><div className="mt-1 text-[#667085]">{status}</div></div>}
        </div>
      </main>
      <style jsx global>{`.oe-upload,.oe-upload *{font-family:"Proxima Nova",Arial,sans-serif}.oe-upload h1,.oe-upload h2,.oe-upload button{font-weight:700}`}</style>
    </div>
  );
}

export default function NewResumePage() {
  const router = useRouter();
  const { data, settings, updateData, updateSettings } = useDraftResume();
  const [mode, setMode] = useState<'start' | 'upload' | 'wizard'>('start');
  const [finishing, setFinishing] = useState(false);

  function begin(selected: 'upload' | 'scratch') { setMode(selected === 'upload' ? 'upload' : 'wizard'); }
  function imported(parsed: any) { updateData(() => ({ ...EMPTY_RESUME_DATA, ...parsed })); setMode('wizard'); toast({ title: 'Resume imported successfully', description: 'Your information has been added to the builder.', }); }

  async function handleFinish() {
    setFinishing(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login?returnTo=/resume/new&reason=save'); return; }
      const title = data.personalInfo.fullName ? `${data.personalInfo.fullName} Resume` : 'Untitled Resume';
      const createRes = await fetch('/api/resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) });
      const createJson = await createRes.json();
      if (!createRes.ok) throw new Error(createJson.error || 'Could not create resume');
      const id = createJson.resume.id;
      const patchRes = await fetch(`/api/resume/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, resume_data: data, template: settings.template, settings }) });
      if (!patchRes.ok) throw new Error('Could not save your resume content');
      if (typeof window !== 'undefined') window.localStorage.removeItem('orrica_edge_draft_v1');
      router.push(`/resume/${id}`);
    } catch (err) { toast({ title: 'Could not finish your resume', description: (err as Error).message, variant: 'error' }); setFinishing(false); }
  }

  if (mode === 'start') return <ResumeStartScreen onContinue={begin} />;
  if (mode === 'upload') return <UploadResumeScreen onBack={() => setMode('start')} onImported={imported} />;
  return <OrricaResumeWizard data={data} settings={settings} updateData={updateData} updateSettings={updateSettings} onFinish={handleFinish} finishing={finishing} />;
}
