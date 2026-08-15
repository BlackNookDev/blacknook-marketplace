import { SERVICES, type ServiceCatalogEntry } from './data';

export type NavMenuId = 'saas' | 'micro-saas' | 'script' | 'services';

export type BrowseCategory = {
  id: string;
  label: string;
  /** Eşleşen dahili servis kategorileri */
  match: string[];
};

/** Üst kategori listesi (Ekosistem + browse filtreleri) */
export const BROWSE_CATEGORIES: BrowseCategory[] = [
  {
    id: 'pazarlama',
    label: 'Pazarlama & Analitik',
    match: ['E-posta & Pazarlama', 'E-posta Altyapısı', 'Analitik & Ürün'],
  },
  {
    id: 'veri-bi',
    label: 'Veri & BI',
    match: ['BI & Görselleştirme', 'Arama'],
  },
  {
    id: 'cms-icerik',
    label: 'CMS & İçerik',
    match: ['Yayın & CMS', 'Dokümantasyon & Wiki'],
  },
  {
    id: 'operasyon',
    label: 'Operasyon & Infra',
    match: [
      'İzleme & Güvenilirlik',
      'Gözlemlenebilirlik',
      'Platform & Dağıtım',
      'Konteyner & Ağ',
      'Mesaj Kuyruğu & Akış',
    ],
  },
  {
    id: 'build-backend',
    label: 'Build & Backend',
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
    id: 'destek-kimlik',
    label: 'Destek & Kimlik',
    match: ['İletişim & Destek', 'Planlama & Randevu', 'Kimlik & Güvenlik'],
  },
];

export type NavMenuConfig = {
  id: NavMenuId;
  label: string;
  href: string;
  /** Hub kanalı — ürünler bu kanala bağlanır */
  channel: 'service' | 'saas' | 'micro-saas' | 'script';
  /** true ise ürün listesi boş; “yakında” yüzeyi gösterilir */
  comingSoon?: boolean;
  /** Dropdown’da gösterilecek kategori satırları */
  dropdownItems: { label: string; href: string }[];
  /** @deprecated kanal modeline geçildi — kullanılmıyor */
  filterCategories?: string[];
};

export const NAV_MENUS: NavMenuConfig[] = [
  {
    id: 'saas',
    label: 'SaaS',
    href: '/services?type=saas',
    channel: 'saas',
    dropdownItems: [],
  },
  {
    id: 'micro-saas',
    label: 'MicroSaaS',
    href: '/services?type=micro-saas',
    channel: 'micro-saas',
    dropdownItems: [],
  },
  {
    id: 'script',
    label: 'Scriptler',
    href: '/services?type=script',
    channel: 'script',
    comingSoon: true,
    dropdownItems: [],
  },
  {
    id: 'services',
    label: 'Servisler',
    href: '/services',
    channel: 'service',
    dropdownItems: [],
  },
];

/** Navbar “Ekosistem” mega menü */
export const ECOSYSTEM_NAV = {
  label: 'Ekosistem',
  href: '/services',
  browseAllLabel: 'Servisleri keşfet',
  categories: [
    ...BROWSE_CATEGORIES.map((c) => ({
      label: c.label,
      href: `/services?category=${c.id}`,
    })),
    { label: 'SaaS', href: '/services?type=saas' },
    { label: 'MicroSaaS', href: '/services?type=micro-saas' },
    { label: 'Scriptler', href: '/services?type=script', badge: 'Yakında' as const },
  ],
  trending: [
    {
      title: 'Self-host stack',
      description: 'Coolify, Portainer, Traefik ve sunucu araçları.',
      href: '/services?category=operasyon',
    },
    {
      title: 'AI araçları',
      description: 'Ollama, Flowise, Langfuse ve yerel LLM.',
      href: `/services?category=build-backend&cat=${encodeURIComponent('Yapay Zeka')}`,
      badge: 'AI' as const,
    },
    {
      title: 'Backend & BaaS',
      description: 'Supabase, Appwrite, PocketBase, Hasura.',
      href: `/services?category=build-backend&cat=${encodeURIComponent('Backend & BaaS')}`,
    },
    {
      title: 'CMS & yayın',
      description: 'Ghost, Strapi, Directus, WordPress.',
      href: `/services?category=cms-icerik&cat=${encodeURIComponent('Yayın & CMS')}`,
    },
    {
      title: 'Otomasyon & iş akışı',
      description: 'n8n ve otomasyon araçları.',
      href: `/services?category=build-backend&cat=${encodeURIComponent('Otomasyon & İş Akışı')}`,
    },
  ],
  featured: {
    title: 'Pazarlama & analitik',
    description: 'Analitik ve e-posta çözümlerini keşfet.',
    href: '/services?category=pazarlama',
    cta: 'Keşfet',
  },
};

/** @deprecated — ECOSYSTEM_NAV kullanın */
export const CATEGORIES_NAV = {
  label: ECOSYSTEM_NAV.label,
  href: ECOSYSTEM_NAV.href,
  items: [
    { label: 'Servisler', href: '/services' },
    { label: 'MicroSaaS', href: '/services?type=micro-saas' },
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
  // Yakında kanallar — ürün yok (servis hub’ını yeniden etiketleme)
  if (menu.comingSoon || menu.channel !== 'service') {
    return [];
  }

  let list = SERVICES;

  if (options?.cat) {
    list = list.filter((s) => s.category === options.cat);
  }

  return options?.limit ? list.slice(0, options.limit) : list;
}
