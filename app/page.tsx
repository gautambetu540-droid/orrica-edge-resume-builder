'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, Download, Eye, Layers3, PencilLine, Sparkles, Star, Target, WandSparkles } from 'lucide-react';
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
        if (index === 0) deleting = false;
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
      <div className="absolute -right-4 top-16 z-10 hidden animate-float rounded-2xl border border-white/80 bg-white/92 px-4 py-3 shadow-xl backdrop-blur sm:block"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Check className="h-4 w-4" /></span><div><div className="text-[11px] font-bold text-neutral-900">ATS-ready structure</div><div className="text-[9px] text-neutral-400">Built into the workflow</div></div></div></div>
      <div className="absolute -left-5 bottom-12 z-10 hidden animate-float-slow rounded-2xl border border-white/80 bg-white/92 px-4 py-3 shadow-xl backdrop-blur sm:block"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Sparkles className="h-4 w-4" /></span><div><div className="text-[11px] font-bold text-neutral-900">AI writing assistant</div><div className="text-[9px] text-neutral-400">Improve without inventing</div></div></div></div>
      <div className="relative overflow-hidden rounded-[30px] border border-orange-100/70 bg-white shadow-[0_48px_120px_-54px_rgba(15,23,42,.45)]">
        <div className="flex h-12 items-center justify-between border-b border-neutral-100 bg-white px-4 sm:px-5"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neutral-300" /><span className="h-2 w-2 rounded-full bg-neutral-300" /><span className="h-2 w-2 rounded-full bg-neutral-300" /><span className="ml-2 text-[11px] font-semibold text-neutral-500">Orrica Edge · Resume Builder</span></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">Saved</span></div>
        <div className="grid min-h-[470px] grid-cols-[132px_1fr] bg-neutral-50 sm:grid-cols-[170px_1fr]"><aside className="border-r border-neutral-100 bg-white p-3 sm:p-4"><div className="mb-4 px-2 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-400">Resume sections</div>{['Personal','Experience','Education','Skills','Projects','Summary'].map((item,index)=><div key={item} className={`mb-1 flex items-center gap-2 rounded-lg px-2 py-2 text-[9px] font-semibold ${index===0?'bg-orange-50 text-orange-700':'text-neutral-500'}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full text-[7px] ${index===0?'bg-orange-500 text-white':'bg-neutral-100'}`}>{index===0?'✓':index+1}</span>{item}</div>)}<div className="mt-5 border-t border-neutral-100 pt-4"><div className="px-2 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-400">Tools</div><div className="mt-2 rounded-lg border border-orange-100 bg-orange-50/60 px-2 py-2 text-[9px] font-semibold text-orange-700">✦ Improve with AI</div></div></aside><div className="grid grid-cols-[1fr_.82fr] gap-3 p-3 sm:gap-4 sm:p-4"><div className="rounded-xl border border-neutral-100 bg-white p-3.5 shadow-sm sm:p-4"><div className="mb-4"><div className="text-sm font-bold text-neutral-900 sm:text-base">Personal information</div><div className="mt-1 text-[8px] text-neutral-400">Start with the details recruiters need.</div></div>{['Full name','Professional title','Email address','Phone number'].map((label,index)=><div key={label} className="mb-2.5"><div className="mb-1 text-[7px] font-bold text-neutral-500">{label}</div><div className="h-7 rounded-md border border-neutral-200 bg-white px-2 py-2 text-[8px] text-neutral-700">{['John Doe','Product Designer','john@example.com','+91 98765 43210'][index]}</div></div>)}<div className="mt-4 flex justify-end"><span className="rounded-md bg-orange-500 px-3 py-1.5 text-[8px] font-bold text-white">Continue →</span></div></div><div className="relative flex items-start justify-center rounded-xl border border-neutral-200 bg-neutral-100 p-2.5 sm:p-3"><div className="w-full bg-white p-3 shadow-md sm:p-4"><div className="border-b border-neutral-200 pb-3"><div className="text-[13px] font-black tracking-tight text-neutral-900">JOHN DOE</div><div className="mt-0.5 text-[6px] font-bold tracking-widest text-orange-600">PRODUCT DESIGNER</div><div className="mt-1 text-[5.5px] text-neutral-400">john@example.com · +91 98765 43210</div></div>{['EXPERIENCE','EDUCATION','SKILLS'].map(section=><div key={section} className="mt-3"><div className="text-[6px] font-black tracking-widest text-neutral-800">{section}</div><div className="mt-1 h-1 rounded bg-neutral-100"/><div className="mt-1 h-1 w-4/5 rounded bg-neutral-100"/><div className="mt-1 h-1 w-3/5 rounded bg-neutral-100"/></div>)}</div><div className="absolute -right-3 top-8 hidden rounded-xl border border-white bg-white/95 px-3 py-2 shadow-lg backdrop-blur sm:block"><div className="text-[9px] font-bold text-orange-600">ATS Perfect</div><div className="text-[8px] text-neutral-400">Resume ready</div></div></div></div></div>
      </div>
    </div>
  );
}

