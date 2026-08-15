'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/apiUrl';

export type MineProduct = {
  id: number;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  createdAt: string;
  vendorName?: string;
  vendorEmail?: string;
  tiers: { id: number | string; name?: string; price?: number }[];
};

export function useMineProducts() {
  const [products, setProducts] = useState<MineProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void apiFetch('/api/products?mine=1', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data.products) ? data.products : []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading };
}
