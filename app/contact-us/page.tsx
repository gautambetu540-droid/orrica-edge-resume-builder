import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, ArrowUpRight } from 'lucide-react';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Orrica Edge for website support, resume builder questions, feedback, account assistance and general inquiries.',
  alternates: { canonical: '/contact-us' },
};

export default function ContactUsPage() {
  return (
    <div className="min-h-dvh bg-white text-neutral-950">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#6E46AE]">Orrica Edge Support</p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Contact Orrica Edge</h1>
          <p className="mt-5 text-base leading-7 text-neutral-600 sm:text-lg">Have a question about the resume builder, your account, resume creation or the website? Send us a message and include enough detail for our team to understand what you need.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <section className="rounded-3xl border border-[#F0F0F0] bg-[#E9E7F7] p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#6E46AE] shadow-sm"><Mail className="h-5 w-5" /></div>
            <h2 className="mt-6 text-2xl font-bold">Email us</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-700">For general enquiries, product support and privacy or legal questions:</p>
            <a href="mailto:info@orricaedge.com" className="mt-4 inline-flex items-center gap-2 text-base font-bold text-[#6E46AE] hover:text-[#B051AA]">info@orricaedge.com <ArrowUpRight className="h-4 w-4" /></a>
            <p className="mt-6 text-xs leading-5 text-neutral-600">When reporting a problem, include the page or feature involved and a short description of what happened. Do not send passwords or other sensitive credentials.</p>
          </section>

          <section className="rounded-3xl border border-[#F0F0F0] bg-white p-6 shadow-[0_20px_60px_-45px_rgba(16,24,40,.35)] sm:p-8">
            <h2 className="text-2xl font-bold">Before you contact us</h2>
            <div className="mt-5 space-y-5 text-sm leading-7 text-neutral-700">
              <p><strong className="text-neutral-950">Resume builder issue:</strong> Tell us which step or feature you were using and what you expected to happen.</p>
              <p><strong className="text-neutral-950">Account issue:</strong> Tell us the type of problem without sharing your password or verification codes.</p>
              <p><strong className="text-neutral-950">Feedback:</strong> Tell us what you liked, what was confusing and what you would improve.</p>
              <p><strong className="text-neutral-950">Privacy or legal question:</strong> Use the same email address and mention whether your request relates to privacy, data or terms.</p>
            </div>
            <div className="mt-7 border-t border-[#F0F0F0] pt-6 text-sm text-neutral-600">You can also review our <Link href="/privacy-policy" className="font-semibold text-[#6E46AE] hover:text-[#B051AA]">Privacy Policy</Link> and <Link href="/terms-and-conditions" className="font-semibold text-[#6E46AE] hover:text-[#B051AA]">Terms &amp; Conditions</Link>.</div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
