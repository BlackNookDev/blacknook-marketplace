import { isCoderFeatureEnabled } from '@/lib/coderFeature';

const PARTNER_PORTAL_NAV_ALL = [
  { href: '/partners/overview', label: 'Kontrol Paneli', requiresApproval: false },
  { href: '/partners/listings', label: 'Listeler', requiresApproval: false },
  { href: '/partners/studio', label: 'Kendi uygulamanı yap', requiresApproval: false },
  { href: '/partners/sales', label: 'Satış ve Analitik', requiresApproval: true },
  { href: '/partners/billing', label: 'Faturalandırma', requiresApproval: true },
  { href: '/partners/support', label: 'Destek', requiresApproval: false },
] as const;

/** Menüde görünen portal sekmeleri (Coder kapalıysa stüdyo yok) */
export const PARTNER_PORTAL_NAV = PARTNER_PORTAL_NAV_ALL.filter(
  (item) => item.href !== '/partners/studio' || isCoderFeatureEnabled()
);

export function isPartnerPortalPath(pathname: string | null): boolean {
  if (!pathname) return false;
  // Kapalı stüdyo URL’si de portal chrome’unda kalsın (yönlendirme sırasında)
  return PARTNER_PORTAL_NAV_ALL.some(
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
