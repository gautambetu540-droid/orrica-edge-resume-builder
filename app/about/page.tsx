import { ShieldCheck, Sparkles, Target } from 'lucide-react';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

const VALUES = [
  { icon: ShieldCheck, title: 'No invented facts', desc: 'Our AI only ever rewrites what you actually tell it — never fabricated companies, dates, or metrics.' },
  { icon: Target, title: 'Built for ATS', desc: 'Every template is designed first for machine parsing, then for how it looks to a human recruiter.' },
  { icon: Sparkles, title: 'Fast, not flashy', desc: 'A resume builder should get out of your way. We focus on speed and clarity over gimmicks.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-white">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-5xl font-bold mb-5">About Orrica Edge</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Orrica Edge is an AI-assisted resume builder built on one simple idea: your resume should sound like the best
          version of you — using only what's actually true. We combine clean, ATS-tested templates with AI that
          organizes and polishes your real experience, so you can build a professional resume in minutes instead of
          hours.
        </p>

        <div className="grid sm:grid-cols-3 gap-5 mb-12">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-xl border p-5">
              <div className="h-10 w-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center mb-3">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-secondary/50 border p-6">
          <h2 className="font-semibold mb-1.5">Get in touch</h2>
          <p className="text-sm text-muted-foreground">
            Questions, feedback, or partnership ideas — reach the Orrica Edge team any time.
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
