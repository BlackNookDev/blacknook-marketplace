export const PARTNER_PORTAL_NAV = [
  { href: '/partners/overview', label: 'Kontrol Paneli', requiresApproval: false },
  { href: '/partners/listings', label: 'Listeler', requiresApproval: true },
  { href: '/partners/sales', label: 'Satış ve Analitik', requiresApproval: true },
  { href: '/partners/billing', label: 'Faturalandırma', requiresApproval: true },
  { href: '/partners/support', label: 'Destek', requiresApproval: false },
] as const;

export function isPartnerPortalPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return PARTNER_PORTAL_NAV.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
}

export type PortalSaleRow = {
  id: string;
  productTitle: string;
  plan: string;
  amount: number;
  date: string;
  status: 'completed' | 'refunded' | 'pending';
};

/** Ürün listesine göre deterministik demo satış satırları */
export function buildDemoSales(
  products: { id: string; title: string; tiers: { name: string; price: number }[]; status: string }[]
): PortalSaleRow[] {
  const live = products.filter((p) => p.status === 'approved');
  if (live.length === 0) return [];

  const rows: PortalSaleRow[] = [];
  live.forEach((p, pi) => {
    const tier = p.tiers[0] ?? { name: 'Standart', price: 49 };
    const count = 2 + (pi % 3);
    for (let i = 0; i < count; i++) {
      const day = 3 + pi * 2 + i * 5;
      rows.push({
        id: `${p.id}_sale_${i}`,
        productTitle: p.title,
        plan: tier.name,
        amount: tier.price,
        date: new Date(Date.now() - day * 86400000).toISOString(),
        status: i === count - 1 && pi === 0 ? 'pending' : 'completed',
      });
    }
  });
  return rows.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function formatTry(amount: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
