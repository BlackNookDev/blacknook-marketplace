'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, PlusCircle, Clock } from 'lucide-react';
import StatusBadge from '@/components/demo/StatusBadge';
import { getMyProducts, type DemoVendorProduct, VENDOR_EVENT } from '@/lib/demoVendor';

export default function VendorDashboard() {
  const [products, setProducts] = useState<DemoVendorProduct[]>([]);

  useEffect(() => {
    const tick = () => setProducts(getMyProducts());
    tick();
    window.addEventListener(VENDOR_EVENT, tick);
    return () => window.removeEventListener(VENDOR_EVENT, tick);
  }, []);

  const pending = products.filter((p) => p.status === 'pending').length;
  const approved = products.filter((p) => p.status === 'approved').length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <p className="text-xs text-zinc-500">Toplam ürün</p>
          <p className="mt-2 font-display text-3xl font-bold text-white">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <p className="text-xs text-zinc-500">İncelemede</p>
          <p className="mt-2 font-display text-3xl font-bold text-amber-300">{pending}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <p className="text-xs text-zinc-500">Yayında</p>
          <p className="mt-2 font-display text-3xl font-bold text-emerald-300">{approved}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/partners/self-submission"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" aria-hidden />
          Yeni ürün
        </Link>
        <Link
          href="/vendor/products"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-100 hover:bg-white/[0.08]"
        >
          <Package className="h-4 w-4" aria-hidden />
          Tüm ürünler
        </Link>
      </div>

      <section>
        <h2 className="mb-4 text-base font-semibold text-zinc-100">Son ürünler</h2>
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
            <Clock className="mx-auto h-8 w-8 text-zinc-600" aria-hidden />
            <p className="mt-3 text-sm text-zinc-500">Henüz ürün yok. İlk ürününüzü ekleyin.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {products.slice(0, 5).map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-100">{p.title}</p>
                  <p className="text-xs text-zinc-500">
                    {p.category} · {p.tiers.length} plan
                  </p>
                </div>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
