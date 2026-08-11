import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

export const metadata: Metadata = {
  title: 'Free Resume Builder Pricing',
  description: 'See Orrica Edge pricing. Build and download professional resumes with AI writing tools, ATS-ready templates and PDF export.',
  alternates: { canonical: '/pricing' },
};

const FEATURES = ['Unlimited resumes', '10 professional templates', 'AI summary & bullet generation', 'ATS job-match scoring', 'Typography & color customization', 'PDF downloads'];

export default function PricingPage() {
  return <div className="min-h-dvh bg-white"><SiteHeader /><main className="mx-auto max-w-4xl px-5 py-16 text-center sm:py-24"><span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700"><Sparkles className="h-3.5 w-3.5" /> Simple, honest pricing</span><h1 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">Build a better resume without a paywall.</h1><p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">The current Orrica Edge experience is free to build and download. No credit card is required to start.</p><div className="mx-auto mt-12 max-w-md overflow-hidden rounded-3xl border-2 border-orange-200 bg-white text-left shadow-2xl shadow-orange-500/10"><div className="bg-orange-500 px-6 py-3 text-center text-xs font-black uppercase tracking-widest text-white">Current plan</div><div className="p-7"><h2 className="text-xl font-bold">Free</h2><p className="mt-2 text-4xl font-black">$0 <span className="text-base font-medium text-muted-foreground">/ forever</span></p><ul className="mt-7 space-y-3">{FEATURES.map((f) => <li key={f} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />{f}</li>)}</ul><Link href="/resume/new" className="mt-8 block"><Button size="lg" className="h-12 w-full rounded-xl font-bold">Create my resume</Button></Link></div></div><p className="mx-auto mt-8 max-w-lg text-xs leading-5 text-muted-foreground">Plan details can evolve as the product grows. For questions or feedback, visit <Link href="/about" className="font-semibold text-orange-600">About Orrica Edge</Link>.</p></main><SiteFooter /></div>;
}
