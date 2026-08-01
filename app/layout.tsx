import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Syne, Source_Sans_3 } from 'next/font/google';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import SiteFooter from '@/components/SiteFooter';
import TechLogoLoop from '@/components/TechLogoLoop';
import SiteBackground from '@/components/SiteBackground';
import JsonLd from '@/components/seo/JsonLd';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  buildPageMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/seo';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  themeColor: '#161618',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildPageMetadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
  }),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  authors: [{ name: 'Blacknook', url: SITE_URL }],
  creator: 'Blacknook',
  publisher: 'Blacknook',
  keywords: [
    'Blacknook',
    'yazılım pazaryeri',
    'SaaS',
    'geliştirici araçları',
    'dijital ürün',
    'indie hacker',
    'marketplace',
  ],
  category: 'technology',
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
  },
  openGraph: {
    ...buildPageMetadata({
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      path: '/',
    }).openGraph,
    images: [{ url: OG_IMAGE, width: 1000, height: 1000, alt: SITE_NAME }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${syne.variable} ${sourceSans.variable} bg-bn-bg text-white`}>
      <body className="relative min-h-screen bg-transparent font-sans text-white antialiased">
        <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
        <SiteBackground />
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
          >
            İçeriğe atla
          </a>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <div id="main-content" className="relative z-0 flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <TechLogoLoop />
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
