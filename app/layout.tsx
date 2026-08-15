import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, Source_Sans_3, IBM_Plex_Sans, Merriweather, Noto_Sans } from 'next/font/google';
import './globals.css';
import './premium-3d.css';
import './template-showcase-fix.css';
import { Toaster } from '@/components/ui/toaster';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap', weight: ['400', '500', '600', '700', '800'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', weight: ['400', '500', '600', '700'] });
const sourceSans3 = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans-3', display: 'swap', weight: ['400', '500', '600', '700'] });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-ibm-plex-sans', display: 'swap', weight: ['400', '500', '600', '700'] });
const merriweather = Merriweather({ subsets: ['latin'], variable: '--font-merriweather', display: 'swap', weight: ['400', '700'] });
const notoSans = Noto_Sans({ subsets: ['latin'], variable: '--font-noto-sans', display: 'swap', weight: ['400', '500', '600', '700'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orrica-edge-resume-builder.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Orrica Edge | AI Resume Builder & ATS Resume Maker', template: '%s | Orrica Edge' },
  description: 'Build a professional ATS-friendly resume with AI writing, modern resume templates, live preview and PDF export. Create your resume free with Orrica Edge.',
  applicationName: 'Orrica Edge', keywords: ['AI resume builder', 'resume builder', 'ATS resume builder', 'ATS friendly resume', 'resume maker', 'professional resume templates', 'resume templates', 'AI resume maker', 'free resume builder', 'resume PDF maker'],
  authors: [{ name: 'Orrica Edge' }], creator: 'Orrica Edge', publisher: 'Orrica Edge', alternates: { canonical: '/' }, robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: { type: 'website', siteName: 'Orrica Edge', url: siteUrl, title: 'Orrica Edge | AI Resume Builder & ATS Resume Maker', description: 'Create a professional, ATS-friendly resume with AI writing tools, modern templates, live preview and PDF export.', images: [{ url: '/logo-orricaedge.png', width: 1200, height: 630, alt: 'Orrica Edge AI Resume Builder' }] },
  twitter: { card: 'summary_large_image', title: 'Orrica Edge | AI Resume Builder', description: 'Build a professional ATS-friendly resume with AI and modern templates.', images: ['/logo-orricaedge.png'] },
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#ffffff', colorScheme: 'light' };

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'Orrica Edge', url: siteUrl, logo: `${siteUrl}/logo-orricaedge.png` },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Orrica Edge', url: siteUrl, publisher: { '@id': `${siteUrl}/#organization` } },
    { '@type': 'SoftwareApplication', name: 'Orrica Edge AI Resume Builder', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', url: siteUrl, description: 'AI-powered resume builder with ATS-friendly templates, live preview and PDF export.', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  ],
};

const PRINT_RESUME_STYLES = `@media print {
  .resume-page:has(.resume-print-header) .resume-print-header { position: fixed !important; top: 0 !important; left: var(--resume-margin, 15mm) !important; right: var(--resume-margin, 15mm) !important; width: auto !important; z-index: 50 !important; margin-top: 0 !important; }
  .resume-page:has(.resume-print-header--banner) .resume-print-header { left: 0 !important; right: 0 !important; width: 210mm !important; }
  .resume-page:has(.resume-print-header) > div > div:nth-child(2) { padding-top: 30mm !important; }
  .resume-page:has(.resume-print-header--banner) > div > div:nth-child(2) { padding-top: 39mm !important; }
  .resume-page:has(.resume-print-header) .break-inside-avoid-page { break-inside: auto; page-break-inside: auto; }
  .resume-page:has(.resume-print-header) .break-inside-avoid-page h2, .resume-page:has(.resume-print-header) .break-inside-avoid-page h3 { break-after: avoid; page-break-after: avoid; }
}`;

const GLOBAL_DESIGN_STYLES = `
  :root {
    --font-heading: "Proxima Nova", var(--font-noto-sans), "Noto Sans", Arial, sans-serif;
    --font-body: var(--font-noto-sans), "Noto Sans", Arial, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --oe-font-family: var(--font-body);
    --oe-font-heading: var(--font-heading);
    --oe-font-weight-regular: 400;
    --oe-font-weight-medium: 500;
    --oe-font-weight-semibold: 600;
    --oe-font-weight-bold: 700;
    --oe-color-black: #000000;
    --oe-color-primary: #C95F2D;
    --oe-color-primary-hover: #B95329;
    --oe-color-secondary: #D97845;
    --oe-color-soft-orange: #F6E7DF;
    --oe-color-light-orange: #FBF3EE;
    --oe-color-gray: #F0F0F0;
    --oe-color-white: #FFFFFF;
    --oe-color-dark: #000000;
    --oe-page: #FFFFFF;
    --oe-surface: #FFFFFF;
    --oe-line: #F0F0F0;
    --oe-ring: rgba(201,95,45,.16);
    --oe-shadow-sm: 0 8px 24px -18px rgba(0,0,0,.18);
    --oe-shadow-md: 0 24px 60px -38px rgba(0,0,0,.22);
  }

  html, body, button, input, textarea, select, option, a, label, table, th, td {
    font-family: var(--oe-font-family) !important;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--oe-font-heading) !important;
    color: var(--oe-color-black);
  }

  body { color: var(--oe-color-black); background: var(--oe-page); }
  .font-display { font-family: var(--oe-font-heading) !important; }
  .font-ui, .font-reading { font-family: var(--oe-font-family) !important; }

  a { color: inherit; }
  input:focus, select:focus, textarea:focus {
    outline: none !important;
    border-color: var(--oe-color-primary) !important;
    box-shadow: 0 0 0 4px var(--oe-ring) !important;
  }

  .oe-primary-button, button.bg-orange-500, button.bg-orange-600, .bg-orange-500 { background-color: var(--oe-color-primary) !important; }
  .oe-primary-button:hover, button.bg-orange-500:hover, button.bg-orange-600:hover, .bg-orange-500:hover { background-color: var(--oe-color-primary-hover) !important; }
  .text-orange-400, .text-orange-500, .text-orange-600, .text-orange-700 { color: var(--oe-color-primary) !important; }
  .hover\\:text-orange-400:hover, .hover\\:text-orange-500:hover, .hover\\:text-orange-600:hover, .hover\\:text-orange-700:hover { color: var(--oe-color-secondary) !important; }
  .bg-orange-50, .bg-orange-100 { background-color: var(--oe-color-soft-orange) !important; }

  .oe-glass-nav img[alt*="Orrica Edge"] { height: 32px !important; width: auto !important; max-width: 150px !important; object-fit: contain !important; object-position: left center !important; }
  @media (max-width: 767px) { .oe-glass-nav img[alt*="Orrica Edge"] { height: 26px !important; max-width: 124px !important; } }

  .oe-intro img[src*="logo-orricaedge"], .oe-choice img[src*="logo-orricaedge"], .oe-upload img[src*="logo-orricaedge"], .oe-resume-wizard img[src*="logo-orricaedge"] { height: 30px !important; width: auto !important; max-width: 150px !important; object-fit: contain !important; object-position: center !important; }
  @media (max-width: 767px) {
    .oe-intro img[src*="logo-orricaedge"], .oe-choice img[src*="logo-orricaedge"], .oe-upload img[src*="logo-orricaedge"], .oe-resume-wizard img[src*="logo-orricaedge"] { height: 26px !important; max-width: 132px !important; }
  }

  @media (min-width: 768px) {
    .oe-intro-visual { min-height: 440px !important; align-items: center !important; }
    .oe-intro-scene { width: 520px !important; height: 430px !important; max-width: 520px !important; }
  }
  @media (max-width: 767px) { .oe-intro-visual { display:none !important; } }
  @media (prefers-reduced-motion: reduce) { .oe-intro-orbit,.oe-intro-resume-card,.oe-intro-action { animation:none !important; } }

  /* Landing-page-only visual system. Content is intentionally unchanged. */
  body:has(.template-showcase-inner) main { color: #111111; }
  body:has(.template-showcase-inner) main h1,
  body:has(.template-showcase-inner) main h2,
  body:has(.template-showcase-inner) main h3 { color: #111111 !important; font-family: var(--oe-font-heading) !important; }
  body:has(.template-showcase-inner) main .text-neutral-950,
  body:has(.template-showcase-inner) main .text-neutral-900,
  body:has(.template-showcase-inner) main .text-slate-900 { color: #111111 !important; }
  body:has(.template-showcase-inner) main .text-neutral-700 { color: #333333 !important; }
  body:has(.template-showcase-inner) main .text-neutral-500,
  body:has(.template-showcase-inner) main .text-slate-500 { color: #666666 !important; }
  body:has(.template-showcase-inner) main .text-neutral-400 { color: #737373 !important; }
  body:has(.template-showcase-inner) main .bg-neutral-50 { background-color: #FFF9F4 !important; }
  body:has(.template-showcase-inner) main .bg-neutral-100 { background-color: #F7F3EF !important; }
  body:has(.template-showcase-inner) main .border-neutral-200 { border-color: #E7E0DA !important; }
  body:has(.template-showcase-inner) main .divide-neutral-200 > :not([hidden]) ~ :not([hidden]) { border-color: #E7E0DA !important; }
  body:has(.template-showcase-inner) main .bg-emerald-50 { background-color: #F6E7DF !important; }
  body:has(.template-showcase-inner) main .text-emerald-600,
  body:has(.template-showcase-inner) main .text-emerald-700 { color: #C95F2D !important; }
  body:has(.template-showcase-inner) main .bg-sky-50 { background-color: #FBF3EE !important; }
  body:has(.template-showcase-inner) main .text-sky-600,
  body:has(.template-showcase-inner) main .text-sky-700 { color: #C95F2D !important; }
  body:has(.template-showcase-inner) main .border-sky-200 { border-color: #F1CDBB !important; }
  body:has(.template-showcase-inner) main .group-hover\\:border-sky-200:hover { border-color: #F1CDBB !important; }
  body:has(.template-showcase-inner) main .font-serif { font-family: var(--oe-font-heading) !important; }
  body:has(.template-showcase-inner) main .bg-slate-950 { background-color: #111111 !important; }
  body:has(.template-showcase-inner) main .hover\\:bg-slate-800:hover { background-color: #222222 !important; }
  body:has(.template-showcase-inner) main .bg-white\\/60 { background-color: rgba(255,255,255,.82) !important; }
  body:has(.template-showcase-inner) main .bg-white\\/78 { background-color: rgba(255,255,255,.88) !important; }
  body:has(.template-showcase-inner) main .bg-white\\/82 { background-color: rgba(255,255,255,.92) !important; }
  body:has(.template-showcase-inner) main .text-white\\/60 { color: rgba(255,255,255,.72) !important; }
  body:has(.template-showcase-inner) main .text-white\\/40 { color: rgba(255,255,255,.58) !important; }
  body:has(.template-showcase-inner) main .text-orange-800\\/80 { color: #8F492D !important; }
  body:has(.template-showcase-inner) main .text-orange-800\\/75 { color: #8F492D !important; }

  @media (max-width: 767px) {
    body:has(.template-showcase-inner) main h1 { font-size: clamp(2rem, 9vw, 3rem) !important; line-height: 1.05 !important; }
    body:has(.template-showcase-inner) main h2 { line-height: 1.1 !important; }
    body:has(.template-showcase-inner) main p { text-wrap: pretty; }
  }
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${sourceSans3.variable} ${ibmPlexSans.variable} ${merriweather.variable} ${notoSans.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_DESIGN_STYLES + PRINT_RESUME_STYLES }} />
      </head>
      <body className="antialiased">{children}<Toaster /></body>
    </html>
  );
}
