/** Demo vendor / başvuru state — localStorage, DB yok */

import { getDemoUser } from '@/lib/demoAuth';

export const VENDOR_EVENT = 'bn-vendor-change';

export type DemoRole = 'user' | 'pending' | 'vendor' | 'admin';

export type DevApplicationStatus = 'pending' | 'approved' | 'rejected';

export type DevApplication = {
  id: string;
  name: string;
  email: string;
  github: string;
  linkedin: string;
  bio: string;
  productFocus: string;
  portfolioUrl: string;
  status: DevApplicationStatus;
  submittedAt: string;
  rejectReason?: string;
};

export type DemoProductTier = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  features: string[];
};

export type DemoProductStatus = 'pending' | 'approved' | 'rejected';

export type DemoVendorProduct = {
  id: string;
  vendorEmail: string;
  vendorName: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  features: string[];
  tiers: DemoProductTier[];
  status: DemoProductStatus;
  createdAt: string;
  rejectReason?: string;
};

const ROLE_KEY = 'bn_demo_role';
const APPS_KEY = 'bn_demo_dev_applications';
const PRODUCTS_KEY = 'bn_demo_vendor_products';

function emit() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(VENDOR_EVENT));
  }
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
  emit();
}

export function getDemoRole(): DemoRole {
  if (typeof window === 'undefined') return 'user';
  const raw = window.localStorage.getItem(ROLE_KEY);
  if (raw === 'pending' || raw === 'vendor' || raw === 'admin') return raw;
  return 'user';
}

export function setDemoRole(role: DemoRole) {
  window.localStorage.setItem(ROLE_KEY, role);
  emit();
}

export function clearDemoVendorState() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(ROLE_KEY);
  // Başvuru / ürünleri koruyoruz ki admin demosu boşalmasın; kullanıcıya özel filtre email ile
  emit();
}

export function getApplications(): DevApplication[] {
  return readJson<DevApplication[]>(APPS_KEY, []);
}

export function getMyApplication(): DevApplication | null {
  const user = getDemoUser();
  if (!user) return null;
  const apps = getApplications();
  return apps.find((a) => a.email === user.email) ?? null;
}

