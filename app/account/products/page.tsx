'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

type CartItem = {
  id: number;
  productName: string;
  productSlug: string;
  quantity: number;
};

export default function AccountProductsPage() {
  const { status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated') {
      setItems([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/cart', { cache: 'no-store' });
        if (!res.ok) throw new Error('cart');
        const data = await res.json();
        if (!cancelled) setItems(Array.isArray(data.items) ? data.items : []);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ürünler
        </h1>
      </div>

      <div className="mt-10">
        {loading ? (
          <p className="text-center text-sm text-zinc-500">Yükleniyor…</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
            <p className="text-sm font-medium text-zinc-200 sm:text-base">Şu an ekli ürün yok</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Ekosistemden bir ürün seçerek başlayabilirsiniz.{' '}
              <Link
                href="/services"
                className="font-medium text-sky-400 transition-colors hover:text-sky-300"
              >
                Şimdi keşfet
              </Link>
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-white/[0.02]">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <Link
                    href={`/service/${item.productSlug}`}
                    className="text-sm font-medium text-zinc-100 hover:text-white"
                  >
                    {item.productName}
                  </Link>
                  <p className="mt-0.5 text-xs text-zinc-500">Adet: {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
