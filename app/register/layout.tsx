import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Kayıt ol | Blacknook',
  description: 'Blacknook Marketplace hesabı oluşturun; ekosistemi keşfedin ve kurulum talep edin.',
  path: '/register',
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
