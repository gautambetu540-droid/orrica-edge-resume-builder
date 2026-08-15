'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, X } from 'lucide-react';
import { TemplatePreviewCard } from '@/components/landing/TemplatePreviewCard';
import { TEMPLATE_LIST } from '@/lib/templates/presets';

const CATEGORY_FILTERS = ['All', 'Fresher / Graduate', 'IT / Software / Technology', 'BPO / Customer Support', 'Finance / Accounting', 'Sales / Business Development', 'Marketing / Digital Marketing', 'HR / Recruitment', 'Operations / Administration', 'Healthcare / Medical', 'Creative / Design', 'Executive / Management', 'Photo / Professional'];
const STYLE_FILTERS = ['All', 'ATS', 'Modern', 'Minimal', 'Professional', 'Executive', 'Creative', 'Two Column'];
const FORMAT_FILTERS = ['All', 'Single Column', 'Two Column', 'Photo'];

export function TemplatesGallery() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [style, setStyle] = useState('All');
  const [format, setFormat] = useState('All');
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATE_LIST.filter((template) => {
      const matchesQuery = !q || `${template.name} ${template.category} ${template.style} ${template.description}`.toLowerCase().includes(q);
      return matchesQuery && (category === 'All' || template.category === category) && (style === 'All' || template.style === style) && (format === 'All' || template.format === format);
    });
  }, [query, category, style, format]);

  const selected = previewId ? TEMPLATE_LIST.find((template) => template.id === previewId) : undefined;

  return (
    <>
      <div className="mx-auto mt-10 max-w-6xl rounded-2xl border border-orange-100 bg-white p-3 shadow-sm">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resume templates..." className="h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm text-neutral-900 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-50" aria-label="Search resume templates" />
        </label>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {CATEGORY_FILTERS.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold ${category === item ? 'bg-orange-500 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-orange-50 hover:text-orange-700'}`}>{item}</button>)}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {STYLE_FILTERS.map((item) => <button key={item} type="button" onClick={() => setStyle(item)} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${style === item ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{item}</button>)}
          <span className="mx-1 hidden h-6 w-px bg-neutral-200 sm:block" />
          {FORMAT_FILTERS.map((item) => <button key={item} type="button" onClick={() => setFormat(item)} className={`rounded-full px-3 py-1.5 text-[11px] font-bold ${format === item ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{item}</button>)}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between"><p className="text-xs font-semibold text-neutral-500">{filtered.length} resume templates</p><p className="hidden text-xs text-neutral-400 sm:block">ATS-friendly · A4-ready · Customizable</p></div>

      {filtered.length ? (
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((template) => (
            <article key={template.id} className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
              <button type="button" onClick={() => setPreviewId(template.id)} className="block w-full text-left" aria-label={`Preview ${template.name} resume template`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 p-2.5"><TemplatePreviewCard template={template} accent={template.defaultAccentColor} layout={template.layout} headerVariant={template.headerVariant} sidebarVariant={template.sidebarVariant} font={template.recommendedFont} /><div className="absolute inset-x-3 bottom-3 rounded-xl bg-white/95 px-3 py-2 text-center text-[11px] font-bold text-neutral-900 opacity-0 shadow-lg backdrop-blur transition group-hover:opacity-100">Preview template</div></div>
              </button>
              <div className="p-4"><div className="flex flex-wrap gap-1.5"><span className="rounded-full bg-orange-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-orange-700">{template.category}</span><span className="rounded-full bg-neutral-100 px-2 py-1 text-[9px] font-bold text-neutral-500">{template.style}</span></div><h2 className="mt-2 text-sm font-extrabold tracking-tight text-neutral-950">{template.name}</h2><p className="mt-1 min-h-[44px] text-[11px] leading-5 text-neutral-500">{template.description}</p><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => setPreviewId(template.id)} className="h-9 rounded-lg border border-neutral-200 text-[11px] font-bold text-neutral-700 hover:border-orange-300 hover:text-orange-700">Preview</button><Link href={`/resume/new?template=${template.id}`} className="inline-flex h-9 items-center justify-center rounded-lg bg-orange-500 text-[11px] font-bold text-white hover:bg-orange-600">Use Template</Link></div></div>
            </article>
          ))}
        </div>
      ) : <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center"><p className="font-bold text-neutral-900">No templates found</p><p className="mt-1 text-sm text-neutral-500">Try a different search or filter.</p></div>}

      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/70 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label={`${selected.name} preview`}><div className="flex max-h-[94dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl lg:flex-row"><div className="flex min-h-[58vh] flex-1 items-center justify-center overflow-auto bg-neutral-100 p-4 sm:p-8"><div className="w-full max-w-[540px]"><TemplatePreviewCard template={selected} accent={selected.defaultAccentColor} layout={selected.layout} headerVariant={selected.headerVariant} sidebarVariant={selected.sidebarVariant} font={selected.recommendedFont} /></div></div><aside className="w-full border-t border-neutral-200 p-5 sm:p-7 lg:w-[330px] lg:border-l lg:border-t-0"><div className="flex items-start justify-between gap-4"><div><span className="text-[10px] font-black uppercase tracking-[.16em] text-orange-600">{selected.category}</span><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-neutral-950">{selected.name}</h2></div><button type="button" onClick={() => setPreviewId(null)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50" aria-label="Close preview"><X className="h-4 w-4" /></button></div><p className="mt-4 text-sm leading-6 text-neutral-500">{selected.description}</p><dl className="mt-6 space-y-3 text-xs"><div className="flex justify-between gap-4"><dt className="text-neutral-400">Style</dt><dd className="font-bold text-neutral-800">{selected.style}</dd></div><div className="flex justify-between gap-4"><dt className="text-neutral-400">Format</dt><dd className="font-bold text-neutral-800">{selected.format}</dd></div><div className="flex justify-between gap-4"><dt className="text-neutral-400">Font</dt><dd className="font-bold text-neutral-800">{selected.recommendedFont}</dd></div><div className="flex justify-between gap-4"><dt className="text-neutral-400">ATS</dt><dd className="font-bold text-emerald-700">Recruiter-ready</dd></div></dl><Link href={`/resume/new?template=${selected.id}`} className="mt-7 inline-flex h-11 w-full items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white hover:bg-orange-600">Use This Template <ArrowRight className="ml-2 h-4 w-4" /></Link></aside></div></div>}
    </>
  );
}
