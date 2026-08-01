'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { BarChart3, DollarSign, ShoppingBag } from 'lucide-react';
import { getMyProducts, type DemoVendorProduct, VENDOR_EVENT } from '@/lib/demoVendor';
import { buildDemoSales, formatTry } from '@/lib/partnerPortal';

export default function PortalSalesContent() {
  const [products, setProducts] = useState<DemoVendorProduct[]>([]);

  useEffect(() => {
    const tick = () => setProducts(getMyProducts());
    tick();
    window.addEventListener(VENDOR_EVENT, tick);
    return () => window.removeEventListener(VENDOR_EVENT, tick);
  }, []);

  const sales = useMemo(() => buildDemoSales(products), [products]);
  const completed = sales.filter((s) => s.status === 'completed');
  const revenue = completed.reduce((a, s) => a + s.amount, 0);
  const refunded = sales.filter((s) => s.status === 'refunded').length;
  const avg = completed.length ? Math.round(revenue / completed.length) : 0;

  const byProduct = useMemo(() => {
    const map = new Map<string, { title: string; count: number; revenue: number }>();
    for (const s of completed) {
      const cur = map.get(s.productTitle) ?? { title: s.productTitle, count: 0, revenue: 0 };
      cur.count += 1;
      cur.revenue += s.amount;
      map.set(s.productTitle, cur);
    }
    return [...map.values()].sort((a, b) => b.revenue - a.revenue);
  }, [completed]);

  const maxRev = Math.max(...byProduct.map((p) => p.revenue), 1);

  if (products.filter((p) => p.status === 'approved').length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
        <BarChart3 className="mx-auto h-10 w-10 text-zinc-600" aria-hidden />
        <h2 className="mt-4 font-display text-xl font-semibold text-white">Henüz analitik yok</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
          Satış ve analitik, yayındaki listeniz olduğunda burada dolmaya başlar. Demo ortamında onaylı
          ürünler için örnek siparişler üretilir.
        </p>
        <Link
          href="/partners/self-submission"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
        >
          Ürün listele
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-zinc-500">
        Özet metrikler demo verisine dayanır. Canlı ödeme entegrasyonu sonrası gerçek siparişlerle
        güncellenir.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Toplam gelir', value: formatTry(revenue), icon: DollarSign },
          { label: 'Sipariş', value: String(completed.length), icon: ShoppingBag },
          { label: 'Ort. sipariş', value: formatTry(avg), icon: BarChart3 },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-500">{label}</p>
              <Icon className="h-4 w-4 text-zinc-600" aria-hidden />
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-white">Ürüne göre gelir</h2>
        <ul className="mt-5 space-y-4">
          {byProduct.map((p) => (
            <li key={p.title}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="truncate text-zinc-200">{p.title}</span>
                <span className="shrink-0 tabular-nums text-zinc-400">
                  {formatTry(p.revenue)} · {p.count} satış
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400"
                  style={{ width: `${Math.max(8, (p.revenue / maxRev) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-2xl border border-white/[0.08]">
        <div className="border-b border-white/[0.06] bg-white/[0.02] px-5 py-3">
          <h2 className="font-display text-lg font-semibold text-white">Sipariş geçmişi</h2>
          {refunded > 0 ? (
            <p className="mt-1 text-xs text-zinc-500">{refunded} iade kaydı</p>
          ) : null}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="border-b border-white/[0.06] text-[11px] uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Tarih</th>
                <th className="px-5 py-3 font-semibold">Ürün</th>
                <th className="px-5 py-3 font-semibold">Plan</th>
                <th className="px-5 py-3 font-semibold">Durum</th>
                <th className="px-5 py-3 text-right font-semibold">Tutar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {sales.map((s) => (
                <tr key={s.id} className="bg-white/[0.01]">
                  <td className="whitespace-nowrap px-5 py-3 text-zinc-500">
                    {new Date(s.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-5 py-3 text-zinc-200">{s.productTitle}</td>
                  <td className="px-5 py-3 text-zinc-400">{s.plan}</td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        s.status === 'completed'
                          ? 'text-emerald-400'
                          : s.status === 'refunded'
                            ? 'text-rose-400'
                            : 'text-amber-300'
                      }
                    >
                      {s.status === 'completed'
                        ? 'Tamamlandı'
                        : s.status === 'refunded'
                          ? 'İade'
                          : 'Beklemede'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums text-zinc-100">
                    {formatTry(s.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
