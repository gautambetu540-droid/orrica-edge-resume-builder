import Link from 'next/link';
import { ArrowUpRight, Check, FileText, ShieldCheck, Sparkles } from 'lucide-react';

const COLUMNS = [
  { title: 'Product', links: [{ href: '/resume/new', label: 'Create Resume' }, { href: '/templates', label: 'Resume Templates' }, { href: '/pricing', label: 'Pricing' }, { href: '/#features', label: 'Features' }] },
  { title: 'Learn', links: [{ href: '/#how-it-works', label: 'How It Works' }, { href: '/#faq', label: 'Resume Builder FAQ' }, { href: '/about', label: 'About Orrica Edge' }] },
  { title: 'Account', links: [{ href: '/login', label: 'Sign In' }, { href: '/dashboard', label: 'Dashboard' }] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.07] bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-8 w-auto brightness-0 invert" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-400">A modern AI-assisted resume builder for people who want a stronger application without losing their own voice.</p>
            <div className="mt-6 flex flex-wrap gap-2">{['AI-assisted', 'ATS-ready', 'Live preview', 'PDF export'].map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold text-neutral-300">{item}</span>)}</div>
          </div>
          {COLUMNS.map((col) => <div key={col.title}><h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-500">{col.title}</h3><ul className="mt-5 space-y-3">{col.links.map((link) => <li key={link.href}><Link href={link.href} className="group inline-flex items-center text-sm font-medium text-neutral-300 transition-colors hover:text-white">{link.label}<ArrowUpRight className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" /></Link></li>)}</ul></div>)}
        </div>

        <div className="mt-14 grid gap-4 border-y border-white/10 py-6 sm:grid-cols-3">
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400"><Sparkles className="h-4 w-4" /></div><div><div className="text-xs font-bold">AI when you need it</div><div className="mt-1 text-[11px] leading-5 text-neutral-500">Use AI as an assistant, not a black box.</div></div></div>
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"><ShieldCheck className="h-4 w-4" /></div><div><div className="text-xs font-bold">Your story stays yours</div><div className="mt-1 text-[11px] leading-5 text-neutral-500">Review and control every suggestion.</div></div></div>
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-neutral-300"><FileText className="h-4 w-4" /></div><div><div className="text-xs font-bold">Ready for real applications</div><div className="mt-1 text-[11px] leading-5 text-neutral-500">Clean layouts, live A4 preview and PDF export.</div></div></div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-neutral-500"><span>© {new Date().getFullYear()} Orrica Edge</span><span>Built for modern job seekers</span></div>
          <Link href="/resume/new" className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-orange-400">Build your resume <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </footer>
  );
}
