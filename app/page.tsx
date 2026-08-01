import type { Metadata } from 'next';
import HomeMotion from '@/components/HomeMotion';
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  path: '/',
});

export default function HomePage() {
  return <HomeMotion />;
}
