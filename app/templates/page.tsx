import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SampleResumeCard } from '@/components/landing/SampleResumeCard';
import { TEMPLATE_LIST } from '@/lib/templates/presets';

export const metadata: Metadata = {
  title: 'Professional Resume Templates',
  description: 'Explore professional, ATS-ready resume templates from Orrica Edge. Choose a clean layout and customize fonts, colors, spacing and sections.',
  alternates: { canonical: '/templates' },
};

export default function TemplatesPage() {
  return (
    <div className="min-h-dvh bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Resume templates</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">Professional templates built for modern applications.</h1><p className="mt-5 text-base leading-7 text-muted-foreground">Choose a distinct layout, then customize it in the live editor. Every template is designed around readable structure and clean PDF output.</p></div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{TEMPLATE_LIST.map((t) => <div key={t.id} className="group overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/5"><div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 p-3"><SampleResumeCard accent={t.defaultAccentColor} layout={t.layout} /><Link href="/resume/new" className="absolute inset-3 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/25 group-hover:opacity-100"><span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-neutral-900 shadow-xl">Use this template</span></Link></div><div className="p-5"><h2 className="font-bold">{t.name}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{t.description}</p><Link href="/resume/new" className="mt-4 block"><Button variant="outline" className="w-full">Use this template <ChevronRight className="h-3.5 w-3.5" /></Button></Link></div></div>)}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
