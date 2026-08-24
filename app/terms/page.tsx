import type { Metadata } from 'next';
import TermsContent from '@/components/legal/TermsContent';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Kullanım Koşulları | Blacknook',
  description:
    'Blacknook yazılım ekosistemi kullanım koşulları: hesap, satın alma, içerik ve sorumluluk sınırları.',
  path: '/terms',
});

export default function TermsPage() {
  return <TermsContent />;
}
