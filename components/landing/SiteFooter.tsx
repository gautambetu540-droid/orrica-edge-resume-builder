import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/templates', label: 'Templates' },
      { href: '/#features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/resume/new', label: 'Create Resume' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/login', label: 'Sign In' },
      { href: '/dashboard', label: 'Dashboard' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-orricaedge.png" alt="Orrica Edge" className="h-7 w-auto mb-3" />
          <p className="text-sm text-muted-foreground max-w-[220px]">
            Build a better resume, get hired faster — with AI that only works from what's actually true.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Orrica Edge. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Made with Orrica Edge</p>
        </div>
      </div>
    </footer>
  );
}
