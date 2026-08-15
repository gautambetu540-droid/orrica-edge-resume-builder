'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
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

export default function ResumeNewTemplateGate() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [style, setStyle] = useState('All');
  const [launch, setLaunch] = useState(false);
  const [flowKey, setFlowKey] = useState(0);
  const [flowReady, setFlowReady] = useState(false);

  const filtered = TEMPLATE_LIST.filter((t) => {
    const hay = `${t.name} ${t.category} ${t.style} ${t.description}`.toLowerCase();
    return (!query.trim() || hay.includes(query.trim().toLowerCase())) &&
      (category === 'All' || t.category === category) &&
      (style === 'All' || t.style === style);
  });

  useEffect(() => {
    if (!launch) return;
    let last = 0;
    const timer = window.setInterval(() => {
      const choice = document.querySelector('.oe-choice');
      if (choice) {
        setFlowReady(true);
        window.clearInterval(timer);
        return;
      }
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

  const choose = (id: TemplateId) => {
    saveTemplate(id);
    setFlowReady(false);
    setFlowKey((k) => k + 1);
    setLaunch(true);
  };

  if (launch) {
    return <div className={flowReady ? '' : 'opacity-0 pointer-events-none'}><ResumeCreationFlow key={flowKey} /></div>;
  }

  return (
    <div className="oe-new-template-library min-h-dvh bg-[#FFF9F5] text-[#171310]">
      <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
          <a href="/" className="flex items-center"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-7 w-auto sm:h-8" /></a>
          <a href="/templates" className="text-xs font-bold text-orange-700 hover:text-orange-600">Browse all templates</a>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-3 py-7 sm:px-6 sm:py-10 lg:px-8">
        <section className="mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.16em] text-orange-700"><Sparkles className="h-3.5 w-3.5" /> Step 1 · Template Library</div>
          <h1 className="mt-4 text-4xl font-bold tracking-[-.055em] sm:text-5xl lg:text-[58px] lg:leading-[1.02]">Choose your resume template</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-[#6B5A4E] sm:text-base">The same real Orrica Edge template library used on the Templates page — filled previews, ATS-ready layouts and professional designs.</p>
        </section>

        <div className="mx-auto mt-8 max-w-6xl rounded-2xl border border-orange-100 bg-white p-3 shadow-[0_16px_45px_-32px_rgba(90,45,15,.35)] sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <label className="relative flex-1"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resume templates..." className="h-11 w-full rounded-xl border border-orange-100 bg-[#FFF9F5] pl-10 pr-4 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50" /></label>
            <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:max-w-[720px]">{CATEGORIES.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-bold ${category === item ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-800 hover:bg-orange-100'}`}>{item}</button>)}</div>
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">{STYLES.map((item) => <button key={item} type="button" onClick={() => setStyle(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-bold ${style === item ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-orange-50 hover:text-orange-700'}`}>{item}</button>)}</div>
        </div>

        <div className="mx-auto mt-5 flex max-w-6xl items-center justify-between"><span className="text-xs font-bold text-[#6B5A4E]">{filtered.length} resume templates</span><span className="hidden text-[11px] text-[#9A887B] sm:block">ATS-friendly · A4-ready · Filled preview · Customizable</span></div>

        <div className="mx-auto mt-3 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((template) => (
            <article key={template.id} className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-[0_16px_35px_-28px_rgba(90,45,15,.35)] transition duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_22px_45px_-28px_rgba(249,115,22,.35)]">
              <button type="button" onClick={() => choose(template.id)} className="block w-full text-left">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F7F0EA] p-2.5"><TemplatePreviewCard template={template} accent="#F97316" layout={template.layout} headerVariant={template.headerVariant} sidebarVariant={template.sidebarVariant} font={template.recommendedFont} /><div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 px-3 py-2 text-center text-[11px] font-extrabold text-orange-700 opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100">Use this template →</div></div>
              </button>
              <div className="p-3.5 sm:p-4"><div className="flex flex-wrap gap-1.5"><span className="rounded-full bg-orange-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-orange-700">{template.category}</span><span className="rounded-full bg-neutral-100 px-2 py-1 text-[9px] font-bold text-neutral-500">{template.style}</span></div><h2 className="mt-2 text-sm font-extrabold tracking-tight text-[#171310]">{template.name}</h2><p className="mt-1 min-h-[42px] text-[11px] leading-5 text-[#6B5A4E]">{template.description}</p><button type="button" onClick={() => choose(template.id)} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-xs font-extrabold text-white transition hover:bg-orange-600">Use Template <ArrowRight className="h-4 w-4" /></button></div>
            </article>
          ))}
        </div>
      </main>
      <style jsx global>{`.oe-new-template-library,.oe-new-template-library *{font-family:"Proxima Nova",var(--font-noto-sans),Arial,sans-serif}.oe-new-template-library button,.oe-new-template-library input{min-height:44px}@media(max-width:640px){.oe-new-template-library h1{font-size:2.35rem}.oe-new-template-library main{padding-bottom:2rem}}`}</style>
    </div>
  );
}
