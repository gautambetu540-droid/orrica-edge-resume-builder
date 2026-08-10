import Link from 'next/link';
import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { SiteFooter } from '@/components/landing/SiteFooter';

const FEATURES = [
  'Unlimited resumes',
  '10 professional templates',
  'AI summary & bullet generation',
  'ATS job-match scoring',
  'Full typography & color customization',
  'Unlimited PDF downloads',
];

export default function PricingPage() {
  return (
    <div className="min-h-dvh bg-white">
      <SiteHeader />
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-accent text-accent-foreground px-3 py-1.5 rounded-full mb-5">
          <Sparkles className="h-3.5 w-3.5" /> Simple, honest pricing
        </span>
        <h1 className="text-3xl sm:text-5xl font-bold mb-4">Free to build. Free to download.</h1>
        <p className="text-muted-foreground max-w-lg mx-auto mb-12">
          Orrica Edge is free to use — no credit card, no paywalled downloads. Build as many resumes as you need.
        </p>

        <div className="rounded-2xl border-2 border-primary/20 bg-white shadow-xl shadow-primary/5 p-8 max-w-md mx-auto text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
            Current Plan
          </div>
          <h2 className="text-xl font-bold mb-1">Free</h2>
          <p className="text-3xl font-bold mb-5">
            $0 <span className="text-base font-normal text-muted-foreground">/ forever</span>
          </p>
          <ul className="space-y-2.5 mb-7">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/resume/new">
            <Button size="lg" className="w-full">
              Create My Resume
            </Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Have questions about limits or larger team usage? Reach out from the <Link href="/about" className="text-primary">About</Link> page.
        </p>
      </div>
      <SiteFooter />
    </div>
  );
}
