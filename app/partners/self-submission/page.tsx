import type { Metadata } from 'next';
import DemoGate from '@/components/demo/DemoGate';
import ListingWizard from '@/components/partners/ListingWizard';
import { DeveloperPortalGate } from '@/components/developers/DeveloperPortalGate';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Ürün oluştur | Geliştirici paneli',
  description:
    'Onaylı geliştiriciler için ürün oluşturma: temel bilgiler, medya, özellikler, fiyat, hikaye ve SSS.',
  path: '/partners/self-submission',
  noIndex: true,
});

export default function SelfSubmissionPage() {
  return (
    <DemoGate>
      <main className="min-h-screen bg-transparent px-4 pb-24 pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <DeveloperPortalGate title="Onay gerekli">
            <ListingWizard />
          </DeveloperPortalGate>
        </div>
      </main>
    </DemoGate>
  );
}
