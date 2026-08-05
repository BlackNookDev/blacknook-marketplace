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

/** Fiyat planı — gerçek deal verisi gelene kadar boş */
export function getServicePricingPlan(_slug: string): ServicePricingPlan {
  return { tiers: [], features: [] };
}
