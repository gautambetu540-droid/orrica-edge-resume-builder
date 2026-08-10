import type { Metadata, Viewport } from 'next';
import { Inter, Source_Sans_3, IBM_Plex_Sans, Merriweather } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

// All curated resume fonts are loaded here (once, app-wide) via
// next/font, which self-hosts them at build time. That's what makes the
// downloaded PDF render with the exact chosen font instead of silently
// falling back — the print route (app/resume/[id]/print) shares this same
// root layout, so Puppeteer sees the identical embedded fonts.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', weight: ['400', '500', '600', '700'] });
const sourceSans3 = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans-3', display: 'swap', weight: ['400', '500', '600', '700'] });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin'], variable: '--font-ibm-plex-sans', display: 'swap', weight: ['400', '500', '600', '700'] });
const merriweather = Merriweather({ subsets: ['latin'], variable: '--font-merriweather', display: 'swap', weight: ['400', '700'] });

export const metadata: Metadata = {
  title: 'Orrica Edge — Build a Better Resume. Get Hired Faster.',
  description:
    'Create, customize and optimize a professional, ATS-friendly resume in minutes with AI.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSans3.variable} ${ibmPlexSans.variable} ${merriweather.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
