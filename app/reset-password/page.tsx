import { Suspense } from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import ResetPasswordForm from './ResetPasswordForm';

export const metadata: Metadata = buildPageMetadata({
  title: 'Yeni şifre | Blacknook',
  description: 'Blacknook hesabınız için yeni şifre belirleyin.',
  path: '/reset-password',
  noIndex: true,
});

export default function ResetPasswordPage() {
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center justify-center overflow-hidden px-6 pb-20 pt-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.07),transparent_55%)]"
        aria-hidden
      />
      <Suspense fallback={<div className="text-sm text-zinc-500">Yükleniyor…</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