export function submitApplication(input: {
  name: string;
  github: string;
  linkedin: string;
  bio: string;
  productFocus: string;
  portfolioUrl: string;
}): DevApplication | null {
  const user = getDemoUser();
  if (!user) return null;

  const apps = getApplications().filter((a) => a.email !== user.email);
  const app: DevApplication = {
    id: `app_${Date.now()}`,
    name: input.name.trim() || user.name,
    email: user.email,
    github: input.github.trim(),
    linkedin: input.linkedin.trim(),
    bio: input.bio.trim(),
    productFocus: input.productFocus.trim(),
    portfolioUrl: input.portfolioUrl.trim(),
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
  apps.unshift(app);
  writeJson(APPS_KEY, apps);
  setDemoRole('pending');
  return app;
}

export function approveApplication(id: string) {
  const apps = getApplications().map((a) =>
    a.id === id ? { ...a, status: 'approved' as const, rejectReason: undefined } : a
  );
  writeJson(APPS_KEY, apps);
  const approved = apps.find((a) => a.id === id);
  if (!approved) return;

  const map = readJson<Record<string, DemoRole>>('bn_demo_role_by_email', {});
  map[approved.email] = 'vendor';
  writeJson('bn_demo_role_by_email', map);

  const user = getDemoUser();
  if (user && approved.email === user.email && getDemoRole() !== 'admin') {
    setDemoRole('vendor');
  }
}

export function rejectApplication(id: string, reason = 'Başvuru kriterleri karşılanmadı.') {
  const apps = getApplications().map((a) =>
    a.id === id ? { ...a, status: 'rejected' as const, rejectReason: reason } : a
  );
  writeJson(APPS_KEY, apps);
  const user = getDemoUser();
  const rejected = apps.find((a) => a.id === id);
  if (user && rejected && rejected.email === user.email) {
    setDemoRole('user');
  }
}

/** Girişte email’e özel rol haritasını uygula */
export function syncRoleFromEmail() {
  const user = getDemoUser();
  if (!user) return;
  const map = readJson<Record<string, DemoRole>>('bn_demo_role_by_email', {});
  const mapped = map[user.email];
  if (mapped === 'vendor' || mapped === 'admin') {
    setDemoRole(mapped);
    return;
  }
  const app = getMyApplication();
  if (app?.status === 'approved') setDemoRole('vendor');
  else if (app?.status === 'pending') setDemoRole('pending');
  else if (app?.status === 'rejected' && getDemoRole() === 'pending') setDemoRole('user');
}

export function getProducts(): DemoVendorProduct[] {
  return readJson<DemoVendorProduct[]>(PRODUCTS_KEY, []);
}

export function getMyProducts(): DemoVendorProduct[] {
  const user = getDemoUser();
  if (!user) return [];
  return getProducts().filter((p) => p.vendorEmail === user.email);
}

export function addProduct(input: Omit<DemoVendorProduct, 'id' | 'vendorEmail' | 'vendorName' | 'status' | 'createdAt'>): DemoVendorProduct | null {
  const user = getDemoUser();
  if (!user) return null;
  const product: DemoVendorProduct = {
    ...input,
    id: `prod_${Date.now()}`,
    vendorEmail: user.email,
    vendorName: user.name,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  const list = getProducts();
  list.unshift(product);
  writeJson(PRODUCTS_KEY, list);
  return product;
}

export function setProductStatus(id: string, status: DemoProductStatus, rejectReason?: string) {
  const list = getProducts().map((p) =>
    p.id === id
      ? { ...p, status, rejectReason: status === 'rejected' ? rejectReason : undefined }
      : p
  );
  writeJson(PRODUCTS_KEY, list);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

export function seedDemoAdminData() {
  if (typeof window === 'undefined') return;
  if (window.localStorage.getItem('bn_demo_seeded') === '1') return;

  const sampleApps: DevApplication[] = [
    {
      id: 'app_sample_1',
      name: 'Ayşe Kaya',
      email: 'ayse.demo@blacknook.com',
      github: 'https://github.com/ayse',
      linkedin: 'https://linkedin.com/in/ayse',
      bio: 'Full-stack geliştirici, SaaS ve otomasyon.',
      productFocus: 'Geliştirici araçları',
      portfolioUrl: 'https://ayse.dev',
      status: 'pending',
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  const sampleProducts: DemoVendorProduct[] = [
    {
      id: 'prod_sample_1',
      vendorEmail: 'mert.demo@blacknook.com',
      vendorName: 'Mert Yılmaz',
      title: 'FlowKit Automations',
      slug: 'flowkit-automations',
      category: 'Otomasyon',
      shortDescription: 'n8n tabanlı hazır iş akışı paketleri.',
      longDescription: 'Satış, destek ve içerik ekipleri için hazır otomasyon şablonları.',
      features: ['20+ hazır workflow', 'Webhook entegrasyonu', 'Dokümantasyon'],
      tiers: [
        {
          id: 't1',
          name: 'Starter',
          price: 0,
          originalPrice: 49,
          features: ['5 workflow', 'Topluluk desteği'],
        },
        {
          id: 't2',
          name: 'Pro',
          price: 79,
          originalPrice: 199,
          features: ['Tüm workflow’lar', 'Öncelikli destek', 'Güncellemeler'],
        },
      ],
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  if (getApplications().length === 0) writeJson(APPS_KEY, sampleApps);
  if (getProducts().length === 0) writeJson(PRODUCTS_KEY, sampleProducts);
  window.localStorage.setItem('bn_demo_seeded', '1');
}

export const PRODUCT_CATEGORIES = [
  'Geliştirici araçları',
  'Backend & Auth',
  'CMS',
  'Otomasyon',
  'AI',
  'Analitik',
  'E-ticaret',
  'Diğer',
] as const;

export function statusLabel(status: string): string {
  switch (status) {
    case 'pending':
      return 'İncelemede';
    case 'approved':
      return 'Onaylandı';
    case 'rejected':
      return 'Reddedildi';
    default:
      return status;
  }
}
