import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from './LoginForm';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Giriş yap | Blacknook',
  description: 'Blacknook hesabınıza giriş yapın; profil, ürünler ve faturalama ayarlarınıza erişin.',
  path: '/login',
  noIndex: true,
});

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center justify-center px-6 pb-20 pt-28">
      <Suspense fallback={<div className="text-sm text-zinc-500">Yükleniyor…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
