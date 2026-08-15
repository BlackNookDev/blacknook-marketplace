/** Hub / stack kanalı — şu an yalnızca `service` dolu */
export type CatalogChannel = 'service' | 'saas' | 'micro-saas' | 'script';

export type ComingSoonCopy = {
  title: string;
  eyebrow: string;
  body: string;
  bullets: string[];
};

const COMING_SOON: Record<Exclude<CatalogChannel, 'service'>, ComingSoonCopy> = {
  saas: {
    eyebrow: 'Yakında',
    title: 'SaaS stack’i kuruluyor',
    body: 'Bağımsız SaaS ürünlerini tek seferlik lisans ve deal modeliyle burada listeleyeceğiz. Şimdilik canlı hub Servisler’de.',
    bullets: [
      'Seçilmiş SaaS ürünleri ve deal’ler',
      'Lisans ve erişim akışı',
      'Erken listeleme için partner başvurusu açık',
    ],
  },
  'micro-saas': {
    eyebrow: 'Yakında',
    title: 'Micro-SaaS stack’i geliyor',
    body: 'Dar kapsamlı, odaklı araçlar için ayrı bir hub açıyoruz. Küçük ürünler burada yer alacak.',
    bullets: [
      'Tek amaçlı Micro-SaaS araçları',
      'Hızlı keşif ve karşılaştırma',
      'Geliştiriciler için erken listeleme',
    ],
  },
  script: {
    eyebrow: 'Yakında',
    title: 'Script stack’i yakında',
    body: 'Küçük scriptler, otomasyon paketleri ve teknik tool’lar için ayrı hub açılıyor. Servis kurulumları şimdilik Servisler’den.',
    bullets: [
      'Hazır script ve otomasyon paketleri',
      'Teknik tool ve şablonlar',
      'Kurulum talebi Servis hub’ında devam ediyor',
    ],
  },
};

export function isComingSoonMenuId(id: string | null | undefined): boolean {
  return id === 'script';
}

export function getComingSoonCopy(id: string): ComingSoonCopy | null {
  if (id === 'saas' || id === 'micro-saas' || id === 'script') {
    return COMING_SOON[id];
  }
  return null;
}
