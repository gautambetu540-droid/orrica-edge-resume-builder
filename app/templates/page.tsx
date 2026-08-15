import type { Metadata } from 'next';
import { ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { TemplatePreviewCard } from '@/components/landing/TemplatePreviewCard';
import { TEMPLATE_LIST, TEMPLATE_CATEGORIES } from '@/lib/templates/presets';

export const metadata: Metadata = {
  title: 'Professional Resume Templates | Orrica Edge',
  description: 'Explore Fresher, Photo, IT, BPO and professional resume templates from Orrica Edge with clean ATS-friendly layouts and customizable typography and colors.',
  alternates: { canonical: '/templates' },
};

export default function TemplatesPage() {
  return (
    <div className="min-h-dvh bg-[#f8fafc]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-600 shadow-sm"><Sparkles className="h-3.5 w-3.5 text-blue-600" /> Orrica Edge Template Library</div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-6xl">Choose a resume design that fits your career.</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">40 new role-focused designs across Fresher, Photo, IT / Technology and BPO / Customer Support, plus refreshed professional templates. Every design is built for clean A4 output and can be customized before export.</p>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TEMPLATE_CATEGORIES.map((category) => <a key={category} href={`#${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-400 hover:text-slate-950">{category}</a>)}
        </div>

        <section id="all" className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">Template library</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">All templates</h2></div><div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><SlidersHorizontal className="h-4 w-4" /> Typography, spacing and colors can be changed in the builder.</div></div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEMPLATE_LIST.map((t) => (
              <article id={t.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-')} key={t.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 p-2.5 sm:p-3">
                  <TemplatePreviewCard accent={t.defaultAccentColor} layout={t.layout} headerVariant={t.headerVariant} sidebarVariant={t.sidebarVariant} font={t.recommendedFont} />
                  <Link href={`/resume/new?template=${t.id}`} className="absolute inset-2.5 flex items-center justify-center bg-slate-950/0 opacity-0 transition-all duration-200 group-hover:bg-slate-950/20 group-hover:opacity-100 sm:inset-3"><span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-xl">Use this template</span></Link>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-3"><h3 className="font-bold tracking-tight text-slate-950">{t.name}</h3><span className="shrink-0 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wide" style={{ backgroundColor: `${t.defaultAccentColor}14`, color: t.defaultAccentColor }}>{t.category}</span></div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{t.description}</p>
                  <Link href={`/resume/new?template=${t.id}`} className="mt-3 flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">Use this template <ChevronRight className="h-3.5 w-3.5" /></Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
