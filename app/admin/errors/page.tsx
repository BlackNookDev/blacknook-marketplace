import type { Metadata } from 'next';
import AuthGate from '@/components/auth/AuthGate';
import PanelNav from '@/components/demo/PanelNav';
import { buildPageMetadata } from '@/lib/seo';
import AdminErrorsClient from './AdminErrorsClient';

export const metadata: Metadata = buildPageMetadata({
  title: 'Sunucu hataları | Admin',
  description: 'API ve veritabanı hata kayıtları.',
  path: '/admin/errors',
  noIndex: true,
});

export default function AdminErrorsPage() {
  return (
    <AuthGate allowRoles={['admin']} fallbackHref="/account">
      <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-28 sm:px-6">
        <PanelNav variant="admin" />
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Sunucu hataları
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          500 yanıtlarının Postgres kodu, tablo/kolon ve stack izi burada tutulur.
        </p>
        <div className="mt-10">
          <AdminErrorsClient />
        </div>
      </main>
    </AuthGate>
  );
}
