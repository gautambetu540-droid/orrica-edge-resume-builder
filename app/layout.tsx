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
