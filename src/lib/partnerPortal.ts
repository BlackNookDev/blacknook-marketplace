export const PARTNER_PORTAL_NAV = [
  { href: '/partners/overview', label: 'Kontrol Paneli', requiresApproval: false },
  { href: '/partners/listings', label: 'Listeler', requiresApproval: false },
  { href: '/partners/studio', label: 'Kendi uygulamanı yap', requiresApproval: false },
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

/** Satış satırları — canlı sipariş entegrasyonu gelene kadar boş */
export function buildDemoSales(
  _products: { id: string | number; title: string; status: string }[]
): PortalSaleRow[] {
  return [];
}

export function formatTry(amount: number) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
