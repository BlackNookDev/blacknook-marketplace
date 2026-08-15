'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/demo/StatusBadge';
import { apiFetch } from '@/lib/apiUrl';

type MineProduct = {
  title: string;
  slug: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'unpublished';
  rejectReason?: string;
  createdAt: string;
};

export default function StatusView() {
  const [products, setProducts] = useState<MineProduct[] | null>(null);

  useEffect(() => {
    void apiFetch('/api/products?mine=1', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => setProducts(Array.isArray(data.products) ? data.products : []))
      .catch(() => setProducts([]));
  }, []);

  if (products === null) {
    return <p className="text-sm text-zinc-500">Yükleniyor…</p>;
  }

  const latest = products[0];
  if (!latest) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-sm text-zinc-400">Henüz bir ürün başvurunuz yok.</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link
            href="/partners/self-submission"
            className="text-sm font-medium text-sky-400 hover:text-sky-300"
          >
            Ürününü listele →
          </Link>
          <Link href="/sell" className="text-sm font-medium text-sky-400 hover:text-sky-300">
            Partner programı →
          </Link>
        </div>
      </div>
    );
  }

  if (latest.status === 'approved') {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status="approved" />
          <p className="text-sm font-medium text-emerald-200">{latest.title} yayında.</p>
        </div>
        <p className="mt-3 text-sm text-zinc-500">
          Ürününüz pazaryerinde açık kaynak listesinin önünde sergileniyor.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/service/${latest.slug}`}
            className="inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90"
          >
            Vitrinde gör
          </Link>
          <Link
            href="/partners/self-submission"
            className="inline-flex rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-zinc-100 hover:bg-white/[0.04]"
          >
            Yeni ürün
          </Link>
        </div>
      </div>
    );
  }

  if (latest.status === 'unpublished') {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6">
        <StatusBadge status="unpublished" />
        <p className="mt-3 text-sm text-zinc-300">
          {latest.rejectReason || `${latest.title} katalogdan alındı.`}
        </p>
        <Link
          href="/partners/listings"
          className="mt-5 inline-flex text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          Listelere git →
        </Link>
      </div>
    );
  }

  if (latest.status === 'rejected') {
    return (
      <div className="rounded-2xl border border-rose-400/20 bg-rose-500/[0.06] p-6">
        <StatusBadge status="rejected" />
        <p className="mt-3 text-sm text-zinc-300">{latest.rejectReason}</p>
        <Link
          href="/partners/self-submission"
          className="mt-5 inline-flex text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          Ürünü güncelleyip yeniden gönder →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-400/20 bg-amber-500/[0.06] p-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status="pending" />
        <p className="text-sm font-medium text-amber-200">{latest.title} inceleniyor</p>
      </div>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Kategori</dt>
          <dd className="text-zinc-200">{latest.category}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Gönderildi</dt>
          <dd className="text-zinc-200">
            {latest.createdAt ? new Date(latest.createdAt).toLocaleString('tr-TR') : '—'}
          </dd>
        </div>
      </dl>
      <p className="mt-6 text-xs text-zinc-600">
        Admin onayından sonra katalogda önde yayınlanır.{' '}
        <Link href="/partners/listings" className="text-sky-400 hover:text-sky-300">
          Listeler
        </Link>
      </p>
    </div>
  );
}
