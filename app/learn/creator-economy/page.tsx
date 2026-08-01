import type { Metadata } from 'next';
import GuideCreatorEconomyContent from '@/components/learn/GuideCreatorEconomyContent';
import JsonLd from '@/components/seo/JsonLd';
import { absoluteUrl, articleJsonLd, buildPageMetadata } from '@/lib/seo';

const title = 'Creator economy nedir?';
const description =
  'Creator economy nedir, nasıl başlanır, platform seçimi, gelir modelleri ve 2026 trendleri. Blacknook öğren rehberi.';
const path = '/learn/creator-economy';

export const metadata: Metadata = buildPageMetadata({
  title: `${title} | Blacknook`.slice(0, 60),
  description,
  path,
  type: 'article',
  image: absoluteUrl('/learn/creator-economy-hero.png'),
});

export default function GuideCreatorEconomyPage() {
  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title,
          description,
          path,
          datePublished: '2026-08-01',
        })}
      />
      <GuideCreatorEconomyContent />
    </>
  );
}
