'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '/#features', label: 'Features' },
  { href: '/templates', label: 'Templates' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/#how-it-works', label: 'How it works' },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="shrink-0" aria-label="Orrica Edge home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-7 w-auto sm:h-8" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-neutral-600 transition-colors hover:text-neutral-950"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login">
            <Button variant="ghost" className="h-10 px-4 text-sm font-medium">
              Sign in
            </Button>
          </Link>
          <Link href="/resume/new">
            <Button className="h-10 rounded-lg px-4 text-sm font-semibold shadow-sm">
              Create resume
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-neutral-700 transition-colors hover:bg-neutral-100 md:hidden"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-black/[0.06] bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-neutral-100 py-3 text-sm font-medium text-neutral-700 last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button variant="outline" className="h-11 w-full rounded-lg">Sign in</Button>
            </Link>
            <Link href="/resume/new" onClick={() => setMenuOpen(false)}>
              <Button className="h-11 w-full rounded-lg">Create resume</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
