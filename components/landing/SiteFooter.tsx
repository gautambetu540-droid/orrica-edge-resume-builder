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
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#07070b] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(110,70,174,.20),transparent_68%)]" />

      <div className="relative mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.45fr_repeat(4,minmax(0,1fr))] lg:gap-8">
          <div className="min-w-0">
            <Link href="/" className="inline-flex items-center gap-2">
              <img src="/logo-orricaedge.png" alt="Orrica Edge AI Resume Builder" className="h-8 w-auto brightness-0 invert sm:h-9" />
            </Link>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#a7a7b2] sm:leading-7">
              Orrica Edge is an AI-assisted resume builder for creating professional, ATS-friendly resumes with guided editing, modern templates, live A4 preview and PDF export.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['AI Resume Builder', 'ATS-Friendly', 'Resume Templates', 'Live Preview', 'PDF Export'].map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1.5 text-[10px] font-semibold text-[#d4d4dc]">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="min-w-0">
              <h3 className="!text-white text-[11px] font-black uppercase tracking-[0.18em]">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="group inline-flex max-w-full text-sm font-medium text-[#b8b8c3] transition-colors hover:text-white">
                      <span className="truncate">{link.label}</span>
                      <ArrowUpRight className="ml-1 h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[24px] border border-[#8b5cf6]/25 bg-[linear-gradient(135deg,rgba(110,70,174,.16),rgba(255,255,255,.035))] p-5 shadow-[0_20px_60px_-35px_rgba(110,70,174,.55)] sm:mt-12 sm:rounded-[28px] sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d06bd0]">Orrica Edge Resume</p>
              <h3 className="!text-white mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Create a professional ATS-friendly resume.</h3>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-[#b4b4bf] sm:text-sm">Build, edit, preview and export your resume with a streamlined online resume builder designed for freshers, professionals and modern job applications.</p>
            </div>
            <Link href="/resume/new" className="inline-flex w-full shrink-0 items-center justify-center rounded-xl bg-[#7447b8] px-5 py-3 text-xs font-black !text-white shadow-lg shadow-[#7447b8]/20 transition-all hover:-translate-y-0.5 hover:bg-[#8355c8] sm:w-auto">
              Create your resume <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-5 sm:mt-7 sm:rounded-[28px] sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-[#d06bd0]"><UserRound className="h-5 w-5" /></div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#d06bd0]">Meet the developer</p>
                <h3 className="!text-white mt-1 text-xl font-semibold tracking-tight">Sudhanshu Gautam</h3>
                <p className="mt-1 max-w-2xl text-xs leading-5 text-[#a9a9b4]">Building Orrica Edge with a focus on clear resume writing, useful AI assistance and a polished application experience.</p>
              </div>
            </div>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-black !text-[#111118] transition-all hover:-translate-y-0.5 hover:bg-[#eeeaff] sm:w-auto">
              <Linkedin className="h-4 w-4" /> Meet on LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-emerald-400/15 bg-[linear-gradient(135deg,rgba(16,185,129,.09),rgba(255,255,255,.025))] p-5 sm:mt-7 sm:rounded-[28px] sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">Free career updates</p>
              <h3 className="!text-white mt-1 text-xl font-semibold tracking-tight sm:text-2xl">Get free job updates on WhatsApp.</h3>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-[#a9a9b4]">Follow the free job-update channel for fresh opportunities and career updates without paying for access.</p>
            </div>
            <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="inline-flex w-full shrink-0 items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-xs font-black !text-white shadow-lg shadow-emerald-500/15 transition-all hover:-translate-y-0.5 hover:bg-emerald-400 sm:w-auto">
              Follow free job updates <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-7 grid gap-4 border-y border-white/10 py-6 sm:grid-cols-3 sm:gap-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#7447b8]/15 text-[#d06bd0]"><Sparkles className="h-4 w-4" /></div>
            <div><div className="!text-white text-xs font-bold">AI resume writing assistance</div><div className="mt-1 text-[11px] leading-5 text-[#8f8f9b]">Improve summaries and experience wording while keeping your information truthful.</div></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400"><ShieldCheck className="h-4 w-4" /></div>
            <div><div className="!text-white text-xs font-bold">ATS-friendly resume structure</div><div className="mt-1 text-[11px] leading-5 text-[#8f8f9b]">Keep important education, experience, skills and achievements easy to scan.</div></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#d8d8e0]"><FileText className="h-4 w-4" /></div>
            <div><div className="!text-white text-xs font-bold">Live resume preview and PDF</div><div className="mt-1 text-[11px] leading-5 text-[#8f8f9b]">Review your A4 layout and export a ready-to-send resume PDF.</div></div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-[#777783]">
            <span>© {new Date().getFullYear()} Orrica Edge</span>
            <span>AI Resume Builder · ATS Resume Maker</span>
            <a href="mailto:info@orricaedge.com" className="transition-colors hover:text-white">info@orricaedge.com</a>
          </div>
          <Link href="/resume/new" className="inline-flex items-center gap-1.5 text-xs font-bold !text-white hover:text-[#d06bd0]">Build your resume <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </footer>
  );
}
