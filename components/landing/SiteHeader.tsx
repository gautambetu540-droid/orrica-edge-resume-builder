'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JOB_CHANNEL = 'https://whatsapp.com/channel/0029VbAsVFr4Y9lwo6JDRA2t';

const NAV_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/templates', label: 'Templates' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#faq', label: 'FAQ' },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="bg-neutral-950 text-center text-[10px] font-semibold text-neutral-300">
        <div className="mx-auto flex min-h-8 max-w-7xl items-center justify-center gap-2 px-5 py-1.5 sm:h-8 sm:py-0">
          <Sparkles className="h-3 w-3 shrink-0 text-orange-400" />
          <span>Build your resume free · AI-assisted · Live preview · PDF export</span>
          <span className="hidden text-neutral-600 sm:inline">|</span>
          <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="font-bold text-white transition-colors hover:text-orange-400">Free job updates on WhatsApp ↗</a>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="shrink-0 transition-transform hover:scale-[1.02]" aria-label="Orrica Edge home"><img src="/logo-orricaedge.png" alt="Orrica Edge AI Resume Builder" className="h-7 w-auto sm:h-8" /></Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">{NAV_LINKS.map((link) => <Link key={link.href} href={link.href} className="relative py-2 text-[12px] font-semibold text-neutral-600 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-orange-500 after:transition-transform hover:text-neutral-950 hover:after:scale-x-100">{link.label}</Link>)}</nav>
          <div className="hidden items-center gap-2 md:flex"><a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="rounded-lg px-3 py-2 text-xs font-bold text-neutral-600 transition-colors hover:bg-orange-50 hover:text-orange-700">Free jobs</a><Link href="/login"><Button variant="ghost" className="h-10 rounded-lg px-4 text-sm font-semibold text-neutral-600 hover:text-neutral-950">Sign in</Button></Link><Link href="/resume/new"><Button className="h-10 rounded-lg px-4 text-sm font-bold shadow-sm shadow-orange-500/15">Create resume <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Button></Link></div>
          <button className="rounded-xl p-2.5 text-neutral-700 transition-colors hover:bg-neutral-100 md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
        {menuOpen && <div className="border-t border-black/[0.06] bg-white px-5 py-4 shadow-xl md:hidden"><nav className="flex flex-col">{NAV_LINKS.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="border-b border-neutral-100 py-3.5 text-sm font-semibold text-neutral-700 last:border-0">{link.label}</Link>)}</nav><a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Get free job updates on WhatsApp ↗</a><div className="mt-3 grid grid-cols-2 gap-2"><Link href="/login" onClick={() => setMenuOpen(false)}><Button variant="outline" className="h-11 w-full rounded-xl">Sign in</Button></Link><Link href="/resume/new" onClick={() => setMenuOpen(false)}><Button className="h-11 w-full rounded-xl">Create resume</Button></Link></div></div>}
      </header>
    </>
  );
}
