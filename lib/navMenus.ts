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
    label: 'Pazarlama ve analiz',
    match: ['E-posta & Pazarlama', 'E-posta Altyapısı', 'Analitik & Ürün', 'E-ticaret'],
  },
  {
    id: 'veri-bi',
    label: 'Veri ve raporlar',
    match: ['BI & Görselleştirme', 'Arama'],
  },
  {
    id: 'cms-icerik',
    label: 'İçerik yönetimi',
    match: ['Yayın & CMS', 'Dokümantasyon & Wiki'],
  },
  {
    id: 'operasyon',
    label: 'Sunucu ve altyapı',
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
    label: 'Yazılım geliştirme',
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
    label: 'Destek ve güvenlik',
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
    label: 'Bulut yazılım',
    href: '/services?type=saas',
    channel: 'saas',
    dropdownItems: [],
  },
  {
    id: 'micro-saas',
    label: 'Mini yazılım',
    href: '/services?type=micro-saas',
    channel: 'micro-saas',
    dropdownItems: [],
  },
  {
    id: 'script',
    label: 'Betikler',
    href: '/services?type=script',
    channel: 'script',
    comingSoon: true,
    dropdownItems: [],
  },
  {
    id: 'services',
    label: 'Ekosistem',
    href: '/services',
    channel: 'service',
    dropdownItems: [],
  },
];

/** Navbar “Ekosistem” mega menü */
export const ECOSYSTEM_NAV = {
  label: 'Ekosistem',
  href: '/services',
  browseAllLabel: 'Ekosistemi keşfet',
  categories: [
    ...BROWSE_CATEGORIES.map((c) => ({
      label: c.label,
      href: `/services?category=${c.id}`,
    })),
    { label: 'Bulut yazılım', href: '/services?type=saas' },
    { label: 'Mini yazılım', href: '/services?type=micro-saas' },
    { label: 'Betikler', href: '/services?type=script', badge: 'Yakında' as const },
  ],
  trending: [
    {
      title: 'Kendi sunucunda kur',
      description: 'Coolify, Portainer, Traefik ve sunucu araçları.',
      href: '/services?category=operasyon',
    },
    {
      title: 'Yapay zeka',
      description: 'Ollama, Flowise, Langfuse ve yerel LLM.',
      href: `/services?category=build-backend&cat=${encodeURIComponent('Yapay Zeka')}`,
      badge: 'AI' as const,
    },
    {
      title: 'Backend araçları',
      description: 'Supabase, Appwrite, PocketBase, Hasura.',
      href: `/services?category=build-backend&cat=${encodeURIComponent('Backend & BaaS')}`,
    },
    {
      title: 'İçerik ve blog',
      description: 'Ghost, Strapi, Directus, WordPress.',
      href: `/services?category=cms-icerik&cat=${encodeURIComponent('Yayın & CMS')}`,
    },
    {
      title: 'Otomasyon',
      description: 'n8n ve iş akışı araçları.',
      href: `/services?category=build-backend&cat=${encodeURIComponent('Otomasyon & İş Akışı')}`,
    },
  ],
  featured: {
    title: 'Pazarlama ve analiz',
    description: 'Analitik ve e-posta çözümlerine göz atın.',
    href: '/services?category=pazarlama',
    cta: 'Keşfet',
  },
};

/** @deprecated — ECOSYSTEM_NAV kullanın */
export const CATEGORIES_NAV = {
  label: ECOSYSTEM_NAV.label,
  href: ECOSYSTEM_NAV.href,
  items: [
    { label: 'Ekosistem', href: '/services' },
    { label: 'Mini yazılım', href: '/services?type=micro-saas' },
    { label: 'Bulut yazılım', href: '/services?type=saas' },
    { label: 'Betikler', href: '/services?type=script' },
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
