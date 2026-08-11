import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, Download, Eye, FileText, Layers3, PencilLine, ShieldCheck, Sparkles, Target, WandSparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SampleResumeCard } from '@/components/landing/SampleResumeCard';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { TEMPLATE_LIST } from '@/lib/templates/presets';

const FEATURES = [
  { icon: WandSparkles, title: 'AI writing that stays truthful', desc: 'Turn the experience you provide into sharper summaries and achievement-focused bullets without inventing facts.' },
  { icon: Target, title: 'ATS-ready structure', desc: 'Use clean, text-first layouts and compare your resume with a job description before you apply.' },
  { icon: Layers3, title: 'Distinct professional templates', desc: 'Choose a layout with a real visual identity, then fine-tune fonts, spacing, sections and color.' },
  { icon: Eye, title: 'Live A4 preview', desc: 'See how your resume reads while you edit it, before you ever export the PDF.' },
  { icon: PencilLine, title: 'You stay in control', desc: 'Edit every section yourself. AI is an assistant, not a replacement for your judgment.' },
  { icon: Download, title: 'Ready-to-send PDF', desc: 'Export a clean, print-ready resume when the content and design are ready.' },
];

const STEPS = [
  ['01', 'Start with your story', 'Add your contact details, experience, education, skills and the work you are proud of.'],
  ['02', 'Make every line stronger', 'Use AI to polish summaries and bullets while keeping your real experience at the center.'],
  ['03', 'Shape the design', 'Pick a template, adjust typography and spacing, then review the live A4 result.'],
  ['04', 'Export and apply', 'Download your finished PDF and use it for the opportunities that matter.'],
];

