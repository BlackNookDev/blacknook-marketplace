import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getAllServiceSlugs } from '../lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/services',
    '/about',
    '/careers',
    '/learn/online-isletme',
    '/learn/creator-economy',
    '/sell',
    '/select',
    '/help',
    '/terms',
    '/privacy',
    '/login',
    '/register',
  ].map((path) => ({
    url: `${SITE_URL}${path || '/'}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/services' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : path === '/services' || path === '/sell' || path === '/select' || path === '/careers' ? 0.9 : 0.7,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = getAllServiceSlugs().map((slug) => ({
    url: `${SITE_URL}/service/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
