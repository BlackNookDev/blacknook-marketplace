'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CreditCard, FileText, Wallet } from 'lucide-react';
import { getMyProducts, VENDOR_EVENT } from '@/lib/demoVendor';
import { buildDemoSales, formatTry } from '@/lib/partnerPortal';

export default function PortalBillingContent() {
  const [productCount, setProductCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const tick = () => {
      const products = getMyProducts();
      setProductCount(products.length);
      const sales = buildDemoSales(products).filter((s) => s.status === 'completed');
      setRevenue(sales.reduce((a, s) => a + s.amount, 0));
    };
    tick();
    window.addEventListener(VENDOR_EVENT, tick);
    return () => window.removeEventListener(VENDOR_EVENT, tick);
  }, []);

  const payoutReady = revenue > 0;
  const platformFee = useMemo(() => Math.round(revenue * 0.15), [revenue]);
  const net = revenue - platformFee;

  const invoices = useMemo(() => {
    if (!payoutReady) return [];
    return [
      {
        id: 'inv_demo_1',
        label: 'Haziran 2026 dönem özeti',
        amount: net,
        status: 'Ödenecek',
        date: '2026-07-05',
      },
      {
        id: 'inv_demo_2',
        label: 'Mayıs 2026 dönem özeti',
        amount: Math.max(40, Math.round(net * 0.6)),
        status: 'Ödendi',
        date: '2026-06-05',
      },
    ];
  }, [payoutReady, net]);

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm text-zinc-500">
        Partner ödemeleri, fatura özetleri ve ödeme yöntemi ayarları. Gerçek satışlar oluşunca burada
        görünür.
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <Wallet className="h-5 w-5 text-teal-300/90" aria-hidden />
          <p className="mt-3 text-xs text-zinc-500">Brüt gelir</p>
          <p className="mt-1 font-display text-2xl font-bold text-white">{formatTry(revenue)}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <CreditCard className="h-5 w-5 text-zinc-400" aria-hidden />
          <p className="mt-3 text-xs text-zinc-500">Platform payı (%15)</p>
          <p className="mt-1 font-display text-2xl font-bold text-white">{formatTry(platformFee)}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <FileText className="h-5 w-5 text-emerald-300/90" aria-hidden />
          <p className="mt-3 text-xs text-zinc-500">Net partner payı</p>
          <p className="mt-1 font-display text-2xl font-bold text-white">{formatTry(net)}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-white">Ödeme yöntemi</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Canlı ortamda banka / Stripe Connect bilgilerinizi buradan bağlarsınız. Henüz bağlı hesap
          yok.
        </p>
        <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-zinc-950/40 px-4 py-5">
          <p className="text-sm text-zinc-400">Bağlı hesap yok</p>
          <button
            type="button"
            className="mt-3 inline-flex h-10 items-center rounded-xl border border-white/15 px-4 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
          >
            Ödeme yöntemi ekle
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08]">
        <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-4">
          <h2 className="font-display text-lg font-semibold text-white">Fatura / dönem özetleri</h2>
        </div>
        {invoices.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm text-zinc-500">
              {productCount === 0
                ? 'İlk satışlarınız oluşunca dönem özetleri burada listelenir.'
                : 'Henüz dönem özeti yok. Satışlar oluşunca burada listelenir.'}
            </p>
            <Link
              href="/partners/listings"
              className="mt-4 inline-flex text-sm font-medium text-teal-300 hover:text-teal-200"
            >
              Listelere git →
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.06]">
            {invoices.map((inv) => (
              <li
                key={inv.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-100">{inv.label}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(inv.date).toLocaleDateString('tr-TR')} · {inv.status}
                  </p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-white">{formatTry(inv.amount)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
