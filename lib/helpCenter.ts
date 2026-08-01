export type HelpArticle = {
  id: string;
  title: string;
  /** Liste ve aramada görünen kısa alt açıklama */
  summary: string;
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
    slug: 'partner',
    title: 'Partner kaynakları',
    description:
      'Blacknook partneri olmak, ürün göndermek, lansman ve Partner Portal hakkında her şey burada.',
    articles: [
      {
        id: 'why-partner',
        title: 'Neden Blacknook partneri olmalıyım?',
        summary: 'Görünürlük, erken kullanıcı ve peşin maliyetsiz dağıtım.',
        body: 'Blacknook, çalışan yazılım ürünlerinizi iş odaklı alıcılara ulaştırır. Peşin listeleme ücreti yoktur; kazandıkça birlikte büyürüz. Moderasyonlu katalog güven verir, Select ise seçilmiş ürünler için özel lansman sunar. Bağımsız ekipler ve erken aşama SaaS için düşük sürtünmeli bir dağıtım kanalıdır.',
      },
      {
        id: 'how-to-submit',
        title: 'Blacknook ile nasıl ortak olur ve ürünümü nasıl gönderirim?',
        summary: 'Sell sayfası, ürün formu ve inceleme kuyruğu.',
        body: 'Önce /sell üzerinden partner programını okuyun. Ardından /partners/self-submission formunu doldurun: ürün bilgisi, medya, özellikler, fiyat planları ve kurucu hikâyesi. Gönderim sonrası başvurunuz incelenmeye alınır; durumu /partners/status veya Partner Portal’dan takip edersiniz. Giriş yaptıysanız Portal’a erken erişebilirsiniz; satış ve fatura onay sonrası açılır.',
      },
      {
        id: 'vetting',
        title: 'Başvuru inceleme sürecimiz nasıl işler?',
        summary: 'Kalite, destek kapasitesi ve pazaryeri uyumu kontrolü.',
        body: 'İncelemede ürünün çalışır olması, net değer önerisi, dürüst fiyatlandırma, yeterli görsel/medya ve destek kapasitesi aranır. Vaporware, yanıltıcı iddia veya destek planı olmayan gönderimler reddedilebilir. Süre, dosyanın eksiksizliğine göre değişir; ek bilgi istenebilir.',
      },
      {
        id: 'rejected',
        title: 'Ürün başvurum neden kabul edilmedi?',
        summary: 'Sık red nedenleri ve yeniden gönderme.',
        body: 'Sık nedenler: eksik ekran görüntüsü, belirsiz plan matrisi, çalışmayan demo/link, abartılı vaatler, destek kanalının tanımsız olması. Red notunu Partner durumu veya Portal’dan okuyun, formu güncelleyip yeniden gönderin. Select’e uygun olmayan ürünler standart listeleme için yine de uygun olabilir.',
      },
      {
        id: 'plan-tiers',
        title: 'Birden fazla plan kademesini nasıl listelerim?',
        summary: 'Lifetime, yıllık ve kademeli plan matrisi.',
        body: 'Ürün formundaki fiyat adımında birden fazla tier tanımlayabilirsiniz. Her planın adı, fiyatı ve özellik farkları net olmalıdır. “Tüm planlarda ortak” özellikler ile plana özel satırları ayırın. Alıcıların karşılaştırma yapabilmesi için plan sayısını sade tutun.',
      },
      {
        id: 'founder-story',
        title: '“Kurucudan” / hikâye bölümünü nasıl yazarım?',
        summary: 'Güven, bağlam ve dürüst anlatım ipuçları.',
        body: 'Kısa tutul: kim olduğunuz, sorunu neden çözdüğünüz, ürünün bugünkü durumu. Abartmadan sosyal kanıt (kullanıcı, GitHub, lansman) ekleyebilirsiniz. Bu bölüm alıcı güvenini artırır; pazarlama sloganı yerine samimi ve somut bir anlatım tercih edin.',
      },
      {
        id: 'honest-reviews',
        title: 'Dürüst inceleme / geri bildirim nasıl istenir?',
        summary: 'Teşvik kuralları ve güvenilir sosyal kanıt.',
        body: 'Kullanıcılardan yalnızca gerçek deneyime dayalı geri bildirim isteyin. İnceleme karşılığı yanıltıcı teşvik veya sahte puan yasaktır. Lansman sonrası destek kalitesi ve ürün güncellemeleri organik yorumları güçlendirir. Olumsuz geri bildirime yapıcı yanıt vermek, silmekten daha iyidir.',
      },
      {
        id: 'redemption',
        title: 'Lisans / erişim (redemption) akışını nasıl kurarım?',
        summary: 'Kod, hesap daveti veya self-serve aktivasyon.',
        body: 'Alıcının satın alma sonrası ürüne nasıl erişeceğini net tanımlayın: lisans anahtarı, davet linki, hesap oluşturma veya webhook. Kurulum adımlarını ürün sayfasında ve destek dokümanında yazın. Eksik redemption planı incelemede gecikme veya red nedeni olabilir.',
      },
      {
        id: 'deal-live',
        title: 'Ürünüm yayında! Şimdi ne yapmalıyım?',
        summary: 'Destek hazırlığı, güncelleme ve görünürlük.',
        body: 'Destek kanalınızı (e-posta / docs) kontrol edin, SSS’yi güncelleyin ve ilk 48 saat için yanıt SLA’sı belirleyin. Partner Portal’dan liste durumunu izleyin. Select’e uygunsa /select üzerinden özel lansmanı değerlendirin. Ürün güncellemelerini alıcılara duyurun; sessiz major breaking change’lerden kaçının.',
      },
      {
        id: 'support-ready',
        title: 'Lansman için destek ekibim hazır mı?',
        summary: 'Yanıt süresi, bilinen hatalar ve escalation.',
        body: 'Yayın öncesi: bilinen hatalar listesi, kurulum rehberi, fatura/lisans SSS’leri hazır olsun. Yoğun günde gecikme riskine karşı şablon yanıtlar kullanın. Blacknook arabuluculuk yapabilir ama birinci hat ürün desteği sizdedir.',
      },
      {
        id: 'customer-comms',
        title: 'Ürün sayfasında olumlu/olumsuz yorumlara nasıl yaklaşırım?',
        summary: 'Şeffaflık, sakin ton ve çözüm odaklı yanıt.',
        body: 'Olumlu yorumlara teşekkür edin; olumsuzlarda suçu sahiplenmeden sorunu netleştirin ve çözüm sunun. Tartışmayı kişisel hale getirmeyin. Tekrarlayan şikayetleri ürün yol haritasına alın. Kullanım Koşulları’na aykırı içerikleri Blacknook’a bildirin.',
      },
      {
        id: 'update-offer',
        title: 'Teklifimi / listemi nasıl güncellerim?',
        summary: 'Fiyat, plan ve medya değişiklikleri.',
        body: 'Önemli değişiklikler (fiyat artışı, özellik kaldırma, medya) yeniden incelemeye gidebilir. Mevcut alıcı taahhütlerinizi bozmayın; “ömür boyu” vaat edilen kapsamı tek taraflı daraltmayın. Güncellemeyi Partner Portal ve ürün formu üzerinden yapın.',
      },
      {
        id: 'buyer-contacts',
        title: 'Alıcı iletişim bilgilerine nasıl ulaşırım?',
        summary: 'Teslimat için gerekli veri ve gizlilik.',
        body: 'Satın alma sonrası ürünü teslim etmek için gerekli iletişim bilgileri (ör. e-posta) partner ile paylaşılabilir. Bu veriyi yalnızca teslimat ve destek için kullanın; spam veya üçüncü tarafa satış yasaktır. Detaylar Gizlilik Politikası’ndadır.',
      },
      {
        id: 'listing-cost',
        title: 'Blacknook’ta listelemek ne kadara mal olur?',
        summary: 'Peşin ücret yok; gelir paylaşımı modeli.',
        body: 'Başvuru ve standart listeleme peşin ücretsizdir. Gelir paylaşımı ve plan yapısı ürüne göre belirlenir. Select özel bir lansman programıdır; peşin zorunlu maliyet olmadan seçim + birlikte yürütülen kampanya mantığıyla çalışır. Güncel koşullar için /sell ve /select sayfalarına bakın.',
      },
      {
        id: 'track-sales',
        title: 'Satış ve iadeleri nasıl takip ederim?',
        summary: 'Partner Portal → Satış ve Analitik.',
        body: 'Onaylı partnerler /partners/sales üzerinden sipariş özeti, ürüne göre gelir ve sipariş geçmişini görür (demo ortamında örnek veriler). İade talepleri politika ve iyi niyet çerçevesinde işlenir; aşırı iade hesap riski oluşturabilir.',
      },
      {
        id: 'payouts',
        title: 'Ödemeler nasıl ve ne zaman yapılır?',
        summary: 'Dönemsel ödeme ve faturalandırma ekranı.',
        body: 'Canlı sistemde partner ödemeleri dönemsel olarak netleştirilir. /partners/billing altında brüt / platform payı / net özet ve dönem satırları yer alır. Ödeme yöntemi bağlama canlıda açılır; demo’da placeholder’dır. Sorular için Partner Portal → Destek veya contact@blacknook.com.',
      },
      {
        id: 'refund-policy-partner',
        title: 'Listem için iade politikası nedir?',
        summary: 'Alıcı iadeleri ve partner taahhüdü.',
        body: 'İade süreleri ürün sayfasında belirtilir. Blacknook, aşırı veya kötüye kullanıma yönelik iadeleri sınırlayabilir. Partner olarak ürün kalitesi ve destek taahhüdünüzü korumanız iade oranını düşürür. Politika metni Kullanım Koşulları’nda yer alır.',
      },
      {
        id: 'buyer-commitment',
        title: 'Alıcılara karşı taahhüdüm nedir?',
        summary: 'Destek, erişim ve dürüst ürün vaadi.',
        body: 'Listelediğiniz özellikler ve plan kapsamı satış anındaki vaadinizdir. Makul destek süresi, güvenlik yamaları ve erişim sürekliliği beklenir. Ürünü aniden kapatmak veya lisansları geçersiz kılmak taahhüt ihlali sayılabilir; planlı sunset’i önceden duyurun.',
      },
      {
        id: 'portal-nav',
        title: 'Partner Portal’da nasıl gezinirim?',
        summary: 'Kontrol paneli, listeler, satış, fatura, destek.',
        body: '/partners/overview kontrol panelidir. Listeler ürünlerinizi gösterir; Satış ve Analitik metrikleri; Faturalandırma ödemeleri; Destek SSS ve talep formunu. Onay öncesi menüyü gezebilirsiniz; kilitli sekmeler onay sonrası açılır. Select için /select, standart başvuru için /sell.',
      },
      {
        id: 'select-vs-standard',
        title: 'Select ile standart listeleme farkı nedir?',
        summary: 'Kürasyonlu lansman vs self-serve katalog.',
        body: 'Standart yol: ürün formunu doldurup katalogda yer almak. Blacknook Select: sınırlı sayıda ürün için strateji, görünürlük ve lansman eşliği. Select’e her başvuru alınmaz; hazır değilseniz standart partner programıyla başlayın. Detay: /select.',
      },
    ],
  },
  {
    slug: 'genel',
    title: 'Genel bilgiler',
    description: 'Blacknook ile iletişim, partnerlik ve temel kurallar.',
    articles: [
      {
        id: 'contact',
        title: 'Bize nasıl ulaşırım?',
        summary: 'E-posta, yardım merkezi ve partner başvuru kanalları.',
        body: 'Sorularınız için contact@blacknook.com adresine yazabilir veya yardım merkezindeki ilgili kategoriyi inceleyebilirsiniz. Partner başvuruları için /sell sayfasını kullanın. Acil hesap güvenliği konularında e-posta konu satırına “Hesap güvenliği” yazın.',
      },
      {
        id: 'what-is',
        title: 'Blacknook nedir?',
        summary: 'Yazılım ve dijital ürün pazaryerinin kısa tanımı.',
        body: 'Blacknook; bağımsız geliştiriciler ve erken aşama girişimlerin yazılım ile dijital ürünlerini listelediği, alıcıların ise iş araçlarını keşfettiği bir pazaryeridir. Moderasyonlu katalog, partner portalı ve Select lansman programı aynı ekosistemin parçasıdır.',
      },
      {
        id: 'tos',
        title: 'Kullanım koşulları ve gizlilik',
        summary: 'Yasal metinlerin nerede olduğu ve ne zaman geçerli olduğu.',
        body: 'Platformu kullanarak Kullanım Koşulları ve Gizlilik Politikası’nı kabul etmiş sayılırsınız. Güncel metinler /terms ve /privacy sayfalarındadır. Partnerler ayrıca listeleme ve destek yükümlülüklerine uyar.',
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
        summary: 'Kayıt, giriş ve ilk profil adımları.',
        body: 'Kayıt ol sayfasından e-posta ve şifrenizle hesap açabilirsiniz. Giriş yaptıktan sonra Profil menüsünden hesap ayarlarınıza ulaşırsınız. Partner Portal’a erken erişim için giriş yeterlidir; satış özellikleri onay sonrası açılır.',
      },
      {
        id: 'password',
        title: 'Şifremi unuttum',
        summary: 'Demo ortamında sıfırlama ve destek yolu.',
        body: 'Şimdilik demo ortamında şifre sıfırlama e-postası gönderilmez. Destek için contact@blacknook.com adresine hesabınızın e-postasını yazarak ulaşın.',
      },
      {
        id: 'profile',
        title: 'Profilimi nereden düzenlerim?',
        summary: 'Avatar menüsü, hesap sekmeleri ve faturalama.',
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
        summary: 'Kart ve üçüncü taraf ödeme işlemcileri.',
        body: 'Satın almalar üçüncü taraf ödeme sağlayıcıları üzerinden işlenir. Kart bilgileriniz Blacknook sunucularında saklanmaz.',
      },
      {
        id: 'invoice',
        title: 'Faturamı nerede görürüm?',
        summary: 'Alıcı faturaları ve eksik belge talebi.',
        body: 'Hesabınızda Ödeme & faturalama bölümünden geçmiş işlemlerinize ulaşabilirsiniz. Eksik fatura için destek ekibine yazın.',
      },
      {
        id: 'refund',
        title: 'İade politikası nedir?',
        summary: 'Ürüne özel süreler ve kötüye kullanım sınırları.',
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
        summary: 'Lisans, hesap ürünleri ve partner desteği.',
        body: 'Satın alma sonrası lisans veya erişim bilgileri Hesap → Ürünler bölümünde görünür. Partner ürünlerinde teknik destek öncelikle ürün sahibinden sağlanır.',
      },
      {
        id: 'lifetime',
        title: 'Ömür boyu erişim ne anlama gelir?',
        summary: 'Lifetime tekliflerin gerçek kapsamı.',
        body: 'Ömür boyu erişim, ürünün pazaryerinde sunulduğu süre boyunca geçerli erişimi ifade eder; kişisel ömür veya ürünün sonsuza dek aynı özelliklerle kalacağı anlamına gelmez.',
      },
      {
        id: 'resell',
        title: 'Ürünü yeniden satabilir miyim?',
        summary: 'Yeniden satış yasağı ve hesap riski.',
        body: 'Hayır. Blacknook üzerinden alınan ürünlerin yeniden satışı, takası veya ticari paylaşımı yasaktır ve hesap kısıtlamasına yol açabilir.',
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
        summary: 'Gizlilik politikası ve ödeme verisi.',
        body: 'Gizlilik Politikası’nda hangi verileri neden işlediğimizi anlatıyoruz. Ödeme kartı verileri doğrudan üçüncü taraf sağlayıcılarda işlenir.',
      },
      {
        id: 'breach',
        title: 'Hesabımda şüpheli aktivite görüyorum',
        summary: 'Şifre değişimi ve güvenlik bildirimi.',
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
      const hay = `${category.title} ${article.title} ${article.summary} ${article.body}`.toLowerCase();
      if (hay.includes(q)) hits.push({ category, article });
    }
  }
  return hits;
}
