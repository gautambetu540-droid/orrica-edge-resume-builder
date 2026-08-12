'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Menu, Sparkles, X, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

const JOB_CHANNEL = 'https://whatsapp.com/channel/0029VbAsVFr4Y9lwo6JDRA2t';
const NAV_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/templates', label: 'Templates' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#faq', label: 'FAQ' },
];

function getDisplayName(user: { user_metadata?: Record<string, unknown>; email?: string } | null) {
  const metadata = user?.user_metadata || {};
  const value = metadata.full_name || metadata.name || metadata.display_name;
  if (typeof value === 'string' && value.trim()) return value.trim();
  return user?.email?.split('@')[0] || 'Account';
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (active) setDisplayName(data.user ? getDisplayName(data.user) : null);
    };

    void loadUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setDisplayName(session?.user ? getDisplayName(session.user) : null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="relative z-[60] overflow-hidden bg-neutral-950 text-center text-[9px] font-semibold text-neutral-300 sm:text-[10px]">
        <div className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="relative mx-auto flex min-h-7 max-w-7xl items-center justify-center gap-1.5 px-3 py-1 sm:h-8 sm:gap-2 sm:px-5 sm:py-0">
          <Sparkles className="h-2.5 w-2.5 shrink-0 text-orange-400 animate-pulse-glow sm:h-3 sm:w-3" />
          <span className="hidden sm:inline">AI-assisted resumes · ATS-ready templates · Live preview · PDF export</span>
          <span className="sm:hidden">AI resume builder · Free to start</span>
          <span className="hidden text-neutral-600 sm:inline">|</span>
          <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="whitespace-nowrap font-bold text-white transition-colors hover:text-orange-400">Free job updates ↗</a>
        </div>
      </div>

      <header className="oe-glass-nav sticky top-0 z-50">
        <div className="mx-auto flex h-[66px] w-full max-w-[1280px] items-center px-4 sm:h-[72px] sm:px-6 lg:h-[76px] lg:px-8">
          <Link href="/" className="group shrink-0" aria-label="Orrica Edge home">
            <img src="/logo-orricaedge.png" alt="Orrica Edge AI Resume Builder" className="h-[23px] w-auto transition-transform duration-300 group-hover:scale-[1.035] sm:h-7" />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-7 xl:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="group relative whitespace-nowrap py-2 text-[13px] font-semibold text-neutral-600 transition-colors hover:text-neutral-950">
                {link.label}
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-orange-500 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
            <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="whitespace-nowrap rounded-xl px-3 py-2.5 text-[13px] font-semibold text-neutral-600 transition-colors hover:bg-orange-50 hover:text-orange-700">Free jobs</a>
            {displayName ? (
              <Link href="/dashboard" className="flex max-w-[190px] items-center gap-2 rounded-xl border border-neutral-200 bg-white/70 px-3.5 py-2 text-[13px] font-semibold text-neutral-800 shadow-sm transition-all hover:border-orange-200 hover:bg-orange-50/60">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600"><UserRound className="h-3.5 w-3.5" /></span>
                <span className="truncate">{displayName}</span>
              </Link>
            ) : (
              <Link href="/login"><Button variant="ghost" className="h-10 rounded-xl px-3.5 text-[13px] font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950">Sign in</Button></Link>
            )}
            <Link href="/resume/new">
              <Button className="oe-primary-button h-[46px] rounded-[13px] px-[20px] text-[13px] font-bold shadow-[0_10px_25px_-12px_rgba(242,106,33,.55)] transition-all duration-200 hover:-translate-y-0.5">
                Create resume <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-1 lg:hidden">
            {displayName ? (
              <span className="hidden max-w-[120px] truncate px-2 text-[11px] font-semibold text-neutral-700 sm:inline">{displayName}</span>
            ) : (
              <Link href="/login" className="shrink-0"><Button variant="ghost" className="h-9 rounded-lg px-2.5 text-[12px] font-semibold text-neutral-700">Sign in</Button></Link>
            )}
            <Link href="/resume/new" className="shrink-0"><Button className="oe-primary-button h-10 rounded-[11px] px-3.5 text-[12px] font-bold">Create <ArrowUpRight className="ml-0.5 h-3 w-3" /></Button></Link>
            <button className="ml-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-700 transition-colors hover:bg-neutral-100" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}</button>
          </div>
        </div>

        {menuOpen && (
          <div className="animate-fade-in-up border-t border-black/[0.06] bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-5 lg:hidden">
            <nav className="flex flex-col">
              {NAV_LINKS.map((link, index) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`reveal-${Math.min(index + 1, 6)} animate-fade-in-up border-b border-neutral-100 py-3 text-sm font-semibold text-neutral-700 last:border-0`}>{link.label}</Link>)}
            </nav>
            <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">Get free job updates ↗</a>
            {!displayName && <Link href="/login" onClick={() => setMenuOpen(false)} className="mt-2 flex h-10 items-center justify-center rounded-xl border border-neutral-200 text-sm font-semibold">Sign in</Link>}
          </div>
        )}
      </header>
    </>
  );
}
