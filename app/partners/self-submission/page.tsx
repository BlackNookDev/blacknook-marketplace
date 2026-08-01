import type { Metadata } from 'next';
import DemoGate from '@/components/demo/DemoGate';
import ListingWizard from '@/components/partners/ListingWizard';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Ürün oluştur | Blacknook Partners',
  description:
    'Blacknook partner portalında ürününüzü oluşturun: temel bilgiler, medya, özellikler, fiyat, hikaye ve SSS.',
  path: '/partners/self-submission',
  noIndex: true,
});

export default function SelfSubmissionPage() {
  return (
    <DemoGate>
      <main className="min-h-screen bg-transparent px-4 pb-24 pt-28 sm:px-6">
        <ListingWizard />
      </main>
    </DemoGate>
  );
}
