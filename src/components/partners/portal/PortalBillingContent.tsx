'use client';

import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { useMineProducts } from '@/components/partners/useMineProducts';
import { PaytrTrustRow } from '@/components/PaytrLogo';

export default function PortalBillingContent() {
  const { products, loading } = useMineProducts();

  if (loading) {
    return <p className="text-sm text-zinc-500">Yükleniyor…</p>;
  }

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm text-zinc-500">
        Partner ödemesi henüz yok. {products.length} listeniz veritabanında; gelir ve fatura özeti
        gerçek sipariş gelince dolacak.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Brüt gelir', value: '$0' },
          { label: 'Platform payı', value: '$0' },
          { label: 'Net pay', value: '$0' },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <p className="text-xs text-zinc-500">{item.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <Wallet className="h-5 w-5 text-zinc-500" aria-hidden />
        <h2 className="mt-3 font-display text-lg font-semibold text-white">Ödeme yöntemi</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Banka veya ödeme hesabı bağlama henüz açık değil. Kart veya IBAN bu ekrandan toplanmaz.
          Kartlı tahsilat PayTR altyapısı üzerinden yapılacaktır.
        </p>
        <PaytrTrustRow className="mt-5" />
      </section>

      <section className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center">
        <p className="text-sm text-zinc-500">Dönem özeti yok.</p>
        <Link
          href="/partners/listings"
          className="mt-4 inline-flex text-sm font-medium text-teal-300 hover:text-teal-200"
        >
          Listelere git →
        </Link>
      </section>
    </div>
  );
}
