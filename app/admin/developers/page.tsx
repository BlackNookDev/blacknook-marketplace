import type { Metadata } from 'next';
import AuthGate from '@/components/auth/AuthGate';
import PanelNav from '@/components/demo/PanelNav';
import { buildPageMetadata } from '@/lib/seo';
import AdminDevelopersClient from './AdminDevelopersClient';

export const metadata: Metadata = buildPageMetadata({
  title: 'Geliştirici başvuruları | Admin',
  description: 'Geliştirici başvurularını onaylayın veya reddedin.',
  path: '/admin/developers',
  noIndex: true,
});

export default function AdminDevelopersPage() {
  return (
    <AuthGate allowRoles={['admin']} fallbackHref="/account">
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-28 sm:px-6">
        <PanelNav variant="admin" />
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Geliştirici başvuruları
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Onay / red. Ürünler için Ürünler sayfası.
        </p>
        <div className="mt-10">
          <AdminDevelopersClient />
        </div>
      </main>
    </AuthGate>
  );
}
