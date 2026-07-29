import type { Metadata } from 'next';
import { Syne, Source_Sans_3 } from 'next/font/google';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TechLogoLoop from '@/components/TechLogoLoop';
import SiteBackground from '@/components/SiteBackground';
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

export const metadata: Metadata = {
  title: 'BlackNOOK — Dijital Pazaryeri',
  description:
    'Yapay zeka araçları, SaaS yazılımları ve geliştirici paketlerini ömür boyu lisansla keşfedin.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${syne.variable} ${sourceSans.variable} bg-bn-bg text-white`}>
      <body className="relative min-h-screen bg-transparent font-sans text-white antialiased">
        <SiteBackground />
        <Providers>
          <Navbar />
          <div className="relative z-0 flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <TechLogoLoop />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
