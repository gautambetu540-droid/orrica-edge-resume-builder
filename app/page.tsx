'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, Download, Eye, Layers3, PencilLine, Sparkles, Target, WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SampleResumeCard } from '@/components/landing/SampleResumeCard';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { TEMPLATE_LIST } from '@/lib/templates/presets';

const FEATURES = [
  { icon: WandSparkles, title: 'AI writing that stays truthful', desc: 'Turn the experience you provide into sharper summaries and achievement-focused bullets without inventing facts.' },
  { icon: Target, title: 'ATS-ready structure', desc: 'Use clean, text-first layouts that keep important information easy to scan for recruiters and parsing systems.' },
  { icon: Layers3, title: 'Professional templates', desc: 'Choose a visual identity and fine-tune typography, spacing, sections and accent colors.' },
  { icon: Eye, title: 'Live A4 preview', desc: 'See your resume while you edit it and review the final layout before exporting.' },
  { icon: PencilLine, title: 'You stay in control', desc: 'AI is an assistant. You decide what belongs on your resume and what gets sent.' },
  { icon: Download, title: 'Ready-to-send PDF', desc: 'Export a clean, print-ready resume when your content and design are ready.' },
];

const FAQS = [
  ['What is Orrica Edge?', 'Orrica Edge is an AI-assisted resume builder combining guided writing, ATS-ready layouts, live preview, design controls and PDF export in one workflow.'],
  ['Will the AI invent experience?', 'The builder is designed to work from the information you provide. Review every AI suggestion before adding it to your final resume.'],
  ['Can I build a resume without AI?', 'Yes. AI is optional. You can write, edit and format every section manually.'],
  ['Can I download my resume as a PDF?', 'Yes. When your resume is ready, you can export a print-ready PDF from the builder.'],
];

