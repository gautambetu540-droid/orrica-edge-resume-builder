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
      <div className="relative z-[60] overflow-hidden bg-neutral-950 text-center text-[10px] font-semibold text-neutral-300">
        <div className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="relative mx-auto flex min-h-8 max-w-7xl items-center justify-center gap-2 px-5 py-1.5 sm:h-8 sm:py-0">
          <Sparkles className="h-3 w-3 shrink-0 text-orange-400 animate-pulse-glow" />
          <span className="hidden sm:inline">Build your resume free · AI-assisted · Live preview · PDF export</span>
          <span className="sm:hidden">AI resume builder · Free to start</span>
          <span className="hidden text-neutral-600 sm:inline">|</span>
          <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="font-bold text-white transition-colors hover:text-orange-400">Free job updates on WhatsApp ↗</a>
        </div>
      </div>
      <header className="oe-glass-nav sticky top-0 z-50">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="group shrink-0" aria-label="Orrica Edge home"><img src="/logo-orricaedge.png" alt="Orrica Edge AI Resume Builder" className="h-7 w-auto transition-transform duration-300 group-hover:scale-[1.035] group-hover:-rotate-1 sm:h-8" /></Link>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">{NAV_LINKS.map((link) => <Link key={link.href} href={link.href} className="group relative py-2 text-[12px] font-semibold text-neutral-600 transition-colors hover:text-neutral-950"><span>{link.label}</span><span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-orange-500 to-violet-500 transition-transform duration-300 group-hover:scale-x-100" /></Link>)}</nav>
          <div className="hidden items-center gap-2 md:flex"><a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="rounded-xl px-3 py-2 text-xs font-bold text-neutral-600 hover:bg-orange-50 hover:text-orange-700">Free jobs</a><Link href="/login"><Button variant="ghost" className="h-10 rounded-xl px-4 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950">Sign in</Button></Link><Link href="/resume/new"><Button className="oe-3d-button magnetic-button h-10 rounded-xl px-4 text-sm font-bold shadow-lg shadow-orange-500/20">Create resume <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Button></Link></div>
          <button className="rounded-xl p-2.5 text-neutral-700 hover:bg-neutral-100 md:hidden" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
        {menuOpen && <div className="animate-fade-in-up border-t border-black/[0.06] bg-white/95 px-5 py-4 shadow-2xl backdrop-blur-xl md:hidden"><nav className="flex flex-col">{NAV_LINKS.map((link, index) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`reveal-${Math.min(index + 1, 6)} animate-fade-in-up border-b border-neutral-100 py-3.5 text-sm font-semibold text-neutral-700 last:border-0`}>{link.label}</Link>)}</nav><a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Get free job updates on WhatsApp ↗</a><div className="mt-3 grid grid-cols-2 gap-2"><Link href="/login" onClick={() => setMenuOpen(false)}><Button variant="outline" className="h-11 w-full rounded-xl">Sign in</Button></Link><Link href="/resume/new" onClick={() => setMenuOpen(false)}><Button className="oe-3d-button magnetic-button h-11 w-full rounded-xl">Create resume</Button></Link></div></div>}
      </header>
    </>
  );
}
