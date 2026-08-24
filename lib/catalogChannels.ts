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
    title: 'Bulut yazılım yakında',
    body: 'Bağımsız bulut yazılımlarını tek seferlik lisans ve kampanya modeliyle burada listeleyeceğiz. Şimdilik canlı hub Ekosistem’de.',
    bullets: [
      'Seçilmiş bulut yazılımları ve kampanyalar',
      'Lisans ve erişim akışı',
      'Erken listeleme için partner başvurusu açık',
    ],
  },
  'micro-saas': {
    eyebrow: 'Yakında',
    title: 'Mini yazılım yakında',
    body: 'Dar kapsamlı, odaklı araçlar için ayrı bir hub açıyoruz. Küçük ürünler burada yer alacak.',
    bullets: [
      'Tek amaçlı mini yazılımlar',
      'Hızlı keşif ve karşılaştırma',
      'Geliştiriciler için erken listeleme',
    ],
  },
  script: {
    eyebrow: 'Yakında',
    title: 'Betikler yakında',
    body: 'Küçük betikler, otomasyon paketleri ve teknik araçlar için ayrı hub açılıyor. Kurulum talepleri şimdilik Ekosistem’den.',
    bullets: [
      'Hazır betik ve otomasyon paketleri',
      'Teknik araçlar ve şablonlar',
      'Kurulum talebi Ekosistem hub’ında devam ediyor',
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
