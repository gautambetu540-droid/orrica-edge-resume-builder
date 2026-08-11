import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Download,
  Eye,
  FileText,
  Layers3,
  PencilLine,
  ShieldCheck,
  Sparkles,
  Target,
  WandSparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SampleResumeCard } from '@/components/landing/SampleResumeCard';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { TEMPLATE_LIST } from '@/lib/templates/presets';

const FEATURES = [
  { icon: WandSparkles, title: 'AI writing that stays truthful', desc: 'Turn your real experience into stronger summaries and achievement-focused bullets without inventing facts.' },
  { icon: Target, title: 'Built for ATS screening', desc: 'Use clean, text-based layouts and compare your resume with a job description before you apply.' },
  { icon: Layers3, title: 'Professional templates', desc: 'Choose from distinct layouts designed for modern hiring teams, print and PDF export.' },
  { icon: Eye, title: 'Live visual preview', desc: 'See your resume update as you type, with a clear A4 preview that stays close to the final PDF.' },
  { icon: PencilLine, title: 'Full control', desc: 'Edit every section, reorder content and tune the design without fighting a rigid template.' },
  { icon: Download, title: 'Ready-to-send PDF', desc: 'Export a clean, professional resume when it is ready — no screenshotting or manual formatting.' },
];

const STEPS = [
  ['01', 'Add your experience', 'Start with your basics and work history. Skip anything you do not need.'],
  ['02', 'Improve with AI', 'Generate sharper summaries and bullets grounded in the information you provide.'],
  ['03', 'Make it yours', 'Choose a template, adjust the design and review the live result.'],
  ['04', 'Download & apply', 'Export your finished resume as a professional PDF and start applying.'],
];

const TRUST = [
  ['10', 'Templates'],
  ['AI', 'Writing tools'],
  ['ATS', 'Friendly layouts'],
  ['PDF', 'Ready export'],
];

