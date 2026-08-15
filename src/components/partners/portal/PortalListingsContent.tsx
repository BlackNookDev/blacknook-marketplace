'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import StatusBadge from '@/components/demo/StatusBadge';
import { apiFetch } from '@/lib/apiUrl';

type PortalProduct = {
  id: number;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  status: 'pending' | 'approved' | 'rejected' | 'unpublished';
  rejectReason?: string;
  tiers: { id: number | string }[];
};

const FILTERS = [
  { id: 'all', label: 'Tümü' },
  { id: 'approved', label: 'Yayında' },
  { id: 'pending', label: 'İncelemede' },
  { id: 'unpublished', label: 'Yayından alındı' },
  { id: 'rejected', label: 'Reddedildi' },
] as const;

export default function PortalListingsContent() {
  const [products, setProducts] = useState<PortalProduct[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');

  useEffect(() => {
    let cancelled = false;
    void apiFetch('/api/products?mine=1', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data.products) ? data.products : []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (filter !== 'all' && p.status !== filter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [products, query, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          Pazaryerindeki ürün listelerinizi yönetin. Yeni gönderimler inceleme kuyruğuna düşer.
        </p>
        <Link
          href="/partners/self-submission"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-black hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" aria-hidden />
          Yeni liste
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Liste ara</span>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün adı, slug veya kategori…"
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/25"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={
                filter === f.id
                  ? 'rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black'
                  : 'rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white'
              }
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-white">Henüz listeniz yok</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
            İlk ürününüzü oluşturduğunuzda burada durum, planlar ve inceleme notları görünür.
          </p>
          <Link
            href="/partners/self-submission"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
          >
            Satmaya başlayın
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <p className="rounded-2xl border border-white/[0.08] px-6 py-10 text-center text-sm text-zinc-500">
          Filtreyle eşleşen liste yok.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
          <div className="hidden grid-cols-[1fr_8rem_7rem_6rem] gap-3 border-b border-white/[0.06] bg-white/[0.02] px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 sm:grid">
            <span>Ürün</span>
            <span>Kategori</span>
            <span>Planlar</span>
            <span className="text-right">Durum</span>
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {filtered.map((p) => (
              <li
                key={p.id}
                className="grid gap-3 bg-white/[0.02] px-5 py-4 sm:grid-cols-[1fr_8rem_7rem_6rem] sm:items-center"
              >
                <div className="min-w-0">
                  <p className="font-medium text-zinc-100">{p.title}</p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {p.status === 'approved' ? (
                      <Link href={`/service/${p.slug}`} className="hover:text-zinc-300">
                        /service/{p.slug}
                      </Link>
                    ) : (
                      `/${p.slug}`
                    )}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500 sm:hidden">
                    {p.shortDescription}
                  </p>
                  {p.status === 'rejected' && p.rejectReason ? (
                    <p className="mt-2 text-xs text-rose-300">{p.rejectReason}</p>
                  ) : null}
                  {p.status === 'unpublished' && p.rejectReason ? (
                    <p className="mt-2 text-xs text-zinc-400">{p.rejectReason}</p>
                  ) : null}
                </div>
                <p className="text-sm text-zinc-400">{p.category}</p>
                <p className="text-sm text-zinc-400">{p.tiers.length} plan</p>
                <div className="sm:justify-self-end">
                  <StatusBadge status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
