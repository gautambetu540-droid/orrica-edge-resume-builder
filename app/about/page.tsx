import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Sparkles, Target, Linkedin, UserRound } from 'lucide-react';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

export const metadata: Metadata = {
  title: 'About Us | Orrica Edge',
  description: 'Learn about Orrica Edge, an AI-assisted resume builder focused on truthful writing, ATS-ready structure, professional templates and a better editing experience.',
  alternates: { canonical: '/about' },
};

const VALUES = [
  { icon: ShieldCheck, title: 'Truthful by design', desc: 'AI should help communicate real experience clearly, not create a fictional career history.' },
  { icon: Target, title: 'Structured for applications', desc: 'Clear hierarchy, readable layouts and practical editing come before decorative complexity.' },
  { icon: Sparkles, title: 'Helpful, not noisy', desc: 'The product is designed to reduce formatting friction and keep you focused on your application.' },
];

const LINKEDIN_URL = 'https://www.linkedin.com/in/sudhanshu-g-512937375/';

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6E46AE]">About Orrica Edge</p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.045em] sm:text-6xl">A better way to turn experience into a strong application.</h1>
          <p className="mt-6 text-base leading-8 text-neutral-600 sm:text-lg">Orrica Edge is an AI-assisted resume builder built around a simple idea: your resume should sound like the best version of you while staying grounded in what is actually true. The platform combines structured templates, guided editing, optional AI assistance, live preview and PDF export so you can spend less time formatting and more time applying.</p>
        </div>

        <section aria-labelledby="what-we-value" className="mt-12">
          <h2 id="what-we-value" className="sr-only">What Orrica Edge values</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-[#F0F0F0] bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#6E46AE]/30 hover:shadow-xl hover:shadow-black/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E9E7F7] text-[#6E46AE]"><v.icon className="h-5 w-5" /></div>
                <h2 className="mt-5 text-lg font-bold">{v.title}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-[28px] border border-[#F0F0F0] bg-neutral-950 p-7 text-white sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B051AA]">Meet the developer</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">Sudhanshu Gautam</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">Orrica Edge is being shaped as a practical, user-focused resume experience — from the writing workflow and templates to live preview and final PDF output.</p>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-neutral-950 transition-all hover:-translate-y-0.5 hover:bg-[#E9E7F7]">
                <Linkedin className="h-4 w-4" /> Connect on LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-[#B051AA]"><UserRound className="h-9 w-9" /></div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#F0F0F0] bg-[#E0F3F2] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">Build with clarity.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-700">Every part of the product is meant to answer practical questions: what should I write, how should I present it, and does the final resume look ready to send?</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/resume/new" className="inline-flex items-center gap-2 rounded-xl bg-[#6E46AE] px-5 py-3 text-sm font-bold text-white hover:bg-[#5d389c]">Create your resume <ArrowUpRight className="h-4 w-4" /></Link>
            <Link href="/contact-us" className="inline-flex items-center gap-2 rounded-xl border border-[#6E46AE] bg-white px-5 py-3 text-sm font-bold text-[#6E46AE] hover:bg-[#E9E7F7]">Contact us</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
