import type { Metadata } from 'next';
import GuideOnlineBusinessContent from '@/components/learn/GuideOnlineBusinessContent';
import JsonLd from '@/components/seo/JsonLd';
import { articleJsonLd, buildPageMetadata } from '@/lib/seo';

const title = 'Online işletme nasıl başlatılır';
const description =
  'Freelance, e-ticaret, içerik ve SaaS modelleriyle online işletme kurmanın 6 adımlık rehberi. Blacknook için uyarlandı.';
const path = '/learn/online-isletme';

export const metadata: Metadata = buildPageMetadata({
  title: `${title} | Blacknook`.slice(0, 60),
  description,
  path,
  type: 'article',
});

export default function GuideOnlineBusinessPage() {
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
      <GuideOnlineBusinessContent />
    </>
  );
}