function TypingHeadline() {
  const fullText = 'gets remembered.';
  const [text, setText] = useState('');

  useEffect(() => {
    let index = 0;
    let deleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!deleting) {
        index += 1;
        setText(fullText.slice(0, index));
        if (index === fullText.length) {
          deleting = true;
          timeout = setTimeout(tick, 1900);
          return;
        }
      } else {
        index -= 1;
        setText(fullText.slice(0, index));
        if (index === 0) {
          deleting = false;
        }
      }
      timeout = setTimeout(tick, deleting ? 55 : 90);
    };

    timeout = setTimeout(tick, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <h1 className="animate-fade-in-up reveal-1 mt-6 text-balance text-4xl font-semibold tracking-[-0.055em] text-neutral-950 sm:text-6xl lg:text-[76px] lg:leading-[.98]" aria-label="Build a resume that gets remembered.">
      Build a resume that<br className="hidden sm:block" />{' '}
      <span className="text-gradient-brand inline-block min-w-[1ch] text-left">
        {text}<span className="ml-1 inline-block h-[0.82em] w-[2px] translate-y-[0.08em] animate-pulse rounded-full bg-orange-500 sm:w-[3px]" aria-hidden="true" />
      </span>
    </h1>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[760px] animate-scale-in reveal-4">
      <div className="absolute -inset-12 rounded-[56px] bg-orange-500/10 blur-3xl" />
      <div className="absolute -right-4 top-16 z-10 hidden animate-float rounded-2xl border border-white/80 bg-white/92 px-4 py-3 shadow-xl backdrop-blur sm:block">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Check className="h-4 w-4" /></span>
          <div><div className="text-[11px] font-bold text-neutral-900">ATS-ready structure</div><div className="text-[9px] text-neutral-400">Built into the workflow</div></div>
        </div>
      </div>
      <div className="absolute -left-5 bottom-12 z-10 hidden animate-float-slow rounded-2xl border border-white/80 bg-white/92 px-4 py-3 shadow-xl backdrop-blur sm:block">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Sparkles className="h-4 w-4" /></span>
          <div><div className="text-[11px] font-bold text-neutral-900">AI writing assistant</div><div className="text-[9px] text-neutral-400">Improve without inventing</div></div>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-[30px] border border-orange-100/70 bg-white shadow-[0_48px_120px_-54px_rgba(15,23,42,.45)]">
        <div className="flex h-12 items-center justify-between border-b border-neutral-100 bg-white px-4 sm:px-5">
          <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neutral-300" /><span className="h-2 w-2 rounded-full bg-neutral-300" /><span className="h-2 w-2 rounded-full bg-neutral-300" /><span className="ml-2 text-[11px] font-semibold text-neutral-500">Orrica Edge · Resume Builder</span></div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">Saved</span>
        </div>
        <div className="grid min-h-[470px] grid-cols-[132px_1fr] bg-neutral-50 sm:grid-cols-[170px_1fr]">
          <aside className="border-r border-neutral-100 bg-white p-3 sm:p-4">
            <div className="mb-4 px-2 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-400">Resume sections</div>
            {['Personal', 'Experience', 'Education', 'Skills', 'Projects', 'Summary'].map((item, index) => (
              <div key={item} className={`mb-1 flex items-center gap-2 rounded-lg px-2 py-2 text-[9px] font-semibold ${index === 0 ? 'bg-orange-50 text-orange-700' : 'text-neutral-500'}`}>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[7px] ${index === 0 ? 'bg-orange-500 text-white' : 'bg-neutral-100'}`}>{index === 0 ? '✓' : index + 1}</span>{item}
              </div>
            ))}
            <div className="mt-5 border-t border-neutral-100 pt-4"><div className="px-2 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-400">Tools</div><div className="mt-2 rounded-lg border border-orange-100 bg-orange-50/60 px-2 py-2 text-[9px] font-semibold text-orange-700">✦ Improve with AI</div></div>
          </aside>
          <div className="grid grid-cols-[1fr_.82fr] gap-3 p-3 sm:gap-4 sm:p-4">
            <div className="rounded-xl border border-neutral-100 bg-white p-3.5 shadow-sm sm:p-4">
              <div className="mb-4"><div className="text-sm font-bold text-neutral-900 sm:text-base">Personal information</div><div className="mt-1 text-[8px] text-neutral-400">Start with the details recruiters need.</div></div>
              {['Full name', 'Professional title', 'Email address', 'Phone number'].map((label, index) => (
                <div key={label} className="mb-2.5"><div className="mb-1 text-[7px] font-bold text-neutral-500">{label}</div><div className="h-7 rounded-md border border-neutral-200 bg-white px-2 py-2 text-[8px] text-neutral-700">{['John Doe', 'Product Designer', 'john@example.com', '+91 98765 43210'][index]}</div></div>
              ))}
              <div className="mt-4 flex justify-end"><span className="rounded-md bg-orange-500 px-3 py-1.5 text-[8px] font-bold text-white">Continue →</span></div>
            </div>
            <div className="relative flex items-start justify-center rounded-xl border border-neutral-200 bg-neutral-100 p-2.5 sm:p-3">
              <div className="w-full bg-white p-3 shadow-md sm:p-4"><div className="border-b border-neutral-200 pb-3"><div className="text-[13px] font-black tracking-tight text-neutral-900">JOHN DOE</div><div className="mt-0.5 text-[6px] font-bold tracking-widest text-orange-600">PRODUCT DESIGNER</div><div className="mt-1 text-[5.5px] text-neutral-400">john@example.com · +91 98765 43210</div></div>{['EXPERIENCE', 'EDUCATION', 'SKILLS'].map((section) => <div key={section} className="mt-3"><div className="text-[6px] font-black tracking-widest text-neutral-800">{section}</div><div className="mt-1 h-1 rounded bg-neutral-100" /><div className="mt-1 h-1 w-4/5 rounded bg-neutral-100" /><div className="mt-1 h-1 w-3/5 rounded bg-neutral-100" /></div>)}</div>
              <div className="absolute -right-3 top-8 hidden rounded-xl border border-white bg-white/95 px-3 py-2 shadow-lg backdrop-blur sm:block"><div className="text-[9px] font-bold text-orange-600">ATS Perfect</div><div className="text-[8px] text-neutral-400">Resume ready</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-white">
      <SiteHeader />
      <main>
        <section className="gradient-mesh-bg relative overflow-hidden border-b border-black/[0.05]">
          <div className="hero-grid pointer-events-none absolute inset-0" />
          <div className="absolute left-[8%] top-32 h-32 w-32 rounded-full bg-orange-300/10 blur-3xl animate-float" />
          <div className="absolute right-[7%] top-24 h-40 w-40 rounded-full bg-orange-200/10 blur-3xl animate-float-slow" />
          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/78 px-3.5 py-1.5 text-[11px] font-bold text-neutral-600 shadow-sm backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-orange-500" /> AI-powered resume builder · built for modern job applications</div>
              <TypingHeadline />
              <p className="animate-fade-in-up reveal-2 mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">Write faster, design better and apply with confidence. Orrica Edge combines AI writing, ATS-ready templates, live preview and clean PDF export in one focused workspace.</p>
              <div className="animate-fade-in-up reveal-3 mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/resume/new"><Button size="lg" className="h-12 w-full rounded-xl bg-orange-500 px-6 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 sm:w-auto">Create my resume <ArrowRight className="ml-1 h-4 w-4" /></Button></Link><Link href="/templates"><Button size="lg" variant="outline" className="h-12 w-full rounded-xl border-orange-200 bg-white/82 px-6 text-sm font-bold text-orange-700 hover:bg-orange-50 sm:w-auto">Explore templates</Button></Link></div>
              <div className="animate-fade-in-up reveal-3 mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-neutral-400"><span>✓ Free to start</span><span>✓ AI is optional</span><span>✓ Live A4 preview</span><span>✓ PDF export</span></div>
            </div>
            <div className="mt-14 sm:mt-20"><ProductPreview /></div>
            <div className="animate-fade-in-up reveal-5 mx-auto mt-12 max-w-4xl rounded-2xl border border-black/[0.07] bg-white/60 p-2 shadow-sm backdrop-blur"><div className="grid grid-cols-2 divide-x divide-y divide-black/[0.07] sm:grid-cols-4 sm:divide-y-0"><div className="p-4 text-center"><div className="text-xl font-bold text-neutral-950">10</div><div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-neutral-400">Templates</div></div><div className="p-4 text-center"><div className="text-xl font-bold text-neutral-950">AI</div><div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-neutral-400">Writing tools</div></div><div className="p-4 text-center"><div className="text-xl font-bold text-neutral-950">A4</div><div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-neutral-400">Live preview</div></div><div className="p-4 text-center"><div className="text-xl font-bold text-neutral-950">PDF</div><div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-neutral-400">Ready export</div></div></div></div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">A better resume workflow</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl">Everything important. Nothing noisy.</h2><p className="mt-4 text-base leading-7 text-neutral-500">Orrica Edge is designed around strong content, clear structure, good design and a resume you can confidently send.</p></div><div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">{FEATURES.map((feature, index) => <div key={feature.title} className={`group bg-white p-7 hover:bg-neutral-50 hover-lift animate-fade-in-up reveal-${Math.min(index + 1, 6)}`}><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-50 group-hover:text-orange-600"><feature.icon className="h-5 w-5" /></div><h3 className="mt-5 text-sm font-bold text-neutral-950">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-neutral-500">{feature.desc}</p></div>)}</div></div></section>

        <section className="border-y border-black/[0.06] bg-neutral-50 py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Why Orrica Edge</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl">A resume builder that respects your time.</h2></div><p className="max-w-2xl text-sm leading-7 text-neutral-500 lg:justify-self-end">No endless formatting battles. No pressure to accept AI output. Just a focused workspace that helps you turn your real experience into a polished application.</p></div><div className="mt-12 grid gap-4 lg:grid-cols-12"><div className="hover-lift relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-7 lg:col-span-7"><div className="absolute right-[-20px] top-[-20px] h-36 w-36 rounded-full bg-orange-500/10 blur-3xl"/><div className="relative"><div className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Built around real work</div><h3 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">One focused workspace from first draft to PDF.</h3><div className="mt-7 space-y-4">{[['01','Start with your story'],['02','Make every line stronger'],['03','Shape the design'],['04','Export and apply']].map(([n,t]) => <div key={n} className="flex gap-4"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[10px] font-bold text-orange-700">{n}</div><div><div className="text-sm font-bold text-neutral-900">{t}</div><div className="mt-1 text-sm leading-6 text-neutral-500">A guided step that keeps the process simple and focused.</div></div></div>)}</div></div></div><div className="hover-lift rounded-3xl bg-neutral-950 p-7 text-white lg:col-span-5"><div className="text-xs font-black uppercase tracking-[0.18em] text-orange-300">Designed for confidence</div><h3 className="mt-3 text-2xl font-semibold tracking-tight">Your story stays yours.</h3><p className="mt-3 text-sm leading-6 text-white/60">Every AI feature works from the information you provide. You stay in control of the final wording, layout and application.</p><div className="mt-8 grid grid-cols-2 gap-3">{[['AI','Optional'],['A4','Live preview'],['PDF','Ready to send'],['ATS','Text-first']].map(([a,b]) => <div key={a} className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="text-lg font-bold text-white">{a}</div><div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/40">{b}</div></div>)}</div></div></div></div></section>

        <section className="py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-start"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Popular templates</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl">Choose a visual style that fits the role.</h2><p className="mt-4 text-sm leading-7 text-neutral-500">Start from a clean structure, then make it yours with typography, spacing and color controls.</p><Link href="/templates" className="mt-6 inline-flex items-center text-sm font-bold text-orange-600 hover:text-orange-700">View all templates <ArrowRight className="ml-1 h-4 w-4"/></Link></div><div className="grid gap-4 sm:grid-cols-2">{TEMPLATE_LIST.slice(0,4).map((template) => <SampleResumeCard key={template.id} template={template} />)}</div></div></div></section>

        <section id="faq" className="border-y border-black/[0.06] bg-neutral-50 py-20 sm:py-28"><div className="mx-auto max-w-5xl px-5 lg:px-8"><div className="text-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">FAQ</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl">Questions, answered clearly.</h2></div><div className="mt-10 divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 bg-white">{FAQS.map(([question, answer]) => <details key={question} className="group px-5 py-5 sm:px-7"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-neutral-900"><span>{question}</span><ChevronDown className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-180" /></summary><p className="mt-3 max-w-3xl pr-8 text-sm leading-6 text-neutral-500">{answer}</p></details>)}</div></div></section>

        <section className="py-20 sm:py-28"><div className="mx-auto max-w-5xl px-5 lg:px-8"><div className="relative overflow-hidden rounded-[32px] bg-orange-500 px-6 py-14 text-center text-white shadow-[0_35px_90px_-50px_rgba(249,115,22,.7)] sm:px-12 sm:py-20"><div className="absolute left-1/2 top-[-80px] h-60 w-60 -translate-x-1/2 rounded-full bg-white/10 blur-3xl"/><div className="relative"><h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Ready to build a resume you can send?</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">Start with your real experience, improve what matters and export a clean A4 resume when it is ready.</p><Link href="/resume/new" className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-orange-700 shadow-lg shadow-orange-950/10 transition-transform hover:-translate-y-0.5">Create my resume <ArrowRight className="ml-1 h-4 w-4"/></Link></div></div></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
