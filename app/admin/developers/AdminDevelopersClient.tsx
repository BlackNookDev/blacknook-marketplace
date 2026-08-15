'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import StatusBadge from '@/components/demo/StatusBadge';
import { apiFetch } from '@/lib/apiUrl';

type AdminProduct = {
  id: number;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  vendorName: string;
  vendorEmail?: string;
  createdAt?: string;
  tiers: { id: number | string; name: string; price: number }[];
};

export default function AdminDevelopersClient() {
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
    return (
      <p className="text-sm text-zinc-500">
        Henüz ürün başvurusu yok. Partnerler{' '}
        <Link href="/partners/self-submission" className="text-sky-400 hover:text-sky-300">
          /partners/self-submission
        </Link>{' '}
        üzerinden gönderir.
      </p>
    );
  }

  const pendingFirst = [...products].sort((a, b) => {
    if (a.status === b.status) return 0;
    if (a.status === 'pending') return -1;
    if (b.status === 'pending') return 1;
    return 0;
  });

  return (
    <ul className="space-y-4">
      {pendingFirst.map((p) => (
        <li key={p.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-zinc-100">{p.title}</p>
              <p className="mt-1 text-sm text-zinc-500">
                {p.vendorName}
                {p.vendorEmail ? ` · ${p.vendorEmail}` : ''}
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                {p.category}
                {p.shortDescription ? ` · ${p.shortDescription}` : ''}
              </p>
              {p.status === 'rejected' && p.rejectReason ? (
                <p className="mt-2 text-xs text-rose-300">{p.rejectReason}</p>
              ) : null}
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
                Onayla / yayınla
              </button>
              <button
                type="button"
                onClick={() => void setStatus(p.id, 'rejected')}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
              >
                Reddet
              </button>
            </div>
          ) : p.status === 'approved' ? (
            <Link
              href={`/service/${p.slug}`}
              className="mt-4 inline-flex text-sm font-medium text-sky-400 hover:text-sky-300"
            >
              Vitrinde gör
            </Link>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
