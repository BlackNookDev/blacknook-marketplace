'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { apiFetch } from '@/lib/apiUrl';
import AdminProductDetail, {
  type AdminProductRow,
} from '@/components/admin/AdminProductDetail';

export default function AdminDevelopersClient() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<AdminProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = session?.user?.role === 'admin';

  const load = useCallback(async () => {
    const res = await apiFetch('/api/products?scope=admin', { cache: 'no-store' });
    const data = await res.json().catch(() => ({}));
    setProducts(
      (Array.isArray(data.products) ? data.products : []).filter(
        (p: AdminProductRow) => !p.verified
      )
    );
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
          ürün formundan
        </Link>{' '}
        gönderir.
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
  );
}
