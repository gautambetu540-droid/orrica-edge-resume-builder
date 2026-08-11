import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BellRing, BriefcaseBusiness, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

const JOB_CHANNEL = 'https://whatsapp.com/channel/0029VbAsVFr4Y9lwo6JDRA2t';

export const metadata: Metadata = {
  title: 'Free Job Updates on WhatsApp',
  description: 'Follow Orrica Edge for free job updates, fresh opportunities and career alerts on WhatsApp. No paid access required.',
  alternates: { canonical: '/jobs' },
};

export default function JobsPage() {
  return (
    <div className="min-h-dvh bg-white">
      <SiteHeader />
      <main>
        <section className="gradient-mesh-bg relative overflow-hidden border-b border-black/[0.06] py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
            <div className="animate-fade-in-up mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm"><BriefcaseBusiness className="h-7 w-7" /></div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-emerald-600">Free career updates</p>
            <h1 className="animate-fade-in-up reveal-1 mt-3 text-4xl font-semibold tracking-[-0.055em] text-neutral-950 sm:text-6xl">Find your next opportunity without paying for job updates.</h1>
            <p className="animate-fade-in-up reveal-2 mx-auto mt-5 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">Follow the Orrica Edge WhatsApp channel for free job updates and career opportunities, then use your Orrica Edge resume when you are ready to apply.</p>
            <div className="animate-fade-in-up reveal-3 mt-8 flex flex-col justify-center gap-3 sm:flex-row"><a href={JOB_CHANNEL} target="_blank" rel="noreferrer"><Button size="lg" className="h-12 w-full rounded-xl bg-emerald-600 px-6 font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 sm:w-auto">Follow free job updates <ArrowUpRight className="ml-1 h-4 w-4" /></Button></a><Link href="/resume/new"><Button size="lg" variant="outline" className="h-12 w-full rounded-xl px-6 font-bold sm:w-auto">Build my resume</Button></Link></div>
          </div>
        </section>

        <section className="py-20 sm:py-24"><div className="mx-auto max-w-5xl px-5 lg:px-8"><div className="grid gap-5 sm:grid-cols-3">{[
          ['Free access', 'No paid subscription is required to follow the job-update channel.'],
          ['Fresh opportunities', 'Check the channel for new opportunities and career-related updates.'],
          ['Resume ready', 'Build a polished resume on Orrica Edge before you apply.'],
        ].map(([title, desc], index) => <div key={title} className={`hover-lift rounded-2xl border bg-white p-6 animate-fade-in-up reveal-${index + 1}`}><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">{index === 0 ? <Check className="h-5 w-5" /> : index === 1 ? <BellRing className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}</div><h2 className="mt-5 font-bold text-neutral-950">{title}</h2><p className="mt-2 text-sm leading-6 text-neutral-500">{desc}</p></div>)}</div></div></section>

        <section className="px-5 pb-20 sm:pb-28 lg:px-8"><div className="mx-auto max-w-5xl rounded-[28px] bg-neutral-950 px-6 py-12 text-center text-white sm:px-10"><h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Job update first. Resume ready next.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-400">Follow the free channel for opportunities, then create a tailored resume with a live preview and PDF export.</p><div className="mt-7"><a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-sm font-bold text-neutral-950 hover:bg-neutral-100">Open WhatsApp channel <ArrowUpRight className="ml-1 h-4 w-4" /></a></div></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
