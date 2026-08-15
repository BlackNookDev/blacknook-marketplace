import type { MetadataRoute } from 'next';
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#161618',
    theme_color: '#161618',
    icons: [
      { src: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { src: '/favicon-96.png', sizes: '96x96', type: 'image/png' },
      { src: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
