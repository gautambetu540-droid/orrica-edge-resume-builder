import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export const metadata = {
  title: 'Email Verified',
  description: 'Your Orrica Edge email address has been verified.',
  robots: { index: false, follow: false },
};

export default function VerifiedPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-neutral-950 px-5 py-10 text-white">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 animate-float rounded-full bg-orange-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 animate-float-slow rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)', backgroundSize: '42px 42px' }} />

      <section className="relative w-full max-w-md animate-scale-in">
        <div className="mb-8 flex justify-center">
          <Link href="/" aria-label="Orrica Edge home">
            <img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-9 w-auto brightness-0 invert" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white text-center text-neutral-950 shadow-[0_40px_120px_-45px_rgba(0,0,0,.85)]">
          <div className="px-7 pb-8 pt-10 sm:px-10 sm:pt-12">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <span className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping" style={{ animationDuration: '1.8s' }} />
              <span className="absolute inset-2 rounded-full bg-emerald-50" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 animate-scale-in">
                <Check className="h-9 w-9 stroke-[3]" />
              </span>
            </div>

            <p className="mt-7 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Verification complete</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Thanks for verifying!</h1>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-neutral-500">
              Your email address has been successfully verified. Your Orrica Edge account is now ready to use.
            </p>

            <div className="mt-7 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">
              <p className="text-xs font-semibold text-neutral-500">Please go back to</p>
              <p className="mt-1 text-base font-black text-neutral-950">orricaresumebuilder.com</p>
              <p className="mt-1 text-xs text-neutral-400">and log in with your email ID and password.</p>
            </div>

            <Link href="/login" className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-neutral-950 px-5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-neutral-800">
              Go to login <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4 text-[10px] text-neutral-400">
            Email verified securely · You are not signed in yet
          </div>
        </div>
      </section>
    </main>
  );
}
