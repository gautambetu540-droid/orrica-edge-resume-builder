import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans, Source_Sans_3, IBM_Plex_Sans, Merriweather } from 'next/font/google';
import './globals.css';
import './premium-3d.css';
import { Toaster } from '@/components/ui/toaster';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap', weight: ['400', '500', '600', '700', '800'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', weight: ['400', '500', '600', '700'] });
const sourceSans3 = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans-3', display: 'swap', weight: ['400', '500', '600', '700'] });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-ibm-plex-sans', display: 'swap', weight: ['400', '500', '600', '700'] });
const merriweather = Merriweather({ subsets: ['latin'], variable: '--font-merriweather', display: 'swap', weight: ['400', '700'] });

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
    --oe-font-family: "Proxima Nova", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --oe-font-weight-regular: 400;
    --oe-font-weight-medium: 500;
    --oe-font-weight-semibold: 600;
    --oe-font-weight-bold: 700;
    --oe-color-black: #000000;
    --oe-color-gray: #F0F0F0;
    --oe-color-dark: #111827;
    --oe-color-sky: #0EA5E9;
    --oe-color-sky-hover: #0284C7;
    --oe-color-sky-dark: #0369A1;
    --oe-color-sky-light: #E0F2FE;
    --oe-color-sky-pale: #F0F9FF;
    --oe-color-light: #E0F2FE;
  }

  html, body, button, input, textarea, select, option, a, label, table, th, td {
    font-family: var(--oe-font-family) !important;
  }

  body { color: var(--oe-color-black); }
  .font-display, .font-ui, .font-reading { font-family: var(--oe-font-family) !important; }

  /* Orrica Edge desktop resume-builder intro visual: a restrained laptop/product scene.
     It intentionally stays desktop-only; phones get the clean text-first experience. */
  @media (min-width: 768px) {
    .oe-intro-visual { min-height: 440px !important; align-items: center !important; }
    .oe-intro-scene { width: 520px !important; height: 430px !important; max-width: 520px !important; }
    .oe-intro-orbit {
      right: 62px !important; top: 35px !important; width: 270px !important; height: 270px !important;
      background: radial-gradient(circle, rgba(255,106,33,.20) 0%, rgba(255,106,33,.08) 45%, rgba(255,106,33,0) 72%) !important;
      filter: blur(2px); animation: oeDesktopGlow 7s ease-in-out infinite !important;
    }
    .oe-intro-orbit-hole { display:none !important; }
    .oe-intro-teal-backplate {
      right: 49px !important; top: 351px !important; width: 388px !important; height: 31px !important;
      border-radius: 0 0 18px 18px !important; background: linear-gradient(180deg,#30343a,#15181c) !important;
      transform: perspective(900px) rotateX(56deg) !important; z-index: 2 !important;
      box-shadow: 0 18px 28px -18px rgba(15,18,22,.48) !important;
    }
    .oe-intro-teal-backplate::after {
      content:""; position:absolute; left:50%; top:5px; width:72px; height:12px; transform:translateX(-50%);
      border-radius:0 0 8px 8px; background:#24282d; box-shadow:inset 0 1px 0 rgba(255,255,255,.08);
    }
    .oe-intro-resume-card {
      right: 66px !important; top: 48px !important; width: 354px !important; height: 300px !important;
      border: 1px solid #22282e !important; border-radius: 15px !important; background:#11151a !important;
      box-shadow: 0 32px 65px -34px rgba(15,18,22,.55), 0 0 0 5px rgba(255,255,255,.38) !important;
      animation: oeDesktopLaptop 7s cubic-bezier(.2,.7,.2,1) infinite !important;
    }
    .oe-intro-resume-card::before {
      content:""; position:absolute; left:50%; top:7px; z-index:8; width:5px; height:5px; transform:translateX(-50%);
      border-radius:999px; background:#5e646c; box-shadow:0 0 0 2px #1d2227;
    }
    .oe-intro-resume-card::after {
      content:""; position:absolute; left:0; right:0; top:0; z-index:7; height:19px;
      background:linear-gradient(180deg,#2a3036,#171b20); border-radius:14px 14px 0 0;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.08);
    }
    .oe-intro-resume-page {
      left:50% !important; top:24px !important; width:794px !important;
      transform:translateX(-50%) scale(.345) !important; transform-origin:top center !important;
      z-index:3;
    }
    .oe-intro-actions {
      right: 9px !important; top: 73px !important; width: 120px !important; gap: 8px !important; z-index: 12 !important;
    }
    .oe-intro-action {
      height: 38px !important; border-radius: 12px !important; border: 1px solid rgba(20,20,20,.10) !important;
      background:rgba(255,255,255,.94) !important; color:#171717 !important; font-size:11px !important;
      box-shadow:0 14px 26px -18px rgba(15,18,22,.55) !important; backdrop-filter:blur(10px);
      animation:oeDesktopAction 7s ease-in-out infinite !important;
    }
    .oe-intro-download { background:#ff6a21 !important; color:#fff !important; border-color:#ff6a21 !important; }
    .oe-intro-print { animation-delay:.15s !important; }
    .oe-intro-email { animation-delay:.3s !important; }
    .oe-intro-visual::after {
      content:"ATS-ready  •  Live preview  •  PDF export"; position:absolute; margin-top:425px;
      font-size:10px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:#8a8f95;
    }
  }
  @keyframes oeDesktopGlow { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.035)} }
  @keyframes oeDesktopLaptop { 0%,100%{transform:translateY(0) rotateX(0deg) rotateY(0deg)} 50%{transform:translateY(-6px) rotateX(.4deg) rotateY(-.6deg)} }
  @keyframes oeDesktopAction { 0%,10%{opacity:.35;transform:translateX(9px)} 18%,82%{opacity:1;transform:translateX(0)} 91%,100%{opacity:.35;transform:translateX(9px)} }

  @media (max-width: 767px) {
    .oe-intro-visual { display:none !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    .oe-intro-orbit,.oe-intro-resume-card,.oe-intro-action { animation:none !important; }
  }
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${sourceSans3.variable} ${ibmPlexSans.variable} ${merriweather.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_DESIGN_STYLES + PRINT_RESUME_STYLES }} />
      </head>
      <body className="antialiased">{children}<Toaster /></body>
    </html>
  );
}
