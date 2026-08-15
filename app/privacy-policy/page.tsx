import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Orrica Edge Privacy Policy to understand how information may be collected, used, protected and managed when you use our website and services.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6E46AE]">Legal</p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Privacy Policy</h1>
        <p className="mt-5 text-sm leading-7 text-neutral-600 sm:text-base">This Privacy Policy explains how information may be handled when you use Orrica Edge. Please review it together with our <Link href="/terms-and-conditions" className="font-semibold text-[#6E46AE] hover:text-[#B051AA]">Terms &amp; Conditions</Link>.</p>

        <div className="mt-10 space-y-8">
          <section><h2 className="text-xl font-bold">1. Introduction</h2><p className="mt-3 leading-7 text-neutral-700">Orrica Edge is an online resume-building platform. This policy describes the types of information that may be processed to provide, secure and improve the service.</p></section>
          <section><h2 className="text-xl font-bold">2. Information You Provide</h2><p className="mt-3 leading-7 text-neutral-700">Depending on how you use the service, information may include account details, contact information, resume content, education, experience, skills, projects, certifications and other professional information that you choose to enter or upload.</p></section>
          <section><h2 className="text-xl font-bold">3. Technical and Usage Information</h2><p className="mt-3 leading-7 text-neutral-700">The website may process technical or usage information needed to operate and protect the service, such as browser or device information, log information and product interaction data. The exact data collected can depend on the features and integrations enabled in the application.</p></section>
          <section><h2 className="text-xl font-bold">4. How Information May Be Used</h2><ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-neutral-700"><li>Provide and operate the resume builder and related features.</li><li>Save, retrieve and process content where the product supports those functions.</li><li>Improve usability, reliability and product performance.</li><li>Provide support and respond to user requests.</li><li>Protect the service against abuse, fraud and security threats.</li></ul></section>
          <section><h2 className="text-xl font-bold">5. AI-Assisted Features</h2><p className="mt-3 leading-7 text-neutral-700">Where AI-assisted features are available, information you submit to an AI feature may be processed to generate suggestions or improve resume wording. You remain responsible for reviewing generated content and ensuring that your resume contains accurate information.</p></section>
          <section><h2 className="text-xl font-bold">6. Cookies and Similar Technologies</h2><p className="mt-3 leading-7 text-neutral-700">The website may use cookies or similar technologies for essential functionality, authentication, preferences, security, analytics or other product purposes, depending on the current implementation.</p></section>
          <section><h2 className="text-xl font-bold">7. Third-Party Services</h2><p className="mt-3 leading-7 text-neutral-700">Orrica Edge may rely on third-party infrastructure or services to provide parts of the product. When such services process information, their handling is also subject to their own terms and privacy practices.</p></section>
          <section><h2 className="text-xl font-bold">8. Data Security</h2><p className="mt-3 leading-7 text-neutral-700">We use reasonable technical and organisational measures intended to protect information. No online service can guarantee absolute security, so users should also protect their account credentials and avoid sharing sensitive information unnecessarily.</p></section>
          <section><h2 className="text-xl font-bold">9. Data Retention</h2><p className="mt-3 leading-7 text-neutral-700">Information may be retained for as long as reasonably necessary to provide the service, maintain security, meet operational needs or comply with applicable obligations. Specific retention periods can vary by data type and product functionality.</p></section>
          <section><h2 className="text-xl font-bold">10. Your Choices and Rights</h2><p className="mt-3 leading-7 text-neutral-700">Depending on your location and applicable law, you may have rights relating to access, correction, deletion, restriction or other handling of personal information. Contact us to make a request and we will review it according to applicable requirements.</p></section>
          <section><h2 className="text-xl font-bold">11. Children&apos;s Privacy</h2><p className="mt-3 leading-7 text-neutral-700">The service is intended for people able to use online career tools lawfully. We do not knowingly design the service to collect personal information from children without appropriate legal basis or consent.</p></section>
          <section><h2 className="text-xl font-bold">12. Changes to This Policy</h2><p className="mt-3 leading-7 text-neutral-700">We may update this Privacy Policy as the website, features or legal requirements change. The latest version published on this page will apply going forward.</p></section>
          <section className="rounded-2xl border border-[#F0F0F0] bg-[#E9E7F7] p-5 sm:p-6"><h2 className="text-xl font-bold">13. Contact Us</h2><p className="mt-3 leading-7 text-neutral-700">For privacy-related questions or requests, contact Orrica Edge at <a href="mailto:info@orricaedge.com" className="font-semibold text-[#6E46AE] hover:text-[#B051AA]">info@orricaedge.com</a>.</p></section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