const FAQS = [
  ['Will AI invent experience?', 'No. The AI tools are designed to rewrite and organize the information you provide. Review every suggestion before using it.'],
  ['Can I edit everything myself?', 'Yes. AI is optional. You can manually edit every resume section and use the builder without accepting AI suggestions.'],
  ['Can I see my resume while editing?', 'Yes. The builder is designed around a live preview so you can see the visual result while you work.'],
  ['How many templates are available?', 'The product currently includes ten distinct templates across clean, ATS-focused and more expressive layouts.'],
  ['Can I download a PDF?', 'Yes. Once your resume is ready, you can export a print-ready PDF from the resume flow.'],
  ['Is my resume private?', 'Saved resumes are associated with your account and protected by the application data-access rules.'],
];

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[620px]">
      <div className="absolute -inset-8 rounded-[40px] bg-orange-500/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_30px_90px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex h-11 items-center justify-between border-b bg-white px-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-neutral-300" />
            <span className="h-2 w-2 rounded-full bg-neutral-300" />
            <span className="h-2 w-2 rounded-full bg-neutral-300" />
            <span className="ml-2 text-[11px] font-medium text-neutral-500">Resume Builder</span>
          </div>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Autosaved</span>
        </div>
        <div className="grid min-h-[430px] grid-cols-[150px_1fr] bg-neutral-50">
          <aside className="border-r bg-white p-3">
            <div className="mb-4 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-400">Your resume</div>
            {['Personal', 'Experience', 'Education', 'Skills', 'Projects', 'Summary'].map((item, index) => (
              <div key={item} className={`mb-1 flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10px] font-medium ${index === 0 ? 'bg-orange-50 text-orange-700' : 'text-neutral-500'}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[8px] ${index === 0 ? 'bg-orange-500 text-white' : 'bg-neutral-100'}`}>{index === 0 ? '✓' : index + 1}</span>
                {item}
              </div>
            ))}
            <div className="mt-5 border-t pt-4">
              <div className="px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-400">AI tools</div>
              <div className="mt-2 rounded-lg border bg-neutral-50 px-2.5 py-2 text-[10px] font-medium text-neutral-600">✦ Improve with AI</div>
            </div>
          </aside>
          <div className="grid grid-cols-[1fr_0.82fr] gap-4 p-4">
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="mb-5">
                <div className="text-[16px] font-bold text-neutral-900">Personal information</div>
                <div className="mt-1 text-[9px] text-neutral-400">Add the details recruiters need to contact you.</div>
              </div>
              {['Full name', 'Professional title', 'Email address', 'Phone number'].map((label, index) => (
                <div key={label} className="mb-3">
                  <div className="mb-1 text-[8px] font-semibold text-neutral-500">{label}</div>
                  <div className="h-7 rounded-md border bg-white px-2.5 py-2 text-[9px] text-neutral-700">{['John Doe', 'Product Designer', 'john@example.com', '+91 98765 43210'][index]}</div>
                </div>
              ))}
              <div className="mt-5 flex justify-end">
                <span className="rounded-md bg-neutral-900 px-3 py-1.5 text-[9px] font-semibold text-white">Continue →</span>
              </div>
            </div>
            <div className="flex items-start justify-center rounded-xl border bg-neutral-100 p-3">
              <div className="w-full bg-white p-4 shadow-md">
                <div className="border-b pb-3">
                  <div className="text-[14px] font-bold text-neutral-900">JOHN DOE</div>
                  <div className="mt-0.5 text-[7px] text-orange-600">PRODUCT DESIGNER</div>
                  <div className="mt-1 text-[6px] text-neutral-400">john@example.com · +91 98765 43210</div>
                </div>
                {['EXPERIENCE', 'EDUCATION', 'SKILLS'].map((section) => (
                  <div key={section} className="mt-3">
                    <div className="text-[7px] font-bold tracking-wider text-neutral-800">{section}</div>
                    <div className="mt-1 h-1 rounded bg-neutral-100" />
                    <div className="mt-1.5 h-1 w-4/5 rounded bg-neutral-100" />
                    <div className="mt-1 h-1 w-3/5 rounded bg-neutral-100" />
                  </div>
                ))}
              </div>
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
        <section className="gradient-mesh-bg relative border-b border-black/[0.05]">
          <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:pb-28 sm:pt-24 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold text-neutral-600 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                AI-powered resume builder
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-neutral-950 sm:text-6xl lg:text-[72px] lg:leading-[0.98]">
                Build a resume that looks <span className="text-gradient-brand">as good as your experience.</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">
                Create a professional, ATS-friendly resume with AI writing tools, modern templates and a live preview — without spending hours formatting it.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/resume/new">
                  <Button size="lg" className="h-12 w-full rounded-xl px-6 text-sm font-semibold shadow-lg shadow-orange-500/15 sm:w-auto">
                    Create my resume <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="outline" className="h-12 w-full rounded-xl border-neutral-200 bg-white px-6 text-sm font-semibold sm:w-auto">
                    Explore templates
                  </Button>
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-neutral-400">
                <span>✓ Free to start</span><span>✓ No credit card</span><span>✓ PDF export</span>
              </div>
            </div>

            <div className="mt-14 sm:mt-20">
              <ProductPreview />
            </div>

            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 border-y border-black/[0.07] py-6 sm:grid-cols-4">
              {TRUST.map(([value, label]) => (
                <div key={label} className="border-black/[0.07] px-4 text-center first:border-0 sm:border-l">
                  <div className="text-xl font-semibold tracking-tight text-neutral-950">{value}</div>
                  <div className="mt-1 text-[10px] font-medium uppercase tracking-wider text-neutral-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Everything in one place</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-5xl">Everything you need to make a stronger application.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-neutral-500">A focused toolkit for writing, designing and reviewing your resume — without the clutter of traditional resume builders.</p>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="group bg-white p-7 transition-colors hover:bg-neutral-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-800 transition-colors group-hover:bg-orange-50 group-hover:text-orange-600">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-sm font-semibold text-neutral-950">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-y border-black/[0.06] bg-neutral-50 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">How it works</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-5xl">From blank page to ready-to-send.</h2>
              </div>
              <Link href="/resume/new" className="inline-flex items-center text-sm font-semibold text-neutral-900 hover:text-orange-600">Start building <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-4">
              {STEPS.map(([number, title, description]) => (
                <div key={number} className="rounded-2xl border border-neutral-200 bg-white p-6">
                  <div className="text-xs font-bold text-orange-600">{number}</div>
                  <h3 className="mt-12 text-base font-semibold text-neutral-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">Templates</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-5xl">Pick a look that feels like you.</h2>
                <p className="mt-3 text-sm text-neutral-500">Ten distinct layouts, not ten color variations.</p>
              </div>
              <Link href="/templates" className="inline-flex items-center text-sm font-semibold text-neutral-900 hover:text-orange-600">View all templates <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {TEMPLATE_LIST.map((template) => (
                <Link key={template.id} href="/resume/new" className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl hover:shadow-black/5">
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 p-2">
                    <SampleResumeCard accent={template.defaultAccentColor} layout={template.layout} compact />
                    <div className="absolute inset-x-2 bottom-2 translate-y-2 rounded-lg bg-neutral-950 px-3 py-2 text-center text-[10px] font-semibold text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Use this template</div>
                  </div>
                  <div className="px-3 py-3 text-xs font-semibold text-neutral-800">{template.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-black/[0.06] bg-neutral-950 py-20 text-white sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">Built for the hiring process</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">Make the important details easy to find.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-400">Clean structure, strong hierarchy and ATS-friendly text keep your experience readable for both screening systems and recruiters.</p>
              <div className="mt-8 space-y-3">
                {['Clean, text-based layouts', 'AI suggestions grounded in your input', 'Live preview before PDF export'].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-neutral-200"><Check className="h-4 w-4 text-orange-400" />{item}</div>
                ))}
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl">
              <div className="rounded-xl bg-white p-5 text-neutral-900 shadow-2xl">
                <div className="flex items-center justify-between border-b pb-4">
                  <div><div className="text-2xl font-bold">92</div><div className="text-[10px] text-neutral-400">ATS readiness</div></div>
                  <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Strong</div>
                </div>
                {['Contact information', 'Work experience', 'Relevant keywords', 'Measurable achievements'].map((item, index) => (
                  <div key={item} className="flex items-center justify-between border-b py-3 last:border-0"><span className="text-xs text-neutral-600">{item}</span><span className={index === 3 ? 'text-amber-500' : 'text-emerald-600'}>{index === 3 ? '!' : '✓'}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-5xl">Questions, answered.</h2>
            </div>
            <div className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200">
              {FAQS.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold text-neutral-900">{question}<span className="text-xl font-normal text-neutral-400 transition-transform group-open:rotate-45">+</span></summary>
                  <p className="max-w-2xl pt-3 text-sm leading-6 text-neutral-500">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:pb-28 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-orange-50 px-6 py-14 text-center sm:px-12">
            <FileText className="mx-auto h-8 w-8 text-orange-600" />
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] text-neutral-950 sm:text-5xl">Your next opportunity starts with one page.</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-500">Create your resume, improve the details that matter and leave the formatting to us.</p>
            <Link href="/resume/new" className="mt-8 inline-block">
              <Button size="lg" className="h-12 rounded-xl px-6 font-semibold shadow-lg shadow-orange-500/15">Create my resume <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
