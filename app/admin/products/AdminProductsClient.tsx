'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '@/components/demo/StatusBadge';
import { getDemoUser } from '@/lib/demoAuth';
import {
  getDemoRole,
  getProducts,
  seedDemoAdminData,
  setDemoRole,
  setProductStatus,
  type DemoVendorProduct,
  VENDOR_EVENT,
} from '@/lib/demoVendor';

export default function AdminProductsClient() {
  const [products, setProducts] = useState<DemoVendorProduct[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState('user');

  useEffect(() => {
    seedDemoAdminData();
    const tick = () => {
      setProducts(getProducts());
      const r = getDemoRole();
      setRole(r);
      setIsAdmin(r === 'admin');
    };
    tick();
    window.addEventListener(VENDOR_EVENT, tick);
    return () => window.removeEventListener(VENDOR_EVENT, tick);
  }, []);

  const enableAdmin = () => {
    setDemoRole('admin');
    const user = getDemoUser();
    if (user) {
      try {
        const map = JSON.parse(
          window.localStorage.getItem('bn_demo_role_by_email') || '{}'
        ) as Record<string, string>;
        map[user.email] = 'admin';
        window.localStorage.setItem('bn_demo_role_by_email', JSON.stringify(map));
      } catch {
        /* ignore */
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-sm text-zinc-400">
          Admin görünümü için demo yetkisi gerekir. Mevcut rol:{' '}
          <span className="text-zinc-200">{role}</span>
        </p>
        <button
          type="button"
          onClick={enableAdmin}
          className="mt-4 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90"
        >
          Demo: Admin olarak devam et
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-sm text-zinc-500">Moderasyon bekleyen ürün yok.</p>;
  }

  return (
    <ul className="space-y-4">
      {products.map((p) => (
        <li
          key={p.id}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-zinc-100">{p.title}</p>
              <p className="text-sm text-zinc-500">
                {p.vendorName} · {p.category}
              </p>
              <p className="mt-2 text-sm text-zinc-400">{p.shortDescription}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {p.tiers.map((t) => (
                  <li
                    key={t.id}
                    className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-zinc-400"
                  >
                    {t.name}: ${t.price}
                  </li>
                ))}
              </ul>
            </div>
            <StatusBadge status={p.status} />
          </div>
          {p.status === 'pending' ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setProductStatus(p.id, 'approved')}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Yayınla
              </button>
              <button
                type="button"
                onClick={() =>
                  setProductStatus(p.id, 'rejected', 'Eksik bilgi veya politika uyumsuzluğu.')
                }
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
