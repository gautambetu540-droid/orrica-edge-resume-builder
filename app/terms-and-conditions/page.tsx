import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Read the Orrica Edge Terms & Conditions covering website use, accounts, resume creation, user content, acceptable use, intellectual property and service limitations.',
  alternates: { canonical: '/terms-and-conditions' },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6E46AE]">Legal</p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Terms &amp; Conditions</h1>
        <p className="mt-5 text-sm leading-7 text-neutral-600 sm:text-base">These terms describe the basic rules for using Orrica Edge and its resume-building features. Please also review our <Link href="/privacy-policy" className="font-semibold text-[#6E46AE] hover:text-[#B051AA]">Privacy Policy</Link>.</p>

        <div className="mt-10 space-y-8">
          <section><h2 className="text-xl font-bold">1. Acceptance of These Terms</h2><p className="mt-3 leading-7 text-neutral-700">By accessing or using Orrica Edge, you agree to use the website lawfully and in accordance with these terms. If you do not agree, please do not use the service.</p></section>
          <section><h2 className="text-xl font-bold">2. Eligibility and Accurate Information</h2><p className="mt-3 leading-7 text-neutral-700">You are responsible for providing information that is accurate and appropriate for your resume. Do not impersonate another person or knowingly submit false or misleading information.</p></section>
          <section><h2 className="text-xl font-bold">3. Account Responsibility</h2><p className="mt-3 leading-7 text-neutral-700">Where an account is required, you are responsible for maintaining appropriate account security and for activity carried out through your account. Contact support promptly if you believe your account has been compromised.</p></section>
          <section><h2 className="text-xl font-bold">4. Resume Builder and AI Assistance</h2><p className="mt-3 leading-7 text-neutral-700">Orrica Edge provides tools that can assist with resume structure, wording, templates and related workflows. AI-generated suggestions are not a substitute for your review. You are responsible for checking accuracy, relevance and truthfulness before using a resume.</p></section>
          <section><h2 className="text-xl font-bold">5. User Content</h2><p className="mt-3 leading-7 text-neutral-700">You remain responsible for the content you submit to the service and for having the necessary rights or permissions to use that content. Do not upload confidential information belonging to another person or organisation unless you are authorised to do so.</p></section>
          <section><h2 className="text-xl font-bold">6. Prohibited Use</h2><ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-neutral-700"><li>Use the service for unlawful or fraudulent activity.</li><li>Attempt to gain unauthorised access to accounts, systems or data.</li><li>Introduce malware or other harmful code.</li><li>Abuse automated requests in a way that harms the service.</li><li>Interfere with the security, availability or normal operation of the website.</li></ul></section>
          <section><h2 className="text-xl font-bold">7. Intellectual Property</h2><p className="mt-3 leading-7 text-neutral-700">Orrica Edge and its website software, interface, branding and platform materials remain protected by applicable intellectual-property laws. You may use the service and its outputs for lawful personal or professional purposes consistent with these terms. User-created resume content remains subject to your own rights and any applicable third-party rights.</p></section>
          <section><h2 className="text-xl font-bold">8. Third-Party Services</h2><p className="mt-3 leading-7 text-neutral-700">Parts of the experience may depend on third-party services or infrastructure. Those services may have separate terms, policies and availability outside Orrica Edge&apos;s control.</p></section>
          <section><h2 className="text-xl font-bold">9. Service Availability and Changes</h2><p className="mt-3 leading-7 text-neutral-700">The service may change, be updated, temporarily unavailable or require maintenance. Features may be added, modified or removed as the product evolves.</p></section>
          <section><h2 className="text-xl font-bold">10. No Employment or Interview Guarantee</h2><p className="mt-3 leading-7 text-neutral-700">Orrica Edge is a resume and career-tool platform. Use of the service does not guarantee employment, interviews, job offers, selection, salary or any particular career outcome.</p></section>
          <section><h2 className="text-xl font-bold">11. Disclaimer</h2><p className="mt-3 leading-7 text-neutral-700">The service is provided for practical resume-building and career-support purposes. You should review your final resume and make decisions appropriate to your circumstances. Nothing on the website should be treated as a guarantee of a particular professional result.</p></section>
          <section><h2 className="text-xl font-bold">12. Limitation of Liability</h2><p className="mt-3 leading-7 text-neutral-700">To the extent permitted by applicable law, Orrica Edge is not responsible for indirect or consequential loss arising from use of the service. Nothing in these terms is intended to exclude rights or protections that cannot lawfully be excluded.</p></section>
          <section><h2 className="text-xl font-bold">13. Changes to These Terms</h2><p className="mt-3 leading-7 text-neutral-700">We may update these terms as the service evolves or legal requirements change. Continued use after updated terms are published may constitute acceptance to the extent permitted by law.</p></section>
          <section className="rounded-2xl border border-[#F0F0F0] bg-[#E9E7F7] p-5 sm:p-6"><h2 className="text-xl font-bold">14. Contact</h2><p className="mt-3 leading-7 text-neutral-700">Questions about these terms can be sent to <a href="mailto:info@orricaedge.com" className="font-semibold text-[#6E46AE] hover:text-[#B051AA]">info@orricaedge.com</a>.</p></section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
