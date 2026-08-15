import Link from 'next/link';
import { ArrowUpRight, FileText, Linkedin, ShieldCheck, Sparkles, UserRound } from 'lucide-react';

const JOB_CHANNEL = 'https://whatsapp.com/channel/0029VbAsVFr4Y9lwo6JDRA2t';
const LINKEDIN_URL = 'https://www.linkedin.com/in/sudhanshu-g-512937375/';

const COLUMNS = [
  { title: 'Product', links: [{ href: '/resume/new', label: 'Create Resume' }, { href: '/templates', label: 'Resume Templates' }, { href: '/pricing', label: 'Pricing' }, { href: '/#features', label: 'Features' }] },
  { title: 'Learn', links: [{ href: '/#how-it-works', label: 'How It Works' }, { href: '/#faq', label: 'Resume Builder FAQ' }, { href: '/about', label: 'About Orrica Edge' }, { href: '/contact-us', label: 'Contact Us' }] },
  { title: 'Legal', links: [{ href: '/privacy-policy', label: 'Privacy Policy' }, { href: '/terms-and-conditions', label: 'Terms & Conditions' }] },
  { title: 'Account', links: [{ href: '/login', label: 'Sign In' }, { href: '/signup', label: 'Create Account' }, { href: '/dashboard', label: 'Dashboard' }] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.07] bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2"><img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-8 w-auto brightness-0 invert" /></Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-400">A modern AI-assisted resume builder for people who want a stronger application without losing their own voice.</p>
            <div className="mt-6 flex flex-wrap gap-2">{['AI-assisted', 'ATS-ready', 'Live preview', 'PDF export'].map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold text-neutral-300">{item}</span>)}</div>
          </div>
          {COLUMNS.map((col) => <div key={col.title}><h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-500">{col.title}</h3><ul className="mt-5 space-y-3">{col.links.map((link) => <li key={link.href}><Link href={link.href} className="group inline-flex items-center text-sm font-medium text-neutral-300 transition-colors hover:text-white">{link.label}<ArrowUpRight className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" /></Link></li>)}</ul></div>)}
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border border-orange-400/15 bg-orange-400/[0.06] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-400/10 text-orange-400"><UserRound className="h-5 w-5" /></div>
              <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-400">Meet the developer</p><h3 className="mt-1 text-xl font-semibold tracking-tight">Sudhanshu </h3><p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-400">Building Orrica Edge with a focus on a clean resume workflow, useful AI assistance and a polished application experience.</p></div>
            </div>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black text-neutral-950 transition-all hover:-translate-y-0.5 hover:bg-orange-50"><Linkedin className="h-4 w-4" /> Meet on LinkedIn <ArrowUpRight className="h-3.5 w-3.5" /></a>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.06] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">Free career updates</p><h3 className="mt-1 text-xl font-semibold tracking-tight">Get free job updates on WhatsApp.</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-400">Follow the free job-update channel for fresh opportunities and career updates without paying for access.</p></div>
            <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-xs font-black text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-400">Follow free job updates <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></a>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-y border-white/10 py-6 sm:grid-cols-3">
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400"><Sparkles className="h-4 w-4" /></div><div><div className="text-xs font-bold">AI when you need it</div><div className="mt-1 text-[11px] leading-5 text-neutral-500">Use AI as an assistant, not a black box.</div></div></div>
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"><ShieldCheck className="h-4 w-4" /></div><div><div className="text-xs font-bold">Your story stays yours</div><div className="mt-1 text-[11px] leading-5 text-neutral-500">Review and control every suggestion.</div></div></div>
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-neutral-300"><FileText className="h-4 w-4" /></div><div><div className="text-xs font-bold">Ready for real applications</div><div className="mt-1 text-[11px] leading-5 text-neutral-500">Clean layouts, live A4 preview and PDF export.</div></div></div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-neutral-500"><span>© {new Date().getFullYear()} Orrica Edge</span><span>Built for modern job seekers</span><a href="mailto:info@orricaedge.com" className="transition-colors hover:text-white">info@orricaedge.com</a></div>
          <Link href="/resume/new" className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-orange-400">Build your resume <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </footer>
  );
}
