import type { Metadata } from 'next';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

export const metadata: Metadata = {
  title: 'Orrica Edge Resume FAQ | AI Resume Builder, ATS Resume Maker & PDF',
  description: 'Get answers about Orrica Edge Resume, AI resume writing, ATS-friendly resume creation, professional resume templates, resume editing, live A4 preview, PDF export, accounts, privacy and job application preparation.',
  keywords: ['Orrica Edge Resume', 'Orrica Edge Resume Builder', 'Orrica Edge AI Resume Builder', 'AI resume builder', 'ATS resume builder', 'ATS-friendly resume maker', 'professional resume builder', 'online resume maker', 'resume templates', 'resume PDF maker', 'free resume builder', 'resume builder for freshers', 'resume builder for experienced professionals'],
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Orrica Edge Resume FAQ | AI Resume Builder & ATS Resume Maker',
    description: 'Learn how Orrica Edge Resume helps you create, edit, preview and export a professional ATS-friendly resume with optional AI assistance.',
    type: 'website',
  },
};

const faqs = [
  ['What is Orrica Edge Resume?', 'Orrica Edge Resume is an online AI-assisted resume builder designed to help job seekers create professional, ATS-friendly resumes. It combines guided resume editing, structured resume sections, professional templates, optional AI writing assistance, live A4 preview and PDF export in one workflow.'],
  ['What is an AI resume builder and how does Orrica Edge use AI?', 'An AI resume builder uses artificial intelligence to assist with resume wording and content refinement. Orrica Edge can help improve professional summaries, experience bullets and other resume sections based on information you provide. AI is an assistant, not a replacement for your judgment, and every suggestion should be reviewed for accuracy.'],
  ['Can I create an ATS-friendly resume with Orrica Edge Resume?', 'Yes. Orrica Edge Resume is designed around clean structure, readable sections and clear information hierarchy so important details such as work experience, education, skills, projects and certifications are easier to scan. You should still tailor your final resume to each job description.'],
  ['What does ATS-friendly resume mean?', 'ATS-friendly means the resume uses a clear structure and readable formatting that can make important information easier for applicant tracking systems and recruiters to identify. Relevant job titles, skills and qualifications should be included naturally and truthfully.'],
  ['Can I build a resume without using AI?', 'Yes. AI assistance is optional. You can manually create and edit your contact details, professional summary, work experience, education, skills, projects, certifications, languages and other relevant sections.'],
  ['Can freshers use Orrica Edge Resume?', 'Yes. Freshers can use Orrica Edge Resume to create a professional resume using education, internships, academic projects, certifications, skills, achievements, volunteer work and other relevant experience.'],
  ['Can experienced professionals use Orrica Edge Resume?', 'Yes. Experienced professionals can organize career history, achievements, responsibilities, technical skills, leadership experience, certifications and professional summaries into a structured resume suitable for job applications.'],
  ['Can I choose a professional resume template?', 'Yes. Orrica Edge provides professional resume layouts designed to balance visual polish with readable structure. Choose a template that fits your industry and career level while keeping your content clear and easy to scan.'],
  ['Can I preview my resume before downloading it?', 'Yes. The live A4 resume preview lets you review your layout while editing. This helps you check spacing, page flow, section hierarchy and how longer resumes continue across pages before exporting.'],
  ['Can I download my resume as a PDF?', 'Yes. Orrica Edge Resume supports PDF export so you can save and share a completed resume for applications, recruiters and professional opportunities. Always review the final PDF before sending it.'],
  ['Can I edit my resume after creating it?', 'Yes. You can return to your resume and update personal information, experience, education, skills, wording, sections and template choices before generating your final PDF.'],
  ['Can Orrica Edge improve my resume wording?', 'The AI writing tools can help make the information you provide clearer, more concise and more professional. They should be used as writing assistance. Never add achievements, qualifications, responsibilities or experience that you did not actually have.'],
  ['How can I make my resume more ATS-friendly?', 'Use a clear job title, relevant skills, measurable achievements and terminology that accurately matches the target job description. Keep formatting readable, avoid unnecessary keyword stuffing and make sure every claim is truthful and relevant to the role.'],
  ['Should I use the same resume for every job application?', 'A strong base resume can be reused, but tailoring it to each role is recommended. Adjust your professional summary, relevant skills, experience bullets and keywords to reflect the requirements of the specific job while keeping all information accurate.'],
  ['Is Orrica Edge Resume useful for job applications?', 'Yes. Orrica Edge Resume is designed to help you prepare a professional, readable resume for modern job applications. It does not guarantee interviews, employment, job offers, salary or selection. Your final resume should be reviewed for accuracy and relevance before submission.'],
  ['Does Orrica Edge guarantee a job or interview?', 'No. Orrica Edge is a resume-building and career-support tool. Creating a resume with the platform does not guarantee an interview, job offer, employment, salary or any specific career outcome.'],
  ['Is my resume content private?', 'Orrica Edge provides a Privacy Policy explaining how information may be processed when using the website and its features. Users should review the current Privacy Policy and avoid sharing passwords, verification codes or unnecessary sensitive information.'],
  ['How does Orrica Edge handle AI-generated resume content?', 'AI-generated content is provided as an optional writing aid. You are responsible for reviewing suggestions, correcting mistakes and confirming that the final resume accurately represents your real experience, education, skills and qualifications.'],
  ['How do I contact Orrica Edge support?', 'For product questions, account assistance, privacy questions, feedback or general enquiries, contact Orrica Edge at info@orricaedge.com through the Contact Us page. Do not include passwords or verification codes in support requests.'],
  ['Where can I read the Orrica Edge Privacy Policy and Terms & Conditions?', 'The Privacy Policy and Terms & Conditions are available through the website footer and provide information about privacy, data handling, account use, acceptable use, user content, service limitations and other important terms.'],
  ['How does candidate feedback work?', 'Users may be able to rate their experience and provide written feedback after using supported resume features. Feedback can help Orrica Edge understand usability and improve the resume-building experience.'],
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
            <p className="mt-5 max-w-3xl text-base leading-8 text-neutral-700 sm:text-lg">Find practical answers about the Orrica Edge AI Resume Builder, ATS-friendly resume creation, professional resume templates, AI writing assistance, live resume preview, PDF export and preparing a resume for modern job applications.</p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-12 sm:py-20">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Orrica Edge Resume Builder FAQ</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">Whether you are a fresher, an experienced professional or actively applying for your next role, this FAQ explains how Orrica Edge Resume works and how to use its resume-building features effectively.</p>
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
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-700">Create a professional resume with Orrica Edge Resume, review it in the live A4 preview and export a PDF when your content and formatting are ready.</p>
            <a href="/resume/new" className="mt-6 inline-flex items-center rounded-xl bg-[#6E46AE] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5d389c]">Create your resume</a>
          </section>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </main>
      <SiteFooter />
    </div>
  );
}