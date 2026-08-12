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
      <div className="relative z-[60] overflow-hidden bg-neutral-950 text-center text-[9px] font-semibold text-neutral-300 sm:text-[10px]">
        <div className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="relative mx-auto flex min-h-7 max-w-7xl items-center justify-center gap-1.5 px-3 py-1 sm:h-8 sm:gap-2 sm:px-5 sm:py-0">
          <Sparkles className="h-2.5 w-2.5 shrink-0 text-orange-400 animate-pulse-glow sm:h-3 sm:w-3" />
          <span className="hidden sm:inline">Build your resume free · AI-assisted · Live preview · PDF export</span>
          <span className="sm:hidden">AI resume builder · Free to start</span>
          <span className="hidden text-neutral-600 sm:inline">|</span>
          <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="whitespace-nowrap font-bold text-white transition-colors hover:text-orange-400">Free job updates ↗</a>
        </div>
      </div>

      <header className="oe-glass-nav sticky top-0 z-50">
        <div className="mx-auto flex h-[64px] w-full max-w-[1280px] items-center gap-2 px-4 sm:h-[68px] sm:px-5 md:px-6 lg:h-[72px] lg:px-8 xl:px-10">
          <Link href="/" className="group min-w-0 shrink-0" aria-label="Orrica Edge home">
            <img src="/logo-orricaedge.png" alt="Orrica Edge AI Resume Builder" className="h-6 w-auto transition-transform duration-300 group-hover:scale-[1.035] group-hover:-rotate-1 sm:h-7 lg:h-8" />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="group relative whitespace-nowrap py-2 text-[14px] font-medium text-neutral-600 transition-colors hover:text-neutral-950">
                <span>{link.label}</span>
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-orange-500 to-violet-500 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden shrink-0 items-center gap-2 sm:flex lg:gap-3">
            <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="hidden whitespace-nowrap rounded-xl px-3 py-2 text-[13px] font-medium text-neutral-600 transition-all hover:bg-orange-50 hover:text-orange-700 lg:block lg:px-3.5 lg:py-2.5 lg:text-[14px]">Free jobs</a>
            <Link href="/login">
              <Button variant="ghost" className="h-10 whitespace-nowrap rounded-xl px-3 text-[13px] font-medium text-neutral-700 transition-all hover:bg-neutral-100 hover:text-neutral-950 sm:px-3.5 lg:h-11 lg:px-4 lg:text-[14px]">Sign in</Button>
            </Link>
            <Link href="/resume/new">
              <Button className="oe-3d-button magnetic-button h-10 whitespace-nowrap rounded-[12px] px-4 text-[13px] font-bold shadow-lg shadow-orange-500/20 sm:h-11 sm:px-5 lg:h-12 lg:rounded-[14px] lg:px-6 lg:text-[14px]">
                <span className="sm:hidden">Create</span><span className="hidden sm:inline">Create resume</span><ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-1 sm:hidden">
            <Link href="/login" className="shrink-0">
              <Button variant="ghost" className="h-9 rounded-lg px-2.5 text-[12px] font-semibold text-neutral-700 hover:bg-neutral-100">Sign in</Button>
            </Link>
            <Link href="/resume/new" className="shrink-0">
              <Button className="oe-3d-button h-10 rounded-[11px] px-3.5 text-[12px] font-bold shadow-md shadow-orange-500/20">
                Create <ArrowUpRight className="ml-0.5 h-3 w-3" />
              </Button>
            </Link>
            <button className="ml-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
              {menuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
          </div>

          <button className="ml-auto hidden rounded-xl p-2.5 text-neutral-700 hover:bg-neutral-100 sm:max-lg:flex" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="animate-fade-in-up border-t border-black/[0.06] bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-5 lg:hidden">
            <nav className="flex flex-col">
              {NAV_LINKS.map((link, index) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`reveal-${Math.min(index + 1, 6)} animate-fade-in-up border-b border-neutral-100 py-3 text-sm font-semibold text-neutral-700 last:border-0`}>{link.label}</Link>
              ))}
            </nav>
            <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Get free job updates on WhatsApp ↗</a>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/login" onClick={() => setMenuOpen(false)}><Button variant="outline" className="h-10 w-full rounded-xl text-sm">Sign in</Button></Link>
              <Link href="/resume/new" onClick={() => setMenuOpen(false)}><Button className="oe-3d-button magnetic-button h-10 w-full rounded-xl text-sm">Create resume</Button></Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
