import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { TemplatePreviewCard } from '@/components/landing/TemplatePreviewCard';
import { TEMPLATE_LIST } from '@/lib/templates/presets';

export const metadata: Metadata = {
  title: 'Professional Resume Templates',
  description: 'Explore professional, ATS-ready resume templates from Orrica Edge. Choose a clean layout and customize fonts, colors, spacing and sections.',
  alternates: { canonical: '/templates' },
};

export default function TemplatesPage() {
  return (
    <div className="min-h-dvh bg-[#fbfaf9]">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-orange-700"><Sparkles className="h-3.5 w-3.5" /> Curated resume designs</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-neutral-950 sm:text-6xl">Templates that look polished before you even customize them.</h1>
          <p className="mt-5 text-base leading-7 text-neutral-500 sm:text-lg">The old generic layouts have been replaced with cleaner sample-inspired structures, stronger typography, better spacing and reliable A4 PDF proportions.</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{TEMPLATE_LIST.map((t) => <div key={t.id} className="group overflow-hidden rounded-[22px] border border-neutral-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/5"><div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 p-3"><TemplatePreviewCard accent={t.defaultAccentColor} layout={t.layout} headerVariant={t.headerVariant} sidebarVariant={t.sidebarVariant} font={t.recommendedFont} /><Link href={`/resume/new?template=${t.id}`} className="absolute inset-3 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100"><span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-neutral-900 shadow-xl">Use this template</span></Link></div><div className="p-5"><h2 className="font-bold tracking-tight text-neutral-950">{t.name}</h2><p className="mt-1 text-sm leading-6 text-neutral-500">{t.description}</p><Link href={`/resume/new?template=${t.id}`} className="mt-4 block"><Button variant="outline" className="h-10 w-full rounded-xl">Use this template <ChevronRight className="h-3.5 w-3.5" /></Button></Link></div></div>)}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
