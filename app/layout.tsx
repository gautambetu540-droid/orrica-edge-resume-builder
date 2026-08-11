import type { Metadata, Viewport } from 'next';
import { Inter, Source_Sans_3, IBM_Plex_Sans, Merriweather } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', weight: ['400', '500', '600', '700'] });
const sourceSans3 = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans-3', display: 'swap', weight: ['400', '500', '600', '700'] });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-ibm-plex-sans', display: 'swap', weight: ['400', '500', '600', '700'] });
const merriweather = Merriweather({ subsets: ['latin'], variable: '--font-merriweather', display: 'swap', weight: ['400', '700'] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://orrica-edge-resume-builder.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Orrica Edge | AI Resume Builder & ATS Resume Maker', template: '%s | Orrica Edge' },
  description: 'Build a professional ATS-friendly resume with AI writing, modern resume templates, live preview and PDF export. Create your resume free with Orrica Edge.',
  applicationName: 'Orrica Edge',
  keywords: ['AI resume builder', 'resume builder', 'ATS resume builder', 'ATS friendly resume', 'resume maker', 'professional resume templates', 'resume templates', 'AI resume maker', 'free resume builder', 'resume PDF maker'],
  authors: [{ name: 'Orrica Edge' }],
  creator: 'Orrica Edge',
  publisher: 'Orrica Edge',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  openGraph: {
    type: 'website', siteName: 'Orrica Edge', url: siteUrl,
    title: 'Orrica Edge | AI Resume Builder & ATS Resume Maker',
    description: 'Create a professional, ATS-friendly resume with AI writing tools, modern templates, live preview and PDF export.',
    images: [{ url: '/logo-orricaedge.png', width: 1200, height: 630, alt: 'Orrica Edge AI Resume Builder' }],
  },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSans3.variable} ${ibmPlexSans.variable} ${merriweather.variable}`}>
      <head><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></head>
      <body className="font-sans antialiased">{children}<Toaster /></body>
    </html>
  );
}
