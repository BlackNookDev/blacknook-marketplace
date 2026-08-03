import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import ForgotPasswordForm from './ForgotPasswordForm';

export const metadata: Metadata = buildPageMetadata({
  title: 'Şifre sıfırlama | Blacknook',
  description: 'Blacknook hesabınızın şifresini güvenli şekilde sıfırlayın.',
  path: '/forgot-password',
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-6rem)] max-w-7xl items-center justify-center overflow-hidden px-6 pb-20 pt-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.07),transparent_55%)]"
        aria-hidden
      />
      <ForgotPasswordForm />
    </main>
  );
}
