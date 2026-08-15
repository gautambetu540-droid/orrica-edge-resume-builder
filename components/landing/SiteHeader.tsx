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
  { href: '/faq', label: 'FAQ' },
];

function getDisplayName(user: { user_metadata?: Record<string, unknown>; email?: string } | null) {
  const metadata = user?.user_metadata || {};
  const value = metadata.full_name || metadata.name || metadata.display_name;
  if (typeof value === 'string' && value.trim()) return value.trim();
  return user?.email?.split('@')[0] || 'Account';
}

function BrandLogo() {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span className="whitespace-nowrap text-[18px] font-extrabold tracking-[-0.07em] text-neutral-950 sm:text-[20px]">orrica<span className="text-[#C95F2D]">edge</span></span>
  ) : (
    <img src="/logo-orricaedge.png" alt="Orrica Edge AI Resume Builder" onError={() => setFailed(true)} className="h-[30px] w-auto max-w-[142px] object-contain object-left transition-transform duration-200 group-hover:scale-[1.01] sm:h-[32px] sm:max-w-[150px] lg:h-[34px] lg:max-w-[158px]" />
  );
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
    return () => { active = false; listener.subscription.unsubscribe(); };
  }, []);

  return (
    <>
      <div className="relative z-[60] overflow-hidden bg-[#111111] text-center text-[9px] font-semibold text-[#D4D4D4] sm:text-[10px]">
        <div className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        <div className="relative mx-auto flex min-h-7 max-w-7xl items-center justify-center gap-1.5 px-3 py-1 sm:h-8 sm:gap-2 sm:px-5 sm:py-0">
          <Sparkles className="h-2.5 w-2.5 shrink-0 text-[#F29A6A] sm:h-3 sm:w-3" />
          <span className="hidden sm:inline">AI-assisted resumes · ATS-ready templates · Live preview · PDF export</span>
          <span className="sm:hidden">AI resume builder · Free to start</span>
          <span className="hidden text-[#555555] sm:inline">|</span>
          <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="whitespace-nowrap font-bold text-white transition-colors hover:text-[#F29A6A]">Free job updates ↗</a>
        </div>
      </div>

      <header className="oe-glass-nav sticky top-0 z-50">
        <div className="mx-auto flex h-[64px] w-full max-w-[1280px] items-center px-3 sm:h-[70px] sm:px-6 lg:h-[72px] lg:px-8">
          <Link href="/" className="group flex h-full min-w-0 shrink-0 items-center" aria-label="Orrica Edge home"><BrandLogo /></Link>
          <nav className="hidden flex-1 items-center justify-center gap-6 xl:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => <Link key={link.href} href={link.href} className="group relative whitespace-nowrap py-2 text-[13px] font-semibold text-[#333333] transition-colors hover:text-[#C95F2D]">{link.label}<span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#C95F2D] transition-transform duration-200 group-hover:scale-x-100" /></Link>)}
          </nav>
          <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
            <a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="whitespace-nowrap rounded-xl px-3 py-2.5 text-[13px] font-semibold text-[#333333] transition-colors hover:bg-[#F6E7DF] hover:text-[#C95F2D]">Free jobs</a>
            {displayName ? <Link href="/dashboard" className="flex max-w-[190px] items-center gap-2 rounded-xl border border-[#E7E0DA] bg-white px-3.5 py-2 text-[13px] font-semibold text-[#222222] shadow-sm transition-all hover:border-[#D97845] hover:bg-[#FFF9F4]"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F6E7DF] text-[#C95F2D]"><UserRound className="h-3.5 w-3.5" /></span><span className="truncate">{displayName}</span></Link> : <Link href="/login"><Button variant="ghost" className="h-10 rounded-xl px-3.5 text-[13px] font-semibold text-[#333333] hover:bg-[#F6E7DF] hover:text-[#C95F2D]">Sign in</Button></Link>}
            <Link href="/resume/new"><Button className="oe-primary-button h-[44px] rounded-[12px] bg-[#C95F2D] px-[19px] text-[13px] font-bold text-white shadow-[0_10px_25px_-12px_rgba(201,95,45,.38)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#B95329]">Create resume <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" /></Button></Link>
          </div>
          <div className="ml-auto flex items-center gap-1 lg:hidden">
            {displayName ? <span className="hidden max-w-[90px] truncate px-1.5 text-[11px] font-semibold text-[#333333] sm:inline">{displayName}</span> : <Link href="/login" className="shrink-0"><Button variant="ghost" className="h-9 rounded-lg px-2 text-[12px] font-semibold text-[#333333]">Sign in</Button></Link>}
            <Link href="/resume/new" className="shrink-0"><Button className="oe-primary-button h-9 rounded-[10px] bg-[#C95F2D] px-3 text-[11px] font-bold text-white hover:bg-[#B95329]">Create <ArrowUpRight className="ml-0.5 h-3 w-3" /></Button></Link>
            <button className="ml-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#333333] transition-colors hover:bg-[#F6E7DF] hover:text-[#C95F2D]" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}</button>
          </div>
        </div>
        {menuOpen && <div className="animate-fade-in-up border-t border-[#E7E0DA] bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-xl sm:px-5 lg:hidden"><nav className="flex flex-col">{NAV_LINKS.map((link, index) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`reveal-${Math.min(index + 1, 6)} animate-fade-in-up border-b border-[#E7E0DA] py-3 text-sm font-semibold text-[#333333] last:border-0 hover:text-[#C95F2D]`}>{link.label}</Link>)}</nav><a href={JOB_CHANNEL} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center rounded-xl bg-[#F6E7DF] px-4 py-3 text-sm font-bold text-[#C95F2D]">Get free job updates ↗</a>{!displayName && <Link href="/login" onClick={() => setMenuOpen(false)} className="mt-2 flex h-10 items-center justify-center rounded-xl border border-[#E7E0DA] text-sm font-semibold text-[#333333] hover:border-[#D97845] hover:text-[#C95F2D]">Sign in</Link>}</div>}
      </header>
    </>
  );
}
