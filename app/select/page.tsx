import type { Metadata } from 'next';
import SelectContent from '@/components/select/SelectContent';
import JsonLd from '@/components/seo/JsonLd';
import { absoluteUrl, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Blacknook Select | Özel lansman programı',
  description:
    'Blacknook Select: seçilmiş SaaS ve yazılım ürünleri için özel lansman, strateji ve görünürlük. Peşin maliyet yok.',
  path: '/select',
});

const selectJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Blacknook Select',
  url: absoluteUrl('/select'),
  description:
    'Seçilmiş yazılım ürünleri için Blacknook özel lansman ve büyüme programı.',
};

export default function SelectPage() {
  return (
    <>
      <JsonLd data={selectJsonLd} />
      <SelectContent />
    </>
  );
}