const FAQS = [
  ['What is Orrica Edge?', 'Orrica Edge is an AI-assisted resume builder that combines guided writing, ATS-ready layouts, live preview, design controls and PDF export in one workflow.'],
  ['Will the AI invent experience or achievements?', 'The product is designed to work from the information you provide. Treat every AI suggestion as a draft and review it before adding it to your resume.'],
  ['Can I build a resume without using AI?', 'Yes. AI is optional. You can write, edit and format every section manually and use the builder simply as a professional resume editor.'],
  ['What does ATS-friendly mean here?', 'The templates use structured, text-based resume layouts intended to keep important information easy for parsing systems and recruiters to find. No template can guarantee a particular ATS score or interview result.'],
  ['Can I see my resume while I edit it?', 'Yes. The editor uses a live A4 preview so changes to your content and design can be reviewed before exporting.'],
  ['Can I change fonts, colors and spacing?', 'Yes. The design controls let you change the template, font, typography scale, spacing, margins, accent color and visible sections.'],
  ['Can I download my resume as a PDF?', 'Yes. When your resume is ready, you can export a print-ready PDF from the builder.'],
  ['Is Orrica Edge free?', 'The current product is free to build and download. You can check the pricing page for the latest plan details.'],
];

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[700px] animate-scale-in reveal-4">
      <div className="absolute -inset-10 rounded-[48px] bg-orange-500/10 blur-3xl" />
      <div className="absolute -right-4 top-16 z-10 hidden animate-float rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:block">
        <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><Check className="h-4 w-4" /></span><div><div className="text-[11px] font-bold text-neutral-900">ATS-ready structure</div><div className="text-[9px] text-neutral-400">Built into the workflow</div></div></div>
      </div>
      <div className="absolute -left-5 bottom-12 z-10 hidden animate-float-slow rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:block">
        <div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Sparkles className="h-4 w-4" /></span><div><div className="text-[11px] font-bold text-neutral-900">AI writing assistant</div><div className="text-[9px] text-neutral-400">Improve without inventing</div></div></div>
      </div>
      <div className="relative overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-[0_45px_110px_-48px_rgba(15,23,42,.48)]">
        <div className="flex h-12 items-center justify-between border-b bg-white px-4 sm:px-5">
          <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neutral-300" /><span className="h-2 w-2 rounded-full bg-neutral-300" /><span className="h-2 w-2 rounded-full bg-neutral-300" /><span className="ml-2 text-[11px] font-semibold text-neutral-500">Orrica Edge · Resume Builder</span></div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">Saved</span>
        </div>
        <div className="grid min-h-[430px] grid-cols-[132px_1fr] bg-neutral-50 sm:grid-cols-[170px_1fr]">
          <aside className="border-r bg-white p-3 sm:p-4">
            <div className="mb-4 px-2 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-400">Resume sections</div>
            {['Personal', 'Experience', 'Education', 'Skills', 'Projects', 'Summary'].map((item, index) => <div key={item} className={`mb-1 flex items-center gap-2 rounded-lg px-2 py-2 text-[9px] font-semibold ${index === 0 ? 'bg-orange-50 text-orange-700' : 'text-neutral-500'}`}><span className={`flex h-5 w-5 items-center justify-center rounded-full text-[7px] ${index === 0 ? 'bg-orange-500 text-white' : 'bg-neutral-100'}`}>{index === 0 ? '✓' : index + 1}</span>{item}</div>)}
            <div className="mt-5 border-t pt-4"><div className="px-2 text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-400">Tools</div><div className="mt-2 rounded-lg border bg-neutral-50 px-2 py-2 text-[9px] font-semibold text-neutral-600">✦ Improve with AI</div></div>
          </aside>
          <div className="grid grid-cols-[1fr_.76fr] gap-3 p-3 sm:gap-4 sm:p-4">
            <div className="rounded-xl border bg-white p-3.5 shadow-sm sm:p-4">
              <div className="mb-4"><div className="text-sm font-bold text-neutral-900 sm:text-base">Personal information</div><div className="mt-1 text-[8px] text-neutral-400">Start with the details recruiters need.</div></div>
              {['Full name', 'Professional title', 'Email address', 'Phone number'].map((label, index) => <div key={label} className="mb-2.5"><div className="mb-1 text-[7px] font-bold text-neutral-500">{label}</div><div className="h-7 rounded-md border bg-white px-2 py-2 text-[8px] text-neutral-700">{['John Doe', 'Product Designer', 'john@example.com', '+91 98765 43210'][index]}</div></div>)}
              <div className="mt-4 flex justify-end"><span className="rounded-md bg-neutral-950 px-3 py-1.5 text-[8px] font-bold text-white">Continue →</span></div>
            </div>
            <div className="flex items-start justify-center rounded-xl border bg-neutral-100 p-2.5 sm:p-3"><div className="w-full bg-white p-3 shadow-md sm:p-4"><div className="border-b pb-3"><div className="text-[13px] font-black tracking-tight text-neutral-900">JOHN DOE</div><div className="mt-0.5 text-[6px] font-bold tracking-widest text-orange-600">PRODUCT DESIGNER</div><div className="mt-1 text-[5.5px] text-neutral-400">john@example.com · +91 98765 43210</div></div>{['EXPERIENCE', 'EDUCATION', 'SKILLS'].map((section) => <div key={section} className="mt-3"><div className="text-[6px] font-black tracking-widest text-neutral-800">{section}</div><div className="mt-1 h-1 rounded bg-neutral-100" /><div className="mt-1 h-1 w-4/5 rounded bg-neutral-100" /><div className="mt-1 h-1 w-3/5 rounded bg-neutral-100" /></div>)}</div></div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 to-transparent" />
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
          <div className="absolute right-[7%] top-24 h-40 w-40 rounded-full bg-blue-300/10 blur-3xl animate-float-slow" />
          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/75 px-3.5 py-1.5 text-[11px] font-bold text-neutral-600 shadow-sm backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-orange-500" /> AI-powered resume builder · built for modern job applications</div>
              <h1 className="animate-fade-in-up reveal-1 text-balance mt-6 text-4xl font-semibold tracking-[-0.055em] text-neutral-950 sm:text-6xl lg:text-[76px] lg:leading-[.98]">Build a resume that <span className="text-gradient-brand animate-gradient-x">gets remembered.</span></h1>
              <p className="animate-fade-in-up reveal-2 mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">Write faster, design better and apply with confidence. Orrica Edge combines AI writing, ATS-ready templates, live preview and clean PDF export in one focused workspace.</p>
              <div className="animate-fade-in-up reveal-3 mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/resume/new"><Button size="lg" className="h-12 w-full rounded-xl px-6 text-sm font-bold shadow-lg shadow-orange-500/20 sm:w-auto">Create my resume <ArrowRight className="ml-1 h-4 w-4" /></Button></Link><Link href="/templates"><Button size="lg" variant="outline" className="h-12 w-full rounded-xl border-neutral-200 bg-white/80 px-6 text-sm font-bold sm:w-auto">Explore templates</Button></Link></div>
              <div className="animate-fade-in-up reveal-3 mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-semibold text-neutral-400"><span>✓ Free to start</span><span>✓ AI is optional</span><span>✓ Live A4 preview</span><span>✓ PDF export</span></div>
            </div>
            <div className="mt-14 sm:mt-20"><ProductPreview /></div>
            <div className="animate-fade-in-up reveal-5 mx-auto mt-12 max-w-4xl rounded-2xl border border-black/[0.07] bg-white/60 p-2 shadow-sm backdrop-blur"><div className="grid grid-cols-2 divide-x divide-y divide-black/[0.07] sm:grid-cols-4 sm:divide-y-0"><div className="p-4 text-center"><div className="text-xl font-bold text-neutral-950">10</div><div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-neutral-400">Templates</div></div><div className="p-4 text-center"><div className="text-xl font-bold text-neutral-950">AI</div><div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-neutral-400">Writing tools</div></div><div className="p-4 text-center"><div className="text-xl font-bold text-neutral-950">A4</div><div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-neutral-400">Live preview</div></div><div className="p-4 text-center"><div className="text-xl font-bold text-neutral-950">PDF</div><div className="mt-1 text-[9px] font-bold uppercase tracking-widest text-neutral-400">Ready export</div></div></div></div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl"><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">A better resume workflow</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl">Everything important. Nothing noisy.</h2><p className="mt-4 text-base leading-7 text-neutral-500">Orrica Edge is designed around the work that actually matters: strong content, clear structure, good design and a resume you can confidently send.</p></div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">{FEATURES.map((feature, index) => <div key={feature.title} className={`group bg-white p-7 hover:bg-neutral-50 hover-lift animate-fade-in-up reveal-${Math.min(index + 1, 6)}`}><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-100 text-neutral-800 transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-50 group-hover:text-orange-600"><feature.icon className="h-5 w-5" /></div><h3 className="mt-5 text-sm font-bold text-neutral-950">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-neutral-500">{feature.desc}</p></div>)}</div>
          </div>
        </section>

        <section className="border-y border-black/[0.06] bg-neutral-50 py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Why Orrica Edge</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl">A resume builder that respects your time.</h2></div><p className="max-w-2xl text-sm leading-7 text-neutral-500 lg:justify-self-end">No endless formatting battles. No pressure to accept AI output. Just a guided workspace that helps you turn your real experience into a polished application.</p></div><div className="mt-12 grid gap-4 lg:grid-cols-12"><div className="hover-lift relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950 p-7 text-white lg:col-span-7"><div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" /><Zap className="relative h-6 w-6 text-orange-400" /><h3 className="relative mt-8 text-2xl font-semibold tracking-tight">From blank page to structured draft.</h3><p className="relative mt-3 max-w-lg text-sm leading-6 text-neutral-400">Guided sections keep you moving. AI helps when you are stuck. The live preview keeps the final result visible.</p><div className="relative mt-8 flex flex-wrap gap-2">{['Guided sections', 'AI assist', 'Live preview', 'PDF export'].map((x) => <span key={x} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-neutral-300">{x}</span>)}</div></div><div className="hover-lift rounded-3xl border border-neutral-200 bg-white p-7 lg:col-span-5"><ShieldCheck className="h-6 w-6 text-emerald-600" /><h3 className="mt-8 text-2xl font-semibold tracking-tight text-neutral-950">Truth first. Always.</h3><p className="mt-3 text-sm leading-6 text-neutral-500">Your resume is your professional record. Orrica Edge is built to polish the information you provide rather than encourage made-up achievements.</p><div className="mt-7 space-y-3">{['No invented employers', 'No fabricated metrics', 'You review every suggestion'].map((x) => <div key={x} className="flex items-center gap-2 text-sm font-semibold text-neutral-700"><Check className="h-4 w-4 text-emerald-600" />{x}</div>)}</div></div></div></div></section>

        <section id="how-it-works" className="py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">How it works</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl">Four steps. One polished resume.</h2></div><Link href="/resume/new" className="inline-flex items-center text-sm font-bold text-neutral-900 hover:text-orange-600">Start building <ArrowRight className="ml-2 h-4 w-4" /></Link></div><div className="mt-12 grid gap-4 lg:grid-cols-4">{STEPS.map(([number, title, description]) => <div key={number} className="hover-lift rounded-2xl border border-neutral-200 bg-white p-6"><div className="flex items-center justify-between"><span className="text-xs font-black text-orange-600">{number}</span><ArrowRight className="h-4 w-4 text-neutral-300" /></div><h3 className="mt-12 text-base font-bold text-neutral-950">{title}</h3><p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p></div>)}</div></div></section>

        <section className="border-y border-black/[0.06] bg-neutral-950 py-20 text-white sm:py-28"><div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-400">ATS-ready by design</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Make the important details easy to find.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-neutral-400">Clear hierarchy, structured sections and text-first templates help your resume stay readable for both screening software and human reviewers.</p><div className="mt-8 space-y-3">{['Structured contact information', 'Clear work experience hierarchy', 'Relevant skills and keywords', 'Consistent typography and spacing'].map((item) => <div key={item} className="flex items-center gap-3 text-sm font-medium text-neutral-200"><Check className="h-4 w-4 text-orange-400" />{item}</div>)}</div></div><div className="relative mx-auto w-full max-w-md animate-float"><div className="absolute -inset-6 rounded-3xl bg-orange-500/10 blur-3xl" /><div className="relative rounded-3xl border border-white/10 bg-white/5 p-3"><div className="rounded-2xl bg-white p-6 text-neutral-900 shadow-2xl"><div className="flex items-center justify-between border-b pb-5"><div><div className="text-3xl font-black">92</div><div className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Example readiness view</div></div><div className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700">Strong</div></div>{['Contact information', 'Work experience', 'Relevant keywords', 'Measurable achievements'].map((item, index) => <div key={item} className="flex items-center justify-between border-b py-3 last:border-0"><span className="text-xs text-neutral-600">{item}</span><span className={index === 3 ? 'text-amber-500' : 'text-emerald-600'}>{index === 3 ? '!' : '✓'}</span></div>)}</div></div></div></div></section>

        <section id="templates" className="py-20 sm:py-28"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">Templates</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl">Pick a look that feels like you.</h2><p className="mt-3 text-sm text-neutral-500">Ten distinct layouts, not ten color variations.</p></div><Link href="/templates" className="inline-flex items-center text-sm font-bold text-neutral-900 hover:text-orange-600">View all templates <ArrowRight className="ml-2 h-4 w-4" /></Link></div><div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{TEMPLATE_LIST.map((template) => <Link key={template.id} href="/resume/new" className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white hover-lift"><div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 p-2"><SampleResumeCard accent={template.defaultAccentColor} layout={template.layout} compact /><div className="absolute inset-x-2 bottom-2 translate-y-2 rounded-lg bg-neutral-950 px-3 py-2 text-center text-[10px] font-bold text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Use this template</div></div><div className="px-3 py-3 text-xs font-bold text-neutral-800">{template.name}</div></Link>)}</div></div></section>

        <section id="faq" className="border-y border-black/[0.06] bg-neutral-50 py-20 sm:py-28"><div className="mx-auto max-w-4xl px-5 lg:px-8"><div className="text-center"><p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">FAQ</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-5xl">Everything you wanted to know.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-500">Straight answers about AI, ATS compatibility, templates, privacy and exporting your resume.</p></div><div className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">{FAQS.map(([question, answer], index) => <details key={question} className="group border-b border-neutral-200 px-5 py-5 last:border-0 sm:px-7"><summary className="flex cursor-pointer list-none items-center gap-4 text-sm font-bold text-neutral-900 [&::-webkit-details-marker]:hidden"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-[10px] font-black text-neutral-400 transition-colors group-open:bg-orange-50 group-open:text-orange-600">{String(index + 1).padStart(2, '0')}</span><span className="flex-1">{question}</span><ChevronDown className="h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-300 group-open:rotate-180" /></summary><p className="ml-11 max-w-2xl pt-4 text-sm leading-7 text-neutral-500">{answer}</p></details>)}</div></div></section>

        <section className="px-5 pb-20 pt-20 sm:pb-28 sm:pt-28 lg:px-8"><div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-neutral-950 px-6 py-14 text-center text-white shadow-[0_35px_90px_-45px_rgba(15,23,42,.6)] sm:px-12"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400"><FileText className="h-6 w-6" /></div><h2 className="mt-6 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">Your next opportunity deserves a better first impression.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-neutral-400">Create your resume, strengthen the details that matter and let Orrica Edge handle the formatting.</p><Link href="/resume/new" className="mt-8 inline-block"><Button size="lg" className="h-12 rounded-xl bg-white px-6 font-bold text-neutral-950 hover:bg-neutral-100">Create my resume <ArrowRight className="ml-1 h-4 w-4" /></Button></Link></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
