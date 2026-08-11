import type { Metadata } from 'next';
import { ShieldCheck, Sparkles, Target } from 'lucide-react';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

export const metadata: Metadata = {
  title: 'About Orrica Edge',
  description: 'Learn why Orrica Edge is building a focused AI-assisted resume builder around truthful writing, ATS-ready structure and a better editing experience.',
  alternates: { canonical: '/about' },
};

const VALUES = [
  { icon: ShieldCheck, title: 'No invented facts', desc: 'AI should help you communicate your real experience, not create a fictional career history.' },
  { icon: Target, title: 'Built for ATS', desc: 'Structured layouts and clear hierarchy come first, then visual polish.' },
  { icon: Sparkles, title: 'Fast, not noisy', desc: 'A resume builder should remove friction and keep you focused on the application.' },
];

export default function AboutPage() {
  return <div className="min-h-dvh bg-white"><SiteHeader /><main className="mx-auto max-w-4xl px-5 py-16 sm:py-24"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">About Orrica Edge</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">A better way to turn experience into a strong application.</h1><p className="mt-6 text-lg leading-8 text-muted-foreground">Orrica Edge is an AI-assisted resume builder built around one simple idea: your resume should sound like the best version of you while staying grounded in what is actually true. We combine clean, ATS-ready templates with guided editing, AI assistance and a live preview so you can spend less time formatting and more time applying.</p></div><div className="mt-12 grid gap-5 sm:grid-cols-3">{VALUES.map((v) => <div key={v.title} className="rounded-2xl border bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600"><v.icon className="h-5 w-5" /></div><h2 className="mt-5 font-bold">{v.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{v.desc}</p></div>)}</div><div className="mt-10 rounded-3xl border bg-neutral-950 p-7 text-white sm:p-10"><h2 className="text-2xl font-semibold">Build with clarity.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">Every part of the product is meant to answer a practical question: what should I write, how should I present it, and does the final resume look ready to send?</p></div></main><SiteFooter /></div>;
}
