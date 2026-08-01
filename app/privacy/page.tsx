import type { Metadata } from 'next';
import PrivacyContent from '@/components/legal/PrivacyContent';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Gizlilik Politikası | Blacknook',
  description:
    'Blacknook gizlilik politikası: hangi verileri topladığımız, nasıl kullandığımız ve haklarınız.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return <PrivacyContent />;
}
