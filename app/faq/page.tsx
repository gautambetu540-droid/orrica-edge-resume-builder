import type { Metadata } from 'next';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

export const metadata: Metadata = {
  title: 'Orrica Edge Resume FAQ | AI Resume Builder & ATS Resume Maker',
  description: 'Find answers about the Orrica Edge AI Resume Builder, ATS-friendly resume creation, professional resume templates, AI writing assistance, live A4 preview and PDF export.',
  keywords: ['Orrica Edge Resume', 'Orrica Edge Resume Builder', 'AI resume builder', 'ATS resume builder', 'ATS-friendly resume maker', 'professional resume templates', 'resume PDF maker', 'resume builder for freshers'],
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Orrica Edge Resume FAQ | AI Resume Builder & ATS Resume Maker',
    description: 'Learn how Orrica Edge Resume helps you create, edit, preview and export a professional ATS-friendly resume with optional AI assistance.',
    type: 'website',
  },
};

const faqs = [
  ['What is Orrica Edge Resume?', 'Orrica Edge Resume is an AI-assisted online resume builder designed to help job seekers create professional, ATS-friendly resumes. It combines guided editing, structured resume sections, professional templates, optional AI writing assistance, live A4 preview and PDF export in one workflow.'],
  ['How does the Orrica Edge AI Resume Builder work?', 'You add your real career information, choose a professional resume template and edit your resume through the guided builder. Optional AI assistance can help improve summaries and experience wording, while the live preview lets you review the final layout before exporting your resume as a PDF.'],
  ['Can I create an ATS-friendly resume with Orrica Edge?', 'Yes. Orrica Edge Resume uses clear sections, readable hierarchy and structured layouts designed to make important information easier to scan. For the best results, use relevant job titles, skills and qualifications naturally and tailor your resume to the target job description.'],
  ['Can freshers and experienced professionals use Orrica Edge Resume?', 'Yes. Freshers can highlight education, internships, academic projects, skills, certifications and achievements. Experienced professionals can organize career history, responsibilities, measurable achievements, technical skills, leadership experience and professional qualifications.'],
  ['Can I use Orrica Edge Resume without AI?', 'Yes. AI is optional. You can manually create and edit your contact details, professional summary, work experience, education, skills, projects, certifications, languages and other relevant resume sections.'],
  ['Can I preview and download my resume as a PDF?', 'Yes. The live A4 preview helps you check spacing, page flow, section hierarchy and overall formatting while editing. When the resume is ready, you can export the completed version as a PDF and review it once more before submitting it to employers.'],
  ['How can I make my resume more ATS-friendly?', 'Use a clear professional title, relevant skills, accurate job-specific keywords and measurable achievements. Keep the formatting readable, avoid keyword stuffing and make sure every statement accurately represents your real experience and qualifications.'],
  ['Does Orrica Edge guarantee an interview or job?', 'No. Orrica Edge is a resume-building and career-support tool. A resume created with the platform does not guarantee interviews, job offers, employment, salary or selection. Always review your final resume for accuracy and tailor it to each opportunity.'],
];

export default function FAQPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <SiteHeader />
      <main>
        <section className="border-b border-[#F0F0F0] bg-[#E0F3F2]">
          <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6E46AE]">Orrica Edge Resume</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.045em] sm:text-6xl">Frequently Asked Questions</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-700 sm:text-lg">Find practical answers about the Orrica Edge AI Resume Builder, ATS-friendly resume creation, professional resume templates, AI writing assistance, live resume preview and PDF export.</p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-12 sm:py-20">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Orrica Edge Resume Builder FAQ</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">Whether you are a fresher, an experienced professional or preparing for your next job application, these answers explain the core Orrica Edge Resume features and how to use them effectively.</p>
          </div>

          <div className="divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_-45px_rgba(16,24,40,.4)]">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group px-5 py-5 sm:px-7 sm:py-6">
                <summary className="cursor-pointer list-none pr-8 text-base font-bold text-neutral-900 marker:hidden sm:text-lg">{question}</summary>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-neutral-600 sm:text-base">{answer}</p>
              </details>
            ))}
          </div>

          <section className="mt-10 rounded-3xl border border-[#F0F0F0] bg-[#E9E7F7] p-7 sm:p-9">
            <h2 className="text-2xl font-bold">Ready to build your resume?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-700">Create your professional resume with Orrica Edge Resume, review it in the live A4 preview and export a PDF when your content and formatting are ready.</p>
            <a href="/resume/new" className="mt-6 inline-flex items-center rounded-xl bg-[#6E46AE] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5d389c]">Create your resume</a>
          </section>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </main>
      <SiteFooter />
    </div>
  );
}
