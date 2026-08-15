import pool from '@/lib/db';
import { SERVICES, type ServiceCatalogEntry } from '../../lib/data';
import type { ListingDraft } from '@/lib/listingDraft';

export type ProductStatus = 'pending' | 'approved' | 'rejected';

export type MarketplaceTier = {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  features: string[];
};

export type MarketplaceProduct = {
  id: number;
  vendorId: number;
  vendorName: string;
  vendorEmail: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  coverImage: string;
  iconImage: string;
  gallery: string[];
  brandColor: string;
  features: string[];
  listing: Partial<ListingDraft> | null;
  tiers: MarketplaceTier[];
  status: ProductStatus;
  rejectReason: string;
  createdAt: string;
};

const BROWSE_CATEGORY_MAP: Record<string, string> = {
  'Proje yönetimi': 'Planlama & Randevu',
  'Geliştirici araçları': 'Geliştirme Araçları',
  'Backend & Auth': 'Backend & BaaS',
  CMS: 'Yayın & CMS',
  Otomasyon: 'Otomasyon & İş Akışı',
  AI: 'Yapay Zeka',
  Analitik: 'Analitik & Ürün',
  'E-ticaret': 'E-posta & Pazarlama',
  Pazarlama: 'E-posta & Pazarlama',
  'Müşteri desteği': 'İletişim & Destek',
  Diğer: 'Geliştirme Araçları',
};

export function mapListingCategory(category: string) {
  return BROWSE_CATEGORY_MAP[category] || category;
}

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64) || 'urun';
}

function parseGallery(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((x): x is string => typeof x === 'string' && x.length > 0);
  }
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((x): x is string => typeof x === 'string' && x.length > 0)
        : [];
    } catch {
      return [];
    }
  }
  return [];
}

function parseFeatures(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((x): x is string => typeof x === 'string' && x.trim().length > 0);
  }
  return [];
}

export function rowToProduct(row: any, tiers: MarketplaceTier[] = []): MarketplaceProduct {
  const listing =
    row.listing_data && typeof row.listing_data === 'object' ? (row.listing_data as Partial<ListingDraft>) : null;
  return {
    id: Number(row.id),
    vendorId: Number(row.vendor_id),
    vendorName: row.vendor_name || row.name || 'Partner',
    vendorEmail: row.vendor_email || row.email || '',
    slug: row.slug,
    title: row.title,
    category: row.category,
    shortDescription: row.short_description || listing?.tagline || '',
    longDescription: row.long_description || listing?.usp || '',
    coverImage: row.cover_image || listing?.heroImageData || '',
    iconImage: row.icon_image || listing?.companyIconData || '',
    gallery: parseGallery(row.gallery_images).length
      ? parseGallery(row.gallery_images)
      : (listing?.screenshotData || []).filter(Boolean),
    brandColor: row.brand_color || '#6366F1',
    features: parseFeatures(row.features_list),
    listing,
    tiers,
    status: row.status,
    rejectReason: row.reject_reason || '',
    createdAt: row.created_at,
  };
}

export function productToCatalog(product: MarketplaceProduct): ServiceCatalogEntry {
  const listing = product.listing;
  const useCases = (listing?.tldr || []).filter(Boolean);
  return {
    slug: product.slug,
    name: product.title,
    description: product.shortDescription,
    icon: product.iconImage || product.coverImage || 'marketplace',
    category: mapListingCategory(product.category),
    features: product.features,
    about: product.longDescription || product.shortDescription,
    useCases: useCases.length ? useCases : product.features.slice(0, 3),
    brandColor: product.brandColor,
    coverImage: product.coverImage || undefined,
    iconImage: product.iconImage || undefined,
    source: 'marketplace',
  };
}

const PRODUCT_SELECT = `
  SELECT p.*, u.name AS vendor_name, u.email AS vendor_email
  FROM products p
  JOIN users u ON u.id = p.vendor_id
`;

export async function uniqueProductSlug(base: string) {
  let n = 0;
  while (n < 50) {
    const candidate = n === 0 ? base : `${base}-${n + 1}`;
    if (SERVICES.some((s) => s.slug === candidate)) {
      n += 1;
      continue;
    }
    const [rows]: any = await pool.query('SELECT id FROM products WHERE slug = ?', [candidate]);
    if (!rows[0]) return candidate;
    n += 1;
  }
  return `${base}-${Date.now()}`;
}

export async function loadTiers(productId: number): Promise<MarketplaceTier[]> {
  const [rows]: any = await pool.query(
    'SELECT id, tier_name, price, original_price, features FROM product_tiers WHERE product_id = ? ORDER BY id ASC',
    [productId]
  );
  return (rows || []).map((row: any) => ({
    id: Number(row.id),
    name: row.tier_name,
    price: Number(row.price) || 0,
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    features: parseFeatures(row.features),
  }));
}

export async function getApprovedMarketplaceProducts(): Promise<MarketplaceProduct[]> {
  const [rows]: any = await pool.query(
    `${PRODUCT_SELECT} WHERE p.status = 'approved' ORDER BY p.created_at DESC`
  );
  const products = await Promise.all(
    (rows || []).map(async (row: any) => rowToProduct(row, await loadTiers(Number(row.id))))
  );
  return products;
}

export async function getApprovedCatalogEntries(): Promise<ServiceCatalogEntry[]> {
  const products = await getApprovedMarketplaceProducts();
  return products.map(productToCatalog);
}

export async function getMarketplaceBySlug(
  slug: string,
  opts?: { includeUnlisted?: boolean }
): Promise<MarketplaceProduct | null> {
  const [rows]: any = await pool.query(`${PRODUCT_SELECT} WHERE p.slug = ? LIMIT 1`, [slug]);
  const row = rows?.[0];
  if (!row) return null;
  if (!opts?.includeUnlisted && row.status !== 'approved') return null;
  return rowToProduct(row, await loadTiers(Number(row.id)));
}

export async function getProductsForVendor(vendorId: number): Promise<MarketplaceProduct[]> {
  const [rows]: any = await pool.query(
    `${PRODUCT_SELECT} WHERE p.vendor_id = ? ORDER BY p.created_at DESC`,
    [vendorId]
  );
  return Promise.all(
    (rows || []).map(async (row: any) => rowToProduct(row, await loadTiers(Number(row.id))))
  );
}

export async function getAllMarketplaceProducts(): Promise<MarketplaceProduct[]> {
  const [rows]: any = await pool.query(`${PRODUCT_SELECT} ORDER BY p.created_at DESC`);
  return Promise.all(
    (rows || []).map(async (row: any) => rowToProduct(row, await loadTiers(Number(row.id))))
  );
}

export function serializeProduct(product: MarketplaceProduct) {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    name: product.title,
    category: product.category,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    coverImage: product.coverImage,
    iconImage: product.iconImage,
    gallery: product.gallery,
    brandColor: product.brandColor,
    features: product.features,
    listing: product.listing,
    tiers: product.tiers,
    status: product.status,
    rejectReason: product.rejectReason,
    vendorName: product.vendorName,
    vendorEmail: product.vendorEmail,
    createdAt: product.createdAt,
    catalog: productToCatalog(product),
  };
}
