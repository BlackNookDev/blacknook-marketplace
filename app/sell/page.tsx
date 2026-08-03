import type { Metadata } from 'next';
import AuthGate from '@/components/auth/AuthGate';
import SellContent from '@/components/sell/SellContent';
import JsonLd from '@/components/seo/JsonLd';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Ürününüzü Blacknook’ta yayınlayın',
  description:
    'SaaS ve dijital araçlarınızı Blacknook kataloğunda listeleyin. Ücretsiz başvuru, peşin maliyet yok. Görünürlük ve lansman desteği.',
  path: '/sell',
});

const sellJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Ürününüzü Blacknook’ta yayınlayın',
  url: absoluteUrl('/sell'),
  description:
    'Bağımsız geliştiriciler ve erken aşama girişimler için Blacknook partner başvuru sayfası.',
};

export default function SellPage() {
  return (
    <AuthGate fallbackHref="/login" loadingLabel="Partner programı yükleniyor…">
      <JsonLd data={sellJsonLd} />
      <SellContent />
    </AuthGate>
  );
}
