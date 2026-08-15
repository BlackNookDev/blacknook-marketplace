'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiFetch } from '@/lib/apiUrl';
import AdminProductDetail, {
  type AdminProductRow,
} from '@/components/admin/AdminProductDetail';

const FILTERS = [
  { id: 'all', label: 'Tümü' },
  { id: 'approved', label: 'Yayında' },
  { id: 'pending', label: 'Bekleyen' },
  { id: 'unpublished', label: 'Yayından alındı' },
  { id: 'rejected', label: 'Reddedildi' },
] as const;

export default function AdminProductsClient() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('approved');
  const [query, setQuery] = useState('');
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

  const setStatus = async (
    id: number,
    status: 'approved' | 'rejected' | 'unpublished',
    rejectReason?: string
  ) => {
    await apiFetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectReason }),
    });
    void load();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => (filter === 'all' ? true : p.status === filter))
      .filter((p) => {
        if (!q) return true;
        return (
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (a.status === b.status) return a.title.localeCompare(b.title, 'tr');
        if (a.status === 'pending') return -1;
        if (b.status === 'pending') return 1;
        return 0;
      });
  }, [products, filter, query]);

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

  const counts = {
    all: products.length,
    approved: products.filter((p) => p.status === 'approved').length,
    pending: products.filter((p) => p.status === 'pending').length,
    unpublished: products.filter((p) => p.status === 'unpublished').length,
    rejected: products.filter((p) => p.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ürün, sağlayıcı veya kategori ara…"
        className="h-11 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30"
      />
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
            {f.label} ({counts[f.id]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-zinc-500">Bu filtrede ürün yok.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((p) => (
            <AdminProductDetail
              key={p.id}
              product={p}
              defaultOpen={p.status === 'pending'}
              onApprove={(id) => void setStatus(id, 'approved')}
              onReject={(id, reason) => void setStatus(id, 'rejected', reason)}
              onUnpublish={(id, reason) => void setStatus(id, 'unpublished', reason)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
