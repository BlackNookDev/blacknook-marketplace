import { SERVICES, type ServiceCatalogEntry } from './data';

export type NavMenuId = 'saas' | 'micro-saas' | 'script' | 'services';

export type BrowseCategory = {
  id: string;
  label: string;
  /** Eşleşen dahili servis kategorileri */
  match: string[];
};

/** Üst kategori listesi (Servisler dropdown) */
export const BROWSE_CATEGORIES: BrowseCategory[] = [
  {
    id: 'marketing',
    label: 'Marketing',
    match: ['E-posta & Pazarlama', 'E-posta Altyapısı', 'Analitik & Ürün'],
  },
  {
    id: 'sales-leads',
    label: 'Sales & Leads',
    match: ['BI & Görselleştirme', 'Arama'],
  },
  {
    id: 'media-design',
    label: 'Media & Design',
    match: ['Yayın & CMS', 'Dokümantasyon & Wiki'],
  },
  {
    id: 'operations',
    label: 'Operations',
    match: [
      'İzleme & Güvenilirlik',
      'Gözlemlenebilirlik',
      'Platform & Dağıtım',
      'Konteyner & Ağ',
      'Mesaj Kuyruğu & Akış',
    ],
  },
  {
    id: 'build-code',
    label: 'Build & Code',
    match: [
      'Backend & BaaS',
      'Kaynak Kodu & DevOps',
      'Geliştirme Araçları',
      'Depolama & Veritabanı',
      'Yapay Zeka',
      'Otomasyon & İş Akışı',
    ],
  },
  {
    id: 'customer-engagement',
    label: 'Customer Engagement',
    match: ['İletişim & Destek', 'Planlama & Randevu', 'Kimlik & Güvenlik'],
  },
];

export type NavMenuConfig = {
  id: NavMenuId;
  label: string;
  href: string;
  /** Dropdown’da gösterilecek kategori satırları */
  dropdownItems: { label: string; href: string }[];
  /** Sayfa filtresi için dahili kategori listesi */
  filterCategories?: string[];
};

export const NAV_MENUS: NavMenuConfig[] = [
  {
    id: 'saas',
    label: 'SaaS',
    href: '/services?type=saas',
    filterCategories: [
      'Yayın & CMS',
      'Dokümantasyon & Wiki',
      'Backend & BaaS',
      'Analitik & Ürün',
      'BI & Görselleştirme',
      'İletişim & Destek',
      'Planlama & Randevu',
      'E-posta & Pazarlama',
      'E-posta Altyapısı',
      'Platform & Dağıtım',
    ],
    dropdownItems: [],
  },
  {
    id: 'micro-saas',
    label: 'Micro-SaaS',
    href: '/services?type=micro-saas',
    filterCategories: [
      'İzleme & Güvenilirlik',
      'Kimlik & Güvenlik',
      'Arama',
      'Gözlemlenebilirlik',
    ],
    dropdownItems: [],
  },
  {
    id: 'script',
    label: 'Scriptler',
    href: '/services?type=script',
    filterCategories: [
      'Otomasyon & İş Akışı',
      'Kaynak Kodu & DevOps',
      'Konteyner & Ağ',
      'Mesaj Kuyruğu & Akış',
      'Geliştirme Araçları',
      'Yapay Zeka',
      'Depolama & Veritabanı',
    ],
    dropdownItems: [],
  },
  {
    id: 'services',
    label: 'Servisler',
    href: '/services',
    dropdownItems: [],
  },
];

/** Navbar “Ekosistem” mega menü */
export const ECOSYSTEM_NAV = {
  label: 'Ekosistem',
  href: '/services',
  browseAllLabel: 'Tüm ürünleri gör',
  categories: BROWSE_CATEGORIES.map((c) => ({
    label: c.label,
    href: `/services?category=${c.id}`,
  })),
  trending: [
    {
      title: 'Yeni eklenenler',
      description: 'Kataloğa yeni giren araçları keşfet.',
      href: '/services?sort=name-asc',
    },
    {
      title: 'AI stack',
      description: 'En iyi yapay zeka araçlarını tek yerde keşfet.',
      href: '/services?category=build-code',
    },
    {
      title: 'Popüler kategoriler',
      description: 'Backend, CMS ve otomasyon araçları.',
      href: '/services',
    },
    {
      title: 'Blacknook seçkisi',
      description: 'Özenle seçilmiş yazılım ve servisler.',
      href: '/services',
    },
    {
      title: 'CRM & Satış araçları',
      description: 'Satış ve lead süreçlerini hızlandır.',
      href: '/services?category=sales-leads',
      badge: 'YENİ' as const,
    },
  ],
  featured: {
    title: 'Pazarlama araçları',
    description: 'Analitik ve e-posta çözümlerini keşfet.',
    href: '/services?category=marketing',
    cta: 'Keşfet',
  },
} as const;

/** @deprecated — ECOSYSTEM_NAV kullanın */
export const CATEGORIES_NAV = {
  label: ECOSYSTEM_NAV.label,
  href: ECOSYSTEM_NAV.href,
  items: [
    { label: 'Servisler', href: '/services' },
    { label: 'Micro-SaaS', href: '/services?type=micro-saas' },
    { label: 'SaaS', href: '/services?type=saas' },
    { label: 'Scriptler', href: '/services?type=script' },
  ],
} as const;

export function getBrowseCategory(id: string): BrowseCategory | undefined {
  return BROWSE_CATEGORIES.find((c) => c.id === id);
}

export function getServicesForBrowseCategory(id: string): ServiceCatalogEntry[] {
  const cat = getBrowseCategory(id);
  if (!cat) return SERVICES;
  return SERVICES.filter((s) => cat.match.includes(s.category));
}

export function getNavMenuServices(
  menu: NavMenuConfig,
  options?: { cat?: string; limit?: number }
): ServiceCatalogEntry[] {
  let list = menu.filterCategories
    ? SERVICES.filter((s) => menu.filterCategories!.includes(s.category))
    : SERVICES;

  if (options?.cat) {
    list = list.filter((s) => s.category === options.cat);
  }

  return options?.limit ? list.slice(0, options.limit) : list;
}
