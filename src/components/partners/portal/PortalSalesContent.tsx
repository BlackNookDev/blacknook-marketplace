'use client';

import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { useMineProducts } from '@/components/partners/useMineProducts';

export default function PortalSalesContent() {
  const { products, loading } = useMineProducts();
  const approved = products.filter((p) => p.status === 'approved');

  if (loading) {
    return <p className="text-sm text-zinc-500">Yükleniyor…</p>;
  }

  if (approved.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
        <BarChart3 className="mx-auto h-10 w-10 text-zinc-600" aria-hidden />
        <h2 className="mt-4 font-display text-xl font-semibold text-white">Henüz satış yok</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
          Satış ve analitik, yayındaki listeniz ve gerçek siparişler olduğunda burada görünür. Sahte
          sipariş üretilmez.
        </p>
        <Link
          href="/partners/listings"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
        >
          Listelere git
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-500">
        {approved.length} ürün yayında. Ödeme altyapısı henüz açık olmadığı için sipariş ve gelir 0.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Yayındaki liste', value: String(approved.length) },
          { label: 'Sipariş', value: '0' },
          { label: 'Gelir', value: '$0' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <p className="text-xs text-zinc-500">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-white/15 px-6 py-10 text-center">
        <p className="text-sm text-zinc-500">Sipariş geçmişi boş. Satın alma açılınca burada listelenir.</p>
      </div>
    </div>
  );
}
