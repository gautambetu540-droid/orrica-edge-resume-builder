import Link from 'next/link';
import { ArrowUpRight, FileText, Linkedin, ShieldCheck, Sparkles, UserRound } from 'lucide-react';

const JOB_CHANNEL = 'https://whatsapp.com/channel/0029VbAsVFr4Y9lwo6JDRA2t';
const LINKEDIN_URL = 'https://www.linkedin.com/in/sudhanshu-g-512937375/';

const COLUMNS = [
  { title: 'Product', links: [{ href: '/resume/new', label: 'Create Resume' }, { href: '/templates', label: 'Resume Templates' }, { href: '/pricing', label: 'Pricing' }, { href: '/#features', label: 'Resume Builder Features' }] },
  { title: 'Learn', links: [{ href: '/#how-it-works', label: 'How Orrica Edge Resume Works' }, { href: '/faq', label: 'Orrica Edge Resume FAQ' }, { href: '/about', label: 'About Orrica Edge' }, { href: '/contact-us', label: 'Contact Us' }] },
  { title: 'Legal', links: [{ href: '/privacy-policy', label: 'Privacy Policy' }, { href: '/terms-and-conditions', label: 'Terms & Conditions' }] },
  { title: 'Account', links: [{ href: '/login', label: 'Sign In' }, { href: '/signup', label: 'Create Account' }, { href: '/dashboard', label: 'Resume Dashboard' }] },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.07] bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2"><img src="/logo-orricaedge.png" alt="Orrica Edge AI Resume Builder" className="h-8 w-auto brightness-0 invert" /></Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-neutral-400">Orrica Edge is an AI-assisted resume builder for creating professional, ATS-friendly resumes with guided editing, modern resume templates, live A4 preview and PDF export.</p>
            <div className="mt-6 flex flex-wrap gap-2">{['AI Resume Builder', 'ATS-Friendly', 'Resume Templates', 'Live Preview', 'PDF Export'].map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold text-neutral-300">{item}</span>)}</div>
          </div>
          {COLUMNS.map((col) => <div key={col.title}><h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-neutral-500">{col.title}</h3><ul className="mt-5 space-y-3">{col.links.map((link) => <li key={link.href}><Link href={link.href} className="group inline-flex text-sm font-medium text-neutral-300 transition-colors hover:text-white">{link.label}<ArrowUpRight className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" /></Link></li>)}</ul></div>)}
        </div>

        <div className="mt-10 rounded-3xl border border-[#6E46AE]/25 bg-[#6E46AE]/[0.08] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#B051AA]">Orrica Edge Resume</p><h3 className="mt-1 text-xl font-semibold tracking-tight">Create a professional ATS-friendly resume.</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-400">Build, edit, preview and export your resume with a streamlined online resume builder designed for freshers, professionals and modern job applications.</p></div>
            <Link href="/resume/new" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#6E46AE] px-5 py-3 text-xs font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#5d389c]">Create your resume <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-[#B051AA]"><UserRound className="h-5 w-5" /></div><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#B051AA]">Meet the developer</p><h3 className="mt-1 text-xl font-semibold tracking-tight">Sudhanshu Gautam</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-400">Building Orrica Edge with a focus on clear resume writing, useful AI assistance and a polished application experience.</p></div></div>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black text-neutral-950 transition-all hover:-translate-y-0.5 hover:bg-[#E9E7F7]"><Linkedin className="h-4 w-4" /> Meet on LinkedIn <ArrowUpRight className="h-3.5 w-3.5" /></a>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-emerald-400/15 bg-emerald-400/[0.06] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">Free career updates</p><h3 className="mt-1 text-xl font-semibold tracking-tight">Get free job updates on WhatsApp.</h3><p className="mt-1 max-w-2xl text-xs leading-5 text-neutral-400">Follow the free job-update channel for fresh opportunities and career updates without paying for access.</p></div>
            <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-xs font-black text-white transition-all hover:-translate-y-0.5 hover:bg-emerald-400">Follow free job updates <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></a>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-y border-white/10 py-6 sm:grid-cols-3">
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6E46AE]/15 text-[#B051AA]"><Sparkles className="h-4 w-4" /></div><div><div className="text-xs font-bold">AI resume writing assistance</div><div className="mt-1 text-[11px] leading-5 text-neutral-500">Improve summaries and experience wording while keeping your information truthful.</div></div></div>
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"><ShieldCheck className="h-4 w-4" /></div><div><div className="text-xs font-bold">ATS-friendly resume structure</div><div className="mt-1 text-[11px] leading-5 text-neutral-500">Keep important education, experience, skills and achievements easy to scan.</div></div></div>
          <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-neutral-300"><FileText className="h-4 w-4" /></div><div><div className="text-xs font-bold">Live resume preview and PDF</div><div className="mt-1 text-[11px] leading-5 text-neutral-500">Review your A4 layout and export a ready-to-send resume PDF.</div></div></div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-neutral-500"><span>© {new Date().getFullYear()} Orrica Edge</span><span>AI Resume Builder · ATS Resume Maker</span><a href="mailto:info@orricaedge.com" className="transition-colors hover:text-white">info@orricaedge.com</a></div>
          <Link href="/resume/new" className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#B051AA]">Build your resume <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </footer>
  );
}