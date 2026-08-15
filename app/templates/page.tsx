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

export default function TemplatesPage() {
  return (
    <div className="min-h-dvh bg-[#fffaf6] text-[#111111]">
      <SiteHeader />
      <main className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="mx-auto max-w-6xl rounded-[32px] border border-[#eee5de] bg-[#fffaf6] px-3 py-10 sm:px-8 sm:py-14 lg:px-10">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#f1cdbb] bg-[#fbefe8] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#C95F2D]"><Sparkles className="h-3.5 w-3.5" /> Professional resume templates</div>
            <h1 className="mt-5 font-[700] tracking-[-0.055em] text-[#111111] text-4xl sm:text-5xl lg:text-[58px] lg:leading-[1.03]">Professional Resume Templates</h1>
            <p className="mx-auto mt-5 max-w-4xl text-[15px] leading-7 text-[#666666] sm:text-lg">Choose an ATS-friendly, recruiter-ready design and build a polished, job-ready resume for the role you want.</p>
          </div>

          <TemplatesGallery />
        </section>

        <section className="mx-auto mt-8 max-w-6xl border-t border-[#e8ddd5] pt-7 pb-2">
          <div className="grid gap-5 md:grid-cols-4 md:divide-x md:divide-[#e8ddd5]">
            {[
              ['🎓', 'Fresh Graduate', 'Perfect for students and freshers entering the professional world.'],
              ['💼', 'Campus Ready', 'Stand out in campus placements with recruiter-focused designs.'],
              ['◉', 'First Job ATS', 'ATS-friendly templates for your first professional opportunity.'],
              ['☆', 'Entry-Level Modern', 'Modern layouts to highlight your skills and potential.'],
            ].map(([icon, title, text]) => (
              <div key={title} className="flex items-start gap-3 px-1 md:px-6 first:pl-0 last:pr-0">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fbefe8] text-lg text-[#C95F2D]">{icon}</span>
                <div>
                  <h2 className="text-base font-bold text-[#111111]">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-[#666666]">{text}</p>
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
