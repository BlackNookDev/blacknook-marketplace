import type { Metadata } from 'next';
import AboutContent from '@/components/about/AboutContent';
import JsonLd from '@/components/seo/JsonLd';
import { absoluteUrl, buildPageMetadata, organizationJsonLd } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Hakkımızda | Blacknook',
  description:
    'Blacknook; bağımsız yazılımcılar ve erken aşama girişimler için yazılım ve dijital ürün pazaryeridir.',
  path: '/about',
});

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Hakkımızda | Blacknook',
  url: absoluteUrl('/about'),
  description:
    'Blacknook; bağımsız yazılımcılar ve erken aşama girişimler için yazılım ve dijital ürün pazaryeridir.',
  mainEntity: organizationJsonLd(),
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <AboutContent />
    </>
  );
}