function CandidateFeedbackSection() {
  const [items, setItems] = useState<Array<{ id: string; rating: number; feedback: string }>>([]);

  useEffect(() => {
    fetch('/api/feedback/public', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : { feedback: [] })
      .then((payload) => setItems(payload.feedback ?? []))
      .catch(() => setItems([]));
  }, []);

  return (
    <section id="feedback" className="border-y border-black/[0.06] bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-orange-700"><Sparkles className="h-3.5 w-3.5" /> Candidate feedback</div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl">What candidates say after building their resume.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">Real feedback from candidates helps us keep the experience faster, clearer and more useful.</p>
        </div>
        {items.length > 0 ? (
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-[0_24px_60px_-35px_rgba(15,23,42,.35)]">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                <div className="relative">
                  <div className="flex items-center gap-1" aria-label={`${item.rating} out of 5 stars`}>{Array.from({ length: 5 }).map((_, index) => <Star key={index} className={`h-4 w-4 ${index < item.rating ? 'fill-orange-400 text-orange-400' : 'text-neutral-200'}`} />)}</div>
                  <div className="mt-5 text-3xl leading-none text-orange-400">“</div>
                  <p className="mt-1 text-[15px] leading-7 text-neutral-700">{item.feedback}</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-neutral-200 pt-4"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-xs font-bold text-white">C</div><div><div className="text-xs font-bold text-neutral-900">Candidate feedback</div><div className="text-[10px] text-neutral-400">Shared after PDF download</div></div></div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-4xl rounded-[28px] border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm"><Star className="h-6 w-6" /></div>
            <h3 className="mt-5 text-lg font-bold text-neutral-950">Your feedback can be featured here.</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-500">Once candidates share feedback after downloading their resumes, selected reviews will appear here.</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-neutral-500 shadow-sm"><span className="h-2 w-2 rounded-full bg-orange-500" /> We listen. We improve. We keep building.</div>
          </div>
        )}
      </div>
    </section>
  );
}

function TemplateShowcase() {
  const templates = TEMPLATE_LIST.slice(0, 7);

  const scroll = (direction: number) => {
    const element = document.getElementById('oe-template-carousel');
    element?.scrollBy({ left: direction * 360, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#0b2a52] py-10 text-white sm:py-14 lg:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.06),transparent_42%)]" />
      <div className="relative mx-auto max-w-[1540px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[820px] text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/85"><Sparkles className="h-3.5 w-3.5" /> Orrica Edge template library</div>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-[-0.025em] sm:text-4xl lg:text-[48px] lg:leading-tight">Professional Resume Templates</h2>
          <p className="mx-auto mt-3 max-w-[700px] text-sm font-medium leading-6 text-white/80 sm:text-[15px]">Choose an ATS-ready design, preview the hierarchy, and start customizing in one click.</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-white/75 sm:text-xs">
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">ATS-ready</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">A4 proportions</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1">Customizable</span>
          </div>
        </div>

        <div className="relative mt-8 sm:mt-10">
          <button type="button" aria-label="Previous templates" onClick={() => scroll(-1)} className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl text-white shadow-xl backdrop-blur transition hover:scale-105 hover:bg-white/20 sm:flex">←</button>
          <button type="button" aria-label="Next templates" onClick={() => scroll(1)} className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl text-white shadow-xl backdrop-blur transition hover:scale-105 hover:bg-white/20 sm:flex">→</button>
          <div id="oe-template-carousel" className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5 sm:px-12">
            {templates.map((template) => (
              <article key={template.id} className="group min-w-[250px] snap-start sm:min-w-[285px] md:min-w-[300px] lg:min-w-[310px]">
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_22px_55px_-30px_rgba(0,0,0,.5)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_28px_70px_-30px_rgba(0,0,0,.65)]">
                  <div className="aspect-[0.73/1] overflow-hidden bg-neutral-100 p-2.5 sm:p-3">
                    <div className="h-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
                      <SampleResumeCard template={template} compact />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-neutral-100 bg-white px-3.5 py-3">
                    <div className="min-w-0"><h3 className="truncate text-sm font-bold text-neutral-950">{template.name}</h3><p className="mt-0.5 truncate text-[11px] text-neutral-500">{template.description}</p></div>
                    <Link href={`/resume/new?template=${template.id}`} className="shrink-0 rounded-lg bg-neutral-950 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-orange-600">Use template</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center"><Link href="/templates" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/15">View all templates <ArrowRight className="h-3.5 w-3.5" /></Link></div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <SiteHeader />
      <main>
        {/* Existing landing sections remain unchanged below this point. */}
        <TemplateShowcase />
        <CandidateFeedbackSection />
      </main>
      <SiteFooter />
    </div>
  );
}
