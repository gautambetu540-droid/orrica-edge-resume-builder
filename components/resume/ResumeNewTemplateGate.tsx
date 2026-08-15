'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Search, Sparkles } from 'lucide-react';
import { TemplatePreviewCard } from '@/components/landing/TemplatePreviewCard';
import { TEMPLATE_LIST } from '@/lib/templates/presets';
import { DEFAULT_SETTINGS, TemplateId } from '@/lib/types/resume';
import ResumeCreationFlow from '@/components/resume/ResumeCreationFlow';

const CATEGORIES = ['All', ...Array.from(new Set(TEMPLATE_LIST.map((t) => t.category)))];
const STYLES = ['All', 'ATS', 'Modern', 'Minimal', 'Professional', 'Executive', 'Creative', 'Two Column'];

function saveTemplate(id: TemplateId) {
  try {
    const raw = localStorage.getItem('orrica_edge_draft_v1');
    const parsed = raw ? JSON.parse(raw) : {};
    localStorage.setItem('orrica_edge_draft_v1', JSON.stringify({
      ...parsed,
      data: parsed.data ?? undefined,
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}), template: id, accentColor: '#F97316' },
    }));
  } catch {
    localStorage.setItem('orrica_edge_selected_template', id);
  }
}

function Onboarding({ onStart }: { onStart: () => void }) {
  return (
    <div className="oe-create-shell min-h-dvh bg-white text-[#171310]">
      <header className="border-b border-orange-100 bg-white/95 px-4 py-4 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between">
          <a href="/" className="flex items-center"><img src="/logo-orricaedge.png" alt="Orrica Edge Resume" className="h-7 w-auto sm:h-8" /></a>
          <a href="/templates" className="text-xs font-bold text-orange-700 hover:text-orange-600">Browse templates</a>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[.85fr_1.15fr] lg:gap-16 lg:py-20">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.16em] text-orange-700"><Sparkles className="h-3.5 w-3.5" /> Orrica Edge Resume Builder</div>
          <h1 className="mt-6 max-w-[600px] text-5xl font-black leading-[.98] tracking-[-.065em] sm:text-6xl lg:text-[68px]">Build your resume in three easy steps.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#6B5A4E] sm:text-lg">Create a professional, ATS-friendly resume with Orrica Edge Resume. Choose a design, add your experience and make every detail ready for your next application.</p>
          <div className="mt-8 space-y-5">
            {[
              ['01', 'Choose your template', 'Start with a professional resume design from the complete Orrica Edge template library.'],
              ['02', 'Build your resume', 'Add your experience, education, skills, projects and achievements with guided sections.'],
              ['03', 'Customize and get ready', 'Fine-tune your content and formatting, then continue to your job-ready resume.'],
            ].map(([num, title, text]) => (
              <div key={num} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-black text-white shadow-[0_10px_25px_-14px_rgba(249,115,22,.9)]">{num}</span>
                <div><h2 className="text-base font-extrabold text-[#171310] sm:text-lg">{title}</h2><p className="mt-1 text-sm leading-6 text-[#75675D]">{text}</p></div>
              </div>
            ))}
          </div>
          <button type="button" onClick={onStart} className="mt-9 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 text-sm font-extrabold text-white shadow-[0_16px_30px_-18px_rgba(249,115,22,.9)] transition hover:-translate-y-0.5 hover:bg-orange-600">Start Building <ArrowRight className="h-4 w-4" /></button>
        </section>

        <section className="relative mx-auto w-full max-w-[620px]">
          <div className="absolute -right-4 top-8 h-44 w-44 rounded-full bg-orange-100 blur-[2px] sm:h-56 sm:w-56" />
          <div className="absolute -left-5 bottom-8 h-28 w-28 rounded-full bg-orange-50" />
          <div className="relative rounded-[28px] border border-orange-100 bg-[#FFF8F2] p-5 shadow-[0_35px_80px_-45px_rgba(70,35,10,.35)] sm:p-8">
            <div className="mb-4 flex items-center justify-between"><div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-200"/><span className="h-2.5 w-2.5 rounded-full bg-orange-300"/><span className="h-2.5 w-2.5 rounded-full bg-orange-400"/></div><span className="rounded-full bg-white px-3 py-1 text-[9px] font-bold text-orange-700 shadow-sm">LIVE PREVIEW</span></div>
            <div className="grid gap-4 sm:grid-cols-[.28fr_.72fr]">
              <div className="hidden rounded-2xl bg-[#171310] p-3 text-white sm:block"><div className="h-8 w-8 rounded-lg bg-orange-500"/><div className="mt-7 space-y-3">{['Templates','Design','Sections','Preview'].map((item, i) => <div key={item} className="flex items-center gap-2 text-[9px] font-semibold text-white/80"><span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-orange-400' : 'bg-white/30'}`}/>{item}</div>)}</div></div>
              <div className="rounded-xl bg-white p-5 shadow-[0_20px_45px_-30px_rgba(60,30,10,.35)] sm:p-7"><div className="flex items-start justify-between border-b border-orange-100 pb-4"><div><div className="text-xl font-black tracking-tight text-[#171310]">Alex Morgan</div><div className="mt-1 text-[9px] font-semibold text-orange-600">MARKETING SPECIALIST</div></div><div className="h-10 w-10 rounded-full border-4 border-orange-100 bg-orange-50"/></div><div className="mt-5 space-y-4">{['PROFESSIONAL SUMMARY','EXPERIENCE','EDUCATION','SKILLS'].map((heading, i) => <div key={heading}><div className="text-[8px] font-black tracking-[.14em] text-orange-600">{heading}</div><div className="mt-1.5 space-y-1.5">{Array.from({length:i === 1 ? 3 : 2}).map((_, j) => <div key={j} className="h-1.5 rounded-full bg-neutral-100"><div className="h-full rounded-full bg-orange-100" style={{width:`${68 + ((i+j)%3)*10}%`}}/></div>)}</div></div>)}</div></div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-orange-100 bg-white px-4 py-3"><span className="text-[10px] font-bold text-[#6B5A4E]">ATS-friendly · A4-ready · Editable</span><span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-orange-600"><Check className="h-3.5 w-3.5"/> Ready to build</span></div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function ResumeNewTemplateGate() {
  const [screen, setScreen] = useState<'intro' | 'templates'>('intro');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [style, setStyle] = useState('All');
  const [launch, setLaunch] = useState(false);
  const [flowKey, setFlowKey] = useState(0);
  const [flowReady, setFlowReady] = useState(false);

  const filtered = TEMPLATE_LIST.filter((t) => {
    const hay = `${t.name} ${t.category} ${t.style} ${t.description}`.toLowerCase();
    return (!query.trim() || hay.includes(query.trim().toLowerCase())) && (category === 'All' || t.category === category) && (style === 'All' || t.style === style);
  });

  useEffect(() => {
    if (!launch) return;
    let last = 0;
    const timer = window.setInterval(() => {
      const choice = document.querySelector('.oe-choice');
      if (choice) { setFlowReady(true); window.clearInterval(timer); return; }
      const gallery = document.querySelector('.oe-gallery');
      if (gallery) {
        const next = Array.from(gallery.querySelectorAll('button')).find((b) => b.textContent?.includes('Next: Start')) as HTMLButtonElement | undefined;
        if (next && Date.now() - last > 250) { last = Date.now(); next.click(); }
        return;
      }
      const introNext = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.trim() === 'Next') as HTMLButtonElement | undefined;
      if (introNext && Date.now() - last > 250) { last = Date.now(); introNext.click(); }
    }, 80);
    return () => window.clearInterval(timer);
  }, [launch, flowKey]);

  const choose = (id: TemplateId) => { saveTemplate(id); setFlowReady(false); setFlowKey((k) => k + 1); setLaunch(true); };

  if (launch) return <div className={flowReady ? '' : 'opacity-0 pointer-events-none'}><ResumeCreationFlow key={flowKey} /></div>;
  if (screen === 'intro') return <Onboarding onStart={() => setScreen('templates')} />;

  return (
    <div className="oe-new-template-library min-h-dvh bg-[#FFF9F5] text-[#171310]">
      <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8"><div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4"><a href="/" className="flex items-center"><img src="/logo-orricaedge.png" alt="Orrica Edge Resume" className="h-7 w-auto sm:h-8" /></a><a href="/templates" className="text-xs font-bold text-orange-700 hover:text-orange-600">Browse all templates</a></div></header>
      <main className="mx-auto max-w-[1280px] px-3 py-7 sm:px-6 sm:py-10 lg:px-8">
        <section className="mx-auto max-w-5xl text-center"><div className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.16em] text-orange-700"><Sparkles className="h-3.5 w-3.5" /> Step 1 · Template Library</div><h1 className="mt-4 text-4xl font-bold tracking-[-.055em] sm:text-5xl lg:text-[58px] lg:leading-[1.02]">Choose your resume template</h1><p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-[#6B5A4E] sm:text-base">Choose from the same complete Orrica Edge Resume template library — filled previews, ATS-ready layouts and professional designs.</p></section>
        <div className="mx-auto mt-8 max-w-6xl rounded-2xl border border-orange-100 bg-white p-3 shadow-[0_16px_45px_-32px_rgba(90,45,15,.35)] sm:p-4"><div className="flex flex-col gap-3 lg:flex-row"><label className="relative flex-1"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resume templates..." className="h-11 w-full rounded-xl border border-orange-100 bg-[#FFF9F5] pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50"/></label><div className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:max-w-[720px]">{CATEGORIES.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-bold ${category === item ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-800 hover:bg-orange-100'}`}>{item}</button>)}</div></div><div className="mt-2 flex gap-2 overflow-x-auto pb-1">{STYLES.map((item) => <button key={item} type="button" onClick={() => setStyle(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-bold ${style === item ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-orange-50 hover:text-orange-700'}`}>{item}</button>)}</div></div>
        <div className="mx-auto mt-5 flex max-w-6xl items-center justify-between"><span className="text-xs font-bold text-[#6B5A4E]">{filtered.length} resume templates</span><span className="hidden text-[11px] text-[#9A887B] sm:block">ATS-friendly · A4-ready · Filled preview · Customizable</span></div>
        <div className="mx-auto mt-3 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((template) => <article key={template.id} className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_16px_35px_-28px_rgba(90,45,15,.35)] transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_22px_45px_-28px_rgba(249,115,22,.35)]"><button type="button" onClick={() => choose(template.id)} className="block w-full text-left"><div className="relative aspect-[3/4] overflow-hidden bg-[#F7F0EA] p-2.5"><TemplatePreviewCard template={template} accent="#F97316" layout={template.layout} headerVariant={template.headerVariant} sidebarVariant={template.sidebarVariant} font={template.recommendedFont}/><div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 px-3 py-2 text-center text-[11px] font-extrabold text-orange-700 opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100">Use this template →</div></div></button><div className="p-3.5 sm:p-4"><div className="flex flex-wrap gap-1.5"><span className="rounded-full bg-orange-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-orange-700">{template.category}</span><span className="rounded-full bg-neutral-100 px-2 py-1 text-[9px] font-bold text-neutral-500">{template.style}</span></div><h2 className="mt-2 text-sm font-extrabold tracking-tight text-[#171310]">{template.name}</h2><p className="mt-1 min-h-[42px] text-[11px] leading-5 text-[#6B5A4E]">{template.description}</p><button type="button" onClick={() => choose(template.id)} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-xs font-extrabold text-white transition hover:bg-orange-600">Use Template <ArrowRight className="h-4 w-4"/></button></div></article>)}</div>
      </main>
      <style jsx global>{`.oe-new-template-library,.oe-new-template-library *,.oe-create-shell,.oe-create-shell *{font-family:"Proxima Nova",var(--font-noto-sans),Arial,sans-serif}.oe-new-template-library button,.oe-new-template-library input,.oe-create-shell button{min-height:44px}@media(max-width:640px){.oe-new-template-library h1{font-size:2.35rem}.oe-create-shell h1{font-size:3rem}.oe-create-shell main{padding-top:2.5rem;padding-bottom:3rem}}`}</style>
    </div>
  );
}
