import { getServiceDealMeta } from './data';

export type PricingCell = string | boolean;

export type PricingFeatureRow = {
  label: string;
  values: PricingCell[];
};

export type PricingTier = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  recommended?: boolean;
};

export type ServicePricingPlan = {
  tiers: PricingTier[];
  features: PricingFeatureRow[];
};

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  return hash;
}

/** AppSumo tarzı 4 lisans aşaması — slug’a göre deterministik */
export function getServicePricingPlan(slug: string): ServicePricingPlan {
  const deal = getServiceDealMeta(slug, 0);
  const h = hashSlug(slug);

  const multipliers = [1, 1.55, 2.35, 3.4];
  const originalMultipliers = [6.6, 8.2, 10.5, 13.2];

  const tiers: PricingTier[] = multipliers.map((m, i) => ({
    id: `tier-${i + 1}`,
    name: `Lisans Aşaması ${i + 1}`,
    price: Math.round(deal.price * m),
    originalPrice: Math.round(deal.price * originalMultipliers[i]),
    recommended: i === 3,
  }));

  const teamMembers = [0, 2, 20, 'Sınırsız'] as PricingCell[];
  const teams = [1, 1, 1, 'Sınırsız'] as PricingCell[];
  const credits = [
    2000 + (h % 5) * 500,
    5000 + (h % 4) * 1000,
    12000 + (h % 6) * 1500,
    25000 + (h % 5) * 2500,
  ].map((n) => n.toLocaleString('tr-TR')) as PricingCell[];
  const aiCredits = [
    100 + (h % 3) * 50,
    250 + (h % 4) * 50,
    600 + (h % 5) * 100,
    1500 + (h % 4) * 250,
  ].map((n) => n.toLocaleString('tr-TR')) as PricingCell[];
  const flows = [5 + (h % 4), 15 + (h % 6), 40 + (h % 10), 100 + (h % 20)].map(String) as PricingCell[];
  const connections = [10, 25, 75, 'Sınırsız'] as PricingCell[];
  const tables = [3, 10, 30, 100].map(String) as PricingCell[];

  const features: PricingFeatureRow[] = [
    { label: 'Ekip üyeleri', values: teamMembers },
    { label: 'Ekipler', values: teams },
    { label: 'Aylık kredi', values: credits },
    { label: 'Başlangıç AI kredisi', values: aiCredits },
    { label: 'Aktif akışlar', values: flows },
    { label: 'Bağlantılar', values: connections },
    { label: 'Tablolar', values: tables },
    { label: 'Sınırsız tarayıcı bloğu kullanımı', values: [true, true, true, true] },
    { label: 'Mac & PC masaüstü uygulaması', values: [true, true, true, true] },
    { label: 'MCP erişimi', values: [false, false, false, true] },
    { label: 'BYOK (kendi anahtarını getir)', values: [false, false, false, false] },
  ];

  return { tiers, features };
}
