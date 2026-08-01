'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/demo/StatusBadge';
import { getMyProducts, type DemoVendorProduct, VENDOR_EVENT } from '@/lib/demoVendor';

export default function VendorProductsList() {
  const [products, setProducts] = useState<DemoVendorProduct[]>([]);

  useEffect(() => {
    const tick = () => setProducts(getMyProducts());
    tick();
    window.addEventListener(VENDOR_EVENT, tick);
    return () => window.removeEventListener(VENDOR_EVENT, tick);
  }, []);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.08] px-6 py-14 text-center">
        <p className="text-sm text-zinc-500">Henüz ürün eklemediniz.</p>
        <Link
          href="/partners/self-submission"
          className="mt-4 inline-flex text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          İlk ürünü oluştur →
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] overflow-hidden">
      {products.map((p) => (
        <li key={p.id} className="bg-white/[0.02] px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-zinc-100">{p.title}</p>
              <p className="mt-1 text-sm text-zinc-500">{p.shortDescription}</p>
              <p className="mt-2 text-xs text-zinc-600">
                /{p.slug} · {p.category} · {p.tiers.map((t) => t.name).join(', ')}
              </p>
              {p.status === 'rejected' && p.rejectReason ? (
                <p className="mt-2 text-xs text-rose-300">{p.rejectReason}</p>
              ) : null}
            </div>
            <StatusBadge status={p.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}
