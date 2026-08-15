'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import StatusBadge from '@/components/demo/StatusBadge';
import { apiFetch } from '@/lib/apiUrl';

type AdminProduct = {
  id: number;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  coverImage?: string;
  iconImage?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  vendorName: string;
  tiers: { id: number | string; name: string; price: number }[];
};

export default function AdminProductsClient() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = session?.user?.role === 'admin';

  const load = useCallback(async () => {
    const res = await apiFetch('/api/products?scope=admin', { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    setProducts(Array.isArray(data.products) ? data.products : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    void load();
  }, [isAdmin, load]);

  const setStatus = async (id: number, status: 'approved' | 'rejected') => {
    await apiFetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        rejectReason: status === 'rejected' ? 'Eksik bilgi veya politika uyumsuzluğu.' : undefined,
      }),
    });
    void load();
  };

  if (!isAdmin) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-sm text-zinc-400">
          Bu sayfa yalnızca admin hesabı ile açılır. Mevcut rol:{' '}
          <span className="text-zinc-200">{session?.user?.role || 'user'}</span>
        </p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Yükleniyor…</p>;
  }

  if (products.length === 0) {
    return <p className="text-sm text-zinc-500">Moderasyon bekleyen ürün yok.</p>;
  }

  return (
    <ul className="space-y-4">
      {products.map((p) => (
        <li key={p.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 gap-3">
              {p.iconImage || p.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.iconImage || p.coverImage}
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover"
                />
              ) : null}
              <div>
                <p className="font-medium text-zinc-100">{p.title}</p>
                <p className="text-sm text-zinc-500">
                  {p.vendorName} · {p.category}
                </p>
                <p className="mt-2 text-sm text-zinc-400">{p.shortDescription}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {p.tiers.map((t) => (
                    <li
                      key={String(t.id)}
                      className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-zinc-400"
                    >
                      {t.name}: ${t.price}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <StatusBadge status={p.status} />
          </div>
          {p.status === 'pending' ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void setStatus(p.id, 'approved')}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Yayınla
              </button>
              <button
                type="button"
                onClick={() => void setStatus(p.id, 'rejected')}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/[0.04]"
              >
                Reddet
              </button>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
