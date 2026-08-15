import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { TemplatesGallery } from '@/components/templates/TemplatesGallery';

export const metadata: Metadata = {
  title: 'Professional Resume Templates | ATS-Friendly Resume Designs | Orrica Edge',
  description: 'Explore ATS-friendly resume templates for freshers, IT, BPO, finance, sales, marketing, HR, healthcare, creative, executive and professional roles. Customize fonts, colors, spacing and sections.',
  alternates: { canonical: '/templates' },
};

const TEMPLATE_GROUPS = [
  ['Fresh Graduate', 'Perfect for students and freshers entering the professional world.', '🎓'],
  ['Campus Ready', 'Stand out in campus placements with recruiter-focused designs.', '💼'],
  ['First Job ATS', 'ATS-friendly templates for your first professional opportunity.', '◉'],
  ['Entry-Level Modern', 'Modern layouts to highlight your skills and potential.', '☆'],
] as const;

export default function TemplatesPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf6] text-[#111111]">
      <SiteHeader />
      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-[#eadfd7] bg-[linear-gradient(180deg,#fffaf6_0%,#fff7f1_100%)] px-4 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#f1cdbb] bg-[#fbefe8] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#C95F2D]"><Sparkles className="h-3.5 w-3.5" /> ATS-friendly templates</div>
            <h1 className="mt-5 font-[700] tracking-[-0.055em] text-[#111111] text-4xl sm:text-5xl lg:text-[58px] lg:leading-[1.03]">Professional Resume Templates</h1>
            <p className="mx-auto mt-5 max-w-4xl text-[15px] leading-7 text-[#666666] sm:text-lg">Choose an ATS-friendly, recruiter-ready design and build a polished, job-ready resume for the role you want.</p>
          </div>

          <TemplatesGallery />
        </section>

        <section className="mx-auto mt-8 max-w-6xl pb-2">
          <div className="grid gap-0 overflow-hidden rounded-[20px] border border-[#e8ddd5] bg-white shadow-[0_12px_35px_-28px_rgba(0,0,0,.18)] md:grid-cols-4 md:divide-x md:divide-[#e8ddd5]">
            {TEMPLATE_GROUPS.map(([title, text, icon]) => (
              <div key={title} className="flex min-h-[118px] items-start gap-4 px-5 py-6 sm:px-6 md:px-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fbefe8] text-xl text-[#C95F2D]" aria-hidden="true">{icon}</span>
                <div>
                  <h2 className="text-base font-bold text-[#111111]">{title}</h2>
                  <p className="mt-1.5 text-sm leading-6 text-[#666666]">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
