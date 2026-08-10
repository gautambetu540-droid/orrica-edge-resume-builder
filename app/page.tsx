import Link from 'next/link';
import {
  Sparkles,
  Target,
  Layers,
  Eye,
  Pencil,
  Download,
  ChevronRight,
  Zap,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SampleResumeCard } from '@/components/landing/SampleResumeCard';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { TEMPLATE_LIST } from '@/lib/templates/presets';

const FEATURES = [
  { icon: Sparkles, title: 'AI Resume Writer', desc: 'Generate polished summaries and achievement bullets from your real experience — nothing invented.' },
  { icon: Target, title: 'ATS Optimization', desc: 'Match your resume against any job description and see exactly what to improve.' },
  { icon: Layers, title: '10 Professional Templates', desc: 'Recruiter-approved layouts, each tuned for print, PDF, and ATS parsing.' },
  { icon: Eye, title: 'Live Resume Preview', desc: 'Every edit updates your resume instantly, on any screen size.' },
  { icon: Pencil, title: 'Easy Editing', desc: 'Full manual control over every section, field, and layout choice.' },
  { icon: Download, title: 'One-Click PDF Download', desc: 'Export a print-ready, properly formatted PDF in seconds.' },
];

const STEPS = [
  { n: '01', title: 'Enter Your Information', desc: 'Fill in your background at your own pace — skip anything optional.' },
  { n: '02', title: 'Let AI Improve Your Resume', desc: 'Generate a summary and strong bullet points grounded in your real experience.' },
  { n: '03', title: 'Customize Your Design', desc: 'Pick a template, fonts, spacing, and accent color that fit you.' },
  { n: '04', title: 'Download PDF', desc: 'Export a clean, ATS-friendly PDF ready to send.' },
];

const FAQS = [
  { q: 'Will AI make up experience I don\u2019t have?', a: 'No. Orrica Edge only rewrites and organizes what you actually enter — it never invents companies, dates, degrees, or metrics.' },
  { q: 'Is the output actually ATS-friendly?', a: 'Yes. Every template uses standard section headings and text-based layout so applicant tracking systems can parse it correctly.' },
  { q: 'Can I use this without creating an account?', a: 'You can build your entire resume first — we only ask you to sign up when you\u2019re ready to save it or download the PDF.' },
  { q: 'Can I make more than one resume?', a: 'Yes. Each account can create up to 2 new resumes per day. Your saved resumes remain in your dashboard and My Activity.' },
  { q: 'How many templates are there?', a: 'Ten distinct templates across single-column and sidebar layouts, from minimal and ATS-safe to bold and creative.' },
  { q: 'Is my data private?', a: 'Your resumes are stored under your account with row-level security — only you can access them.' },
];

const TRUST_STATS = [
  { value: '10', label: 'Resume Templates' },
  { value: '6', label: 'AI Writing Tools' },
  { value: '100%', label: 'ATS-Friendly Output' },
  { value: '0', label: 'Invented Facts' },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white overflow-x-hidden">
      <SiteHeader />

      {/* Hero */}
      <section className="relative gradient-mesh-bg">
        <div className="absolute top-24 -left-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute top-40 -right-10 h-72 w-72 rounded-full bg-[hsl(var(--brand-orange))]/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-6xl mx-auto px-4 pt-14 pb-16 sm:pt-20 sm:pb-28 grid lg:grid-cols-2 gap-10 items-center relative">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white shadow-sm border border-primary/10 text-primary px-3 py-1.5 rounded-full mb-5">
              <Sparkles className="h-3.5 w-3.5" /> Build a Better Resume. Get Hired Faster.
            </span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
              Build Your <span className="text-gradient-brand animate-gradient-x">Professional Resume</span> with AI
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Create, customize and optimize a professional ATS-friendly resume in minutes — with 10 premium templates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/resume/new">
                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                  Create My Resume <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Templates
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">No credit card required · Free to start</p>

            <div className="hidden lg:grid grid-cols-4 gap-4 mt-12 max-w-md">
              {TRUST_STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-gradient-brand">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-transparent to-[hsl(var(--brand-orange))]/20 rounded-[2rem] blur-2xl" />
            <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl border shadow-2xl shadow-primary/10 overflow-hidden bg-white animate-float" style={{ animationDuration: '7s' }}>
              <SampleResumeCard accent="hsl(21, 75%, 52%)" scoreBadge />
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar mobile */}
      <div className="lg:hidden border-y bg-secondary/40">
        <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-4 gap-3 text-center">
          {TRUST_STATS.map((s) => (
            <div key={s.label}>
              <div className="text-xl font-bold text-primary">{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">Everything you need to land the interview</h2>
            <p className="text-muted-foreground">A complete, premium toolkit — not just a text editor with a preview pane.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group relative bg-white rounded-2xl border p-6 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--brand-orange))] text-white flex items-center justify-center mb-4 shadow-md shadow-primary/20 group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-gradient-to-b from-secondary/50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-14">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-6 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-12 w-12 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center font-bold mb-4 relative z-10">
                  {s.n}
                </div>
                <h3 className="font-semibold mb-1.5">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-3">
            <div>
              <h2 className="text-2xl sm:text-4xl font-bold mb-2">10 Premium Templates</h2>
              <p className="text-muted-foreground">Every template is a real, distinct layout — not a recolor.</p>
            </div>
            <Link href="/templates" className="text-sm font-medium text-primary flex items-center gap-1 shrink-0">
              View all templates <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {TEMPLATE_LIST.map((t, i) => (
              <div key={t.id} className="bg-white rounded-xl border overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="aspect-[3/4] relative">
                  <SampleResumeCard accent={t.defaultAccentColor} layout={t.layout} compact />
                  <Link
                    href="/resume/new"
                    className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                      Use this template
                    </span>
                  </Link>
                </div>
                <p className="text-xs font-medium p-2.5 border-t">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATS + trust badges */}
      <section className="py-16 sm:py-24 bg-secondary/40">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-[hsl(var(--brand-orange))] text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/20">
            <Target className="h-7 w-7" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">Built to pass ATS screening</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            Most companies filter resumes through an Applicant Tracking System before a human ever sees them. Orrica Edge
            uses clean, text-based layouts and lets you match your resume against any job description — so you can see
            your ATS score and close the gap before you apply.
          </p>
          <div className="grid sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
            {[
              { icon: Zap, label: 'Instant AI Rewrites' },
              { icon: ShieldCheck, label: 'Private & Secure' },
              { icon: Smartphone, label: 'Fully Mobile Ready' },
            ].map((b) => (
              <div key={b.label} className="bg-white rounded-xl border p-4 flex flex-col items-center gap-2">
                <b.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="bg-white rounded-xl border p-4 group open:shadow-md open:border-primary/20 transition-all">
                <summary className="font-medium cursor-pointer flex items-center justify-between list-none">
                  {f.q}
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90 text-primary" />
                </summary>
                <p className="text-sm text-muted-foreground mt-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <div className="absolute inset-x-0 -top-6 h-40 bg-gradient-to-r from-primary/10 via-[hsl(var(--brand-orange))]/10 to-primary/10 blur-3xl -z-10" />
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">Create Your Resume Free</h2>
          <p className="text-muted-foreground mb-7">No credit card required. Start building in under a minute.</p>
          <Link href="/resume/new">
            <Button size="lg" className="shadow-lg shadow-primary/20">
              Create My Resume <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
