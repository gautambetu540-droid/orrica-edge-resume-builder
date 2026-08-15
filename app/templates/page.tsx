import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { TemplatesGallery } from '@/components/templates/TemplatesGallery';

export const metadata: Metadata = {
  title: 'Professional Resume Templates | ATS-Friendly Resume Designs | Orrica Edge',
  description: 'Explore 120 ATS-friendly resume templates for freshers, IT, BPO, finance, sales, marketing, HR, healthcare, creative, executive and professional roles. Customize fonts, colors, spacing and sections.',
  alternates: { canonical: '/templates' },
};

export default function TemplatesPage() {
  return (
    <div className="min-h-dvh bg-[#fbfaf9]">
      <SiteHeader />
      <main className="mx-auto max-w-[1500px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-orange-700"><Sparkles className="h-3.5 w-3.5" /> 120 professional resume templates</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-neutral-950 sm:text-5xl lg:text-6xl">Professional Resume Templates</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-neutral-500 sm:text-lg">Choose an ATS-friendly, recruiter-ready resume template designed for your career, experience level and target role. Every design is customizable and built for clean A4 output.</p>
        </div>
        <TemplatesGallery />
      </main>
      <SiteFooter />
    </div>
  );
}
