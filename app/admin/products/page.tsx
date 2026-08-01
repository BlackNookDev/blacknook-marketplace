import type { Metadata } from 'next';
import DemoGate from '@/components/demo/DemoGate';
import PanelNav from '@/components/demo/PanelNav';
import { buildPageMetadata } from '@/lib/seo';
import AdminProductsClient from './AdminProductsClient';

export const metadata: Metadata = buildPageMetadata({
  title: 'Ürün moderasyonu | Admin',
  description: 'Vendor ürünlerini onaylayın veya reddedin.',
  path: '/admin/products',
  noIndex: true,
});

export default function AdminProductsPage() {
  return (
    <DemoGate>
      <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-28 sm:px-6">
        <PanelNav variant="admin" />
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ürün moderasyonu
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Onaylanan ürünler ileride katalogda yayınlanacak (demo: yalnızca durum güncellenir).
        </p>
        <div className="mt-10">
          <AdminProductsClient />
        </div>
      </main>
    </DemoGate>
  );
}
