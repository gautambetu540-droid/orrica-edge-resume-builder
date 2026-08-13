import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OrricaEdge Resume FAQ | AI Resume Builder & ATS Resume Maker',
  description: 'Find answers about OrricaEdge Resume, AI resume writing, ATS-friendly resume templates, PDF downloads, resume editing, privacy and professional resume creation.',
  keywords: ['OrricaEdge Resume', 'OrricaEdge Resume Builder', 'AI resume builder', 'ATS resume builder', 'resume maker', 'professional resume templates', 'resume PDF maker', 'free resume builder'],
  alternates: { canonical: '/faq' },
};

const faqs = [
  ['What is OrricaEdge Resume?', 'OrricaEdge Resume is an online resume builder that helps job seekers create professional, ATS-friendly resumes with guided editing, AI writing assistance, modern resume templates, live A4 preview and PDF export.'],
  ['Is OrricaEdge Resume an AI resume builder?', 'Yes. OrricaEdge Resume includes optional AI writing assistance for professional summaries, experience bullets and other resume sections. AI suggestions should always be reviewed and edited by the candidate before use.'],
  ['Can I create an ATS-friendly resume with OrricaEdge Resume?', 'Yes. OrricaEdge Resume uses clean, structured resume layouts designed to keep important candidate information readable and easy to scan.'],
  ['Can I build my resume without AI?', 'Yes. AI is optional. You can manually enter and edit your personal details, work experience, education, skills, projects, certifications, languages and professional summary.'],
  ['Can freshers use OrricaEdge Resume?', 'Yes. Freshers can use OrricaEdge Resume to organize education, internships, academic projects, skills, certifications and other relevant information into a professional resume.'],
  ['Can experienced professionals use OrricaEdge Resume?', 'Yes. Experienced professionals can structure their career history, achievements, responsibilities, skills and professional summary using OrricaEdge Resume.'],
  ['Can I choose a professional resume template?', 'Yes. OrricaEdge Resume provides professional resume layouts so you can choose a visual style that fits your career profile while keeping the content readable.'],
  ['Can I preview my resume before downloading it?', 'Yes. The live A4 preview lets you review your resume layout while editing your content, including how longer resumes flow across pages.'],
  ['Can I download my resume as a PDF?', 'Yes. OrricaEdge Resume supports PDF export so you can save a ready-to-send version of your completed resume.'],
  ['Can I edit my resume after creating it?', 'Yes. You can return to your resume and update your information, sections, wording and design before exporting the final PDF.'],
  ['Does OrricaEdge Resume help improve resume content?', 'Its AI writing tools can help make the information you provide clearer and more professional. They are designed to assist rather than replace your judgment, and you should never add claims that are not true.'],
  ['How should I choose keywords for an ATS-friendly resume?', 'Use relevant skills, job titles, tools, qualifications and terminology that accurately match the job description. Avoid keyword stuffing and keep every statement truthful and relevant.'],
  ['Is my resume suitable for job applications?', 'OrricaEdge Resume is designed to help you prepare a professional, readable resume for job applications. Always review the final PDF for accuracy, formatting and role-specific relevance before sending it.'],
  ['How does candidate feedback work?', 'After downloading a resume, candidates can rate their experience and share written feedback. Selected feedback can be displayed on the OrricaEdge Resume website to help improve the product experience.'],
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
    <main className="min-h-dvh bg-white text-neutral-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-orange-600">OrricaEdge Resume</p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-6xl">Frequently Asked Questions</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-600 sm:text-lg">Everything you need to know about building an ATS-friendly resume, using AI writing assistance, choosing professional resume templates and downloading your resume as a PDF with OrricaEdge Resume.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-5 py-12 sm:py-20">
        <div className="divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white shadow-[0_20px_60px_-45px_rgba(16,24,40,.4)]">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group px-5 py-5 sm:px-7 sm:py-6">
              <summary className="cursor-pointer list-none pr-8 text-base font-bold text-neutral-900 marker:hidden sm:text-lg">{question}</summary>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-neutral-600 sm:text-base">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
