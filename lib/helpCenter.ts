export type HelpArticle = {
  id: string;
  title: string;
  body: string;
};

export type HelpCategory = {
  slug: string;
  title: string;
  description: string;
  articles: HelpArticle[];
};

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    slug: 'genel',
    title: 'Genel bilgiler',
    description: 'Blacknook ile iletişim, partnerlik ve temel kurallar.',
    articles: [
      {
        id: 'contact',
        title: 'Bize nasıl ulaşırım?',
        body: 'Sorularınız için contact@blacknook.com adresine yazabilir veya yardım merkezindeki ilgili kategoriyi inceleyebilirsiniz. Partner başvuruları için /sell sayfasını kullanın.',
      },
      {
        id: 'what-is',
        title: 'Blacknook nedir?',
        body: 'Blacknook; bağımsız geliştiriciler ve erken aşama girişimlerin yazılım ile dijital ürünlerini listelediği, alıcıların ise iş araçlarını keşfettiği bir pazaryeridir.',
      },
      {
        id: 'tos',
        title: 'Kullanım koşulları ve gizlilik',
        body: 'Platformu kullanarak Kullanım Koşulları ve Gizlilik Politikası’nı kabul etmiş sayılırsınız. Güncel metinler /terms ve /privacy sayfalarındadır.',
      },
    ],
  },
  {
    slug: 'hesap',
    title: 'Hesap yönetimi',
    description: 'E-posta, şifre, profil ve oturum işlemleri.',
    articles: [
      {
        id: 'create',
        title: 'Hesap nasıl oluşturulur?',
        body: 'Kayıt ol sayfasından e-posta ve şifrenizle hesap açabilirsiniz. Giriş yaptıktan sonra Profil menüsünden hesap ayarlarınıza ulaşırsınız.',
      },
      {
        id: 'password',
        title: 'Şifremi unuttum',
        body: 'Şimdilik demo ortamında şifre sıfırlama e-postası gönderilmez. Destek için contact@blacknook.com adresine hesabınızın e-postasını yazarak ulaşın.',
      },
      {
        id: 'profile',
        title: 'Profilimi nereden düzenlerim?',
        body: 'Giriş yaptıktan sonra sağ üstteki avatar menüsünden Profil’e gidin. Hesap, ürünler ve faturalama sekmeleri burada yer alır.',
      },
    ],
  },
  {
    slug: 'odeme',
    title: 'Ödeme merkezi',
    description: 'Ödeme yöntemleri, faturalar ve iade süreçleri.',
    articles: [
      {
        id: 'methods',
        title: 'Hangi ödeme yöntemleri kabul edilir?',
        body: 'Satın almalar üçüncü taraf ödeme sağlayıcıları üzerinden işlenir. Kart bilgileriniz Blacknook sunucularında saklanmaz.',
      },
      {
        id: 'invoice',
        title: 'Faturamı nerede görürüm?',
        body: 'Hesabınızda Ödeme & faturalama bölümünden geçmiş işlemlerinize ulaşabilirsiniz. Eksik fatura için destek ekibine yazın.',
      },
      {
        id: 'refund',
        title: 'İade politikası nedir?',
        body: 'İade süreleri ürüne göre değişebilir ve ürün sayfasında belirtilir. Aşırı veya kötüye kullanıma yönelik iade talepleri reddedilebilir. Detaylar Kullanım Koşulları’ndadır.',
      },
    ],
  },
  {
    slug: 'urunler',
    title: 'Ürünler ve lisanslar',
    description: 'Satın alma, erişim ve ürün desteği.',
    articles: [
      {
        id: 'access',
        title: 'Satın aldığım ürüne nasıl erişirim?',
        body: 'Satın alma sonrası lisans veya erişim bilgileri Hesap → Ürünler bölümünde görünür. Partner ürünlerinde teknik destek öncelikle ürün sahibinden sağlanır.',
      },
      {
        id: 'lifetime',
        title: 'Ömür boyu erişim ne anlama gelir?',
        body: 'Ömür boyu erişim, ürünün pazaryerinde sunulduğu süre boyunca geçerli erişimi ifade eder; kişisel ömür veya ürünün sonsuza dek aynı özelliklerle kalacağı anlamına gelmez.',
      },
      {
        id: 'resell',
        title: 'Ürünü yeniden satabilir miyim?',
        body: 'Hayır. Blacknook üzerinden alınan ürünlerin yeniden satışı, takası veya ticari paylaşımı yasaktır ve hesap kısıtlamasına yol açabilir.',
      },
    ],
  },
  {
    slug: 'partner',
    title: 'Partner kaynakları',
    description: 'Ürün listeleme, moderasyon ve partner paneli.',
    articles: [
      {
        id: 'apply',
        title: 'Partner olmak için ne yapmalıyım?',
        body: 'Partner programı sayfasından süreci inceleyin, ardından ürün oluştur formunu doldurun. Başvurunuz moderasyona alınır; durumunu Partner durumu sayfasından takip edebilirsiniz.',
      },
      {
        id: 'review',
        title: 'İnceleme ne kadar sürer?',
        body: 'Moderasyon süresi ürünün eksiksizliğine göre değişir. Eksik görsel, fiyat veya yasal bilgi başvuruyu geciktirebilir.',
      },
      {
        id: 'support-partner',
        title: 'Alıcı desteğini kim verir?',
        body: 'Ürün desteği partnerin sorumluluğundadır. Blacknook gerektiğinde arabuluculuk yapabilir ancak ürünün teknik desteğini garanti etmez.',
      },
    ],
  },
  {
    slug: 'guvenlik',
    title: 'Güvenlik ve gizlilik',
    description: 'Veri koruma, hesap güvenliği ve şüpheli işlemler.',
    articles: [
      {
        id: 'data',
        title: 'Verilerim nasıl korunur?',
        body: 'Gizlilik Politikası’nda hangi verileri neden işlediğimizi anlatıyoruz. Ödeme kartı verileri doğrudan üçüncü taraf sağlayıcılarda işlenir.',
      },
      {
        id: 'breach',
        title: 'Hesabımda şüpheli aktivite görüyorum',
        body: 'Hemen şifrenizi değiştirin ve contact@blacknook.com adresine “Hesap güvenliği” konulu bir e-posta gönderin. Mümkünse ilgili tarih ve saatleri belirtin.',
      },
    ],
  },
];

export function getHelpCategory(slug: string) {
  return HELP_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function searchHelp(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: { category: HelpCategory; article: HelpArticle }[] = [];
  for (const category of HELP_CATEGORIES) {
    for (const article of category.articles) {
      const hay = `${category.title} ${article.title} ${article.body}`.toLowerCase();
      if (hay.includes(q)) hits.push({ category, article });
    }
  }
  return hits;
}
