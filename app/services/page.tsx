import type { Metadata } from 'next';
import { Suspense } from 'react';
import ServicesBrowse from '@/components/services/ServicesBrowse';
import JsonLd from '@/components/seo/JsonLd';
import { SERVICES } from '../../lib/data';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Ekosistem | Blacknook',
  description:
    'Self-host ve iş araçları ekosistemini keşfedin. Kurulum talep edin; bulut yazılım, mini yazılım ve betikler yakında.',
  path: '/services',
});

const itemList = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Ekosistem | Blacknook',
  url: absoluteUrl('/services'),
  description: 'Blacknook yazılım ekosistemi — self-host ve iş araçları kataloğu',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: SERVICES.length,
    itemListElement: SERVICES.slice(0, 24).map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(`/service/${service.slug}`),
      name: service.name,
    })),
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-transparent pb-24 pt-28">
      <JsonLd data={itemList} />
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-6 py-20 text-center text-sm text-zinc-500">
            Hub yükleniyor…
          </div>
        }
      >
        <ServicesBrowse />
      </Suspense>
    </main>
  );
}
