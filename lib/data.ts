export interface ServiceCatalogItem {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  features: string[];
  about: string;
  useCases: string[];
}

export type ServiceCatalogEntry = ServiceCatalogItem & { brandColor: string };

export const SERVICES: ServiceCatalogEntry[] = [
  {
    slug: 'ghost',
    name: 'Ghost',
    description: 'Yaratıcılar ve yayıncılar için modern, bağımsız içerik platformu.',
    icon: 'ghost',
    category: 'Yayın & CMS',
    brandColor: '#15171A',
    features: [
      'Markdown ve zengin editör ile yazım deneyimi',
      'Üyelik, abonelik ve Stripe ile ücretli içerik',
      'SEO, AMP ve sitemap desteği',
      'REST Content API ve Admin API',
      'Tema sistemi ve Handlebars şablonları',
    ],
    about:
      'Ghost, 2013\'ten beri geliştirilen açık kaynaklı bir yayıncılık platformudur; blog, bülten ve üyelik tabanlı medya sitelerini tek bir Node.js uygulamasında birleştirir. Kurumsal CMS karmaşıklığı yerine yazar odaklı arayüz, yerleşik e-posta bülteni (Ghost Mail) ve yerel analitik sunar. Self-host veya Ghost(Pro) bulut hizmeti ile çalışabilir.',
    useCases: [
      'Bağımsız blog ve kişisel marka siteleri',
      'Ücretli abonelikli haber bültenleri',
      'Şirket içi teknik blog ve dokümantasyon',
    ],
  },
  {
    slug: 'appwrite',
    name: 'Appwrite',
    description: 'Mobil ve web uygulamaları için açık kaynak backend sunucusu.',
    icon: 'appwrite',
    category: 'Backend & BaaS',
    brandColor: '#FD366E',
    features: [
      'Kimlik doğrulama (e-posta, OAuth, telefon, anonim)',
      'Veritabanı koleksiyonları ve gerçek zamanlı abonelikler',
      'Dosya depolama ve önizleme dönüşümleri',
      'Sunucusuz fonksiyonlar ve zamanlanmış görevler',
      'REST, GraphQL ve çoklu SDK desteği',
    ],
    about:
      'Appwrite, geliştiricilerin kendi altyapılarında barındırabileceği bir Backend-as-a-Service platformudur. Docker ile kurulur; kullanıcı yönetimi, veritabanı, depolama ve sunucu tarafı mantığı tek panelden yönetilir. Veri egemenliği ve self-host önceliği ile Firebase benzeri deneyim sunar.',
    useCases: [
      'Mobil uygulama backend\'i self-host ortamında',
      'Hızlı MVP ve prototip geliştirme',
      'KVKK/GDPR uyumu için veriyi kendi sunucusunda tutma',
    ],
  },
  {
    slug: 'supabase',
    name: 'Supabase',
    description: 'PostgreSQL tabanlı açık kaynak Firebase alternatifi.',
    icon: 'supabase',
    category: 'Backend & BaaS',
    brandColor: '#3FCF8E',
    features: [
      'Yönetilen PostgreSQL ve otomatik REST (PostgREST)',
      'Gerçek zamanlı değişiklik dinleme',
      'GoTrue ile kimlik ve satır düzeyinde güvenlik (RLS)',
      'Edge Functions ve depolama bucket\'ları',
      'Dashboard, SQL editörü ve migration araçları',
    ],
    about:
      'Supabase, açık kaynaklı bir geliştirici platformudur; çekirdeğinde tam özellikli PostgreSQL bulunur. Auth, depolama, edge fonksiyonları ve vektör arama gibi modern uygulama ihtiyaçları tek ekosistemde toplanır. Self-host veya yönetilen bulut seçenekleri mevcuttur.',
    useCases: [
      'SaaS uygulamalarında kullanıcı ve veri katmanı',
      'Gerçek zamanlı işbirlikçi uygulamalar',
      'AI uygulamalarında pgvector ile embedding saklama',
    ],
  },
  {
    slug: 'plausible',
    name: 'Plausible',
    description: 'Çerezsiz, GDPR uyumlu hafif web analitiği.',
    icon: 'plausibleanalytics',
    category: 'Analitik & Ürün',
    brandColor: '#5850EC',
    features: [
      'Çerez ve kişisel veri toplamadan ziyaret istatistikleri',
      'Hafif script (~1 KB) ve hızlı yükleme',
      'Özel etkinlik ve hedef dönüşüm takibi',
      'E-posta/Slack haftalık raporlar',
      'Açık kaynak; self-host veya Plausible Cloud',
    ],
    about:
      'Plausible Analytics, web sitelerinin trafiğini gizlilik odaklı şekilde ölçen Avrupa merkezli bir analitik aracıdır. Google Analytics\'e kıyasla basit paneller, şeffaf metodoloji ve AB veri koruma ilkelerine uyum hedefler. Kaynak kodu GitHub\'da açıktır.',
    useCases: [
      'Kurumsal sitelerde çerez banner\'ı olmadan trafik ölçümü',
      'Blog ve landing page performans takibi',
      'Ajansların çoklu site panelleri',
    ],
  },
  {
    slug: 'n8n',
    name: 'N8N',
    description: 'Görsel düzenleyici ile kod ve no-code otomasyon platformu.',
    icon: 'n8n',
    category: 'Otomasyon & İş Akışı',
    brandColor: '#EA4B71',
    features: [
      '400+ entegrasyon düğümü',
      'JavaScript/Python kod adımları',
      'Webhook, cron ve olay tetikleyicileri',
      'Self-host ve n8n Cloud',
      'Hata yönetimi, dallanma ve alt iş akışları',
    ],
    about:
      'n8n (nodemation), iş akışlarını düğüm tabanlı bir editörde birleştiren açık kaynak otomasyon aracıdır. Zapier/Make benzeri senaryoları kendi sunucunuzda çalıştırarak veri egemenliği sağlar. Fair-code lisansı ile kaynak erişilebilir kalır.',
    useCases: [
      'CRM, e-posta ve Slack arasında veri senkronizasyonu',
      'API birleştirme ve ETL hafif senaryoları',
      'IT operasyonlarında uyarı ve on-call otomasyonu',
    ],
  },
  {
    slug: 'minio',
    name: 'MinIO',
    description: 'S3 uyumlu yüksek performanslı nesne depolama.',
    icon: 'minio',
    category: 'Depolama & Veritabanı',
    brandColor: '#C72E49',
    features: [
      'Amazon S3 API uyumluluğu',
      'Erasure coding ve sunucu kümesi ölçekleme',
      'Bucket bildirimleri ve yaşam döngüsü kuralları',
      'TLS, IAM politikaları ve KMS entegrasyonu',
      'Kubernetes ve bare-metal dağıtım',
    ],
    about:
      'MinIO, bulut nesne depolama iş yükleri için tasarlanmış açık kaynak yazılımdır. Yedekleme, medya arşivleri ve veri gölleri için S3 protokolü kullanan uygulamalarla doğrudan uyumludur. Yüksek throughput ve düşük gecikme hedeflenir.',
    useCases: [
      'Uygulama dosya ve medya yüklemeleri',
      'Yedekleme hedefi ve off-site replikasyon',
      'Veri gölü ve analitik ham veri depolama',
    ],
  },
  {
    slug: 'redis',
    name: 'Redis',
    description: 'Bellek içi veri yapıları, önbellek ve mesajlaşma.',
    icon: 'redis',
    category: 'Depolama & Veritabanı',
    brandColor: '#FF4438',
    features: [
      'String, hash, list, set, sorted set veri tipleri',
      'TTL ile otomatik anahtar sona erdirme',
      'Pub/Sub ve Redis Streams',
      'Redis Stack: JSON, arama, time series',
      'Replikasyon, Sentinel ve Cluster modları',
    ],
    about:
      'Redis, bellekte çalışan açık kaynak bir veri deposudur; önbellek, oturum saklama, rate limiting ve gerçek zamanlı skor tabloları için endüstri standardı haline gelmiştir. Kalıcılık (RDB/AOF) ile bellek hızı disk güvenilirliğiyle birleştirilebilir.',
    useCases: [
      'Web uygulaması oturum ve API önbelleği',
      'Sıra ve iş dağıtımı (task queue)',
      'Gerçek zamanlı liderlik tabloları ve sayaçlar',
    ],
  },
  {
    slug: 'postgresql',
    name: 'PostgreSQL',
    description: 'Gelişmiş SQL özellikleri sunan açık kaynak ilişkisel veritabanı.',
    icon: 'postgresql',
    category: 'Depolama & Veritabanı',
    brandColor: '#4169E1',
    features: [
      'ACID uyumlu transaction ve MVCC',
      'JSONB, dizi ve coğrafi (PostGIS) tipler',
      'Tam metin arama ve pgvector eklentisi',
      'Partitioning, replikasyon ve logical decoding',
      'Geniş eklenti ekosistemi',
    ],
    about:
      'PostgreSQL, 30 yılı aşkın geçmişe sahip nesne-ilişkisel bir veritabanı yönetim sistemidir. Kurumsal özellikler (foreign key, trigger, stored procedure) açık kaynak lisansla sunulur. Supabase, GitLab ve birçok SaaS ürününün varsayılan veritabanıdır.',
    useCases: [
      'Transactional iş uygulamaları ve ERP verisi',
      'Coğrafi ve analitik sorgular (PostGIS)',
      'OLTP + hafif OLAP hibrit yükler',
    ],
  },
  {
    slug: 'metabase',
    name: 'Metabase',
    description: 'Teknik olmayan ekipler için self-servis BI ve panolar.',
    icon: 'metabase',
    category: 'BI & Görselleştirme',
    brandColor: '#509EE3',
    features: [
      'Görsel sorgu oluşturucu ve native SQL',
      'Dashboard, filtre ve drill-through',
      'E-posta ve Slack ile zamanlanmış raporlar',
      'Çoklu veritabanı bağlantısı (Postgres, MySQL, BigQuery vb.)',
      'Satır düzeyinde sandbox ve SSO',
    ],
    about:
      'Metabase, şirket verilerini sorgulamak ve görselleştirmek için tasarlanmış açık kaynak bir iş zekası aracıdır. Kurulumu hızlıdır; product ve operasyon ekiplerinin SQL yazmadan metrik tüketmesini hedefler. Enterprise sürümünde gelişmiş güvenlik ve embedding sunulur.',
    useCases: [
      'Satış ve pazarlama funnel panoları',
      'Operasyonel KPI takibi',
      'Müşteriye gömülü analitik (embedded analytics)',
    ],
  },
  {
    slug: 'meilisearch',
    name: 'Meilisearch',
    description: 'Typo toleranslı, milisaniye gecikmeli arama motoru.',
    icon: 'meilisearch',
    category: 'Arama',
    brandColor: '#FF5CAA',
    features: [
      'Anında arama (search-as-you-type)',
      'Yazım hatası toleransı ve eşanlamlılar',
      'Faceted filtreleme ve sıralama kuralları',
      'REST API ve resmi SDK\'lar',
      'Tenant token ile çok kiracılı güvenlik',
    ],
    about:
      'Meilisearch, Rust ile yazılmış açık kaynak bir arama motorudur; e-ticaret katalogları ve dokümantasyon siteleri için optimize edilmiştir. Elasticsearch\'e kıyasla daha basit operasyon ve hızlı indeksleme sunar. Bulut ve self-host seçenekleri vardır.',
    useCases: [
      'E-ticaret ürün arama çubuğu',
      'Dokümantasyon ve wiki tam metin arama',
      'Medya kütüphanesi ve içerik keşfi',
    ],
  },
  {
    slug: 'wordpress',
    name: 'WordPress',
    description: 'Dünyanın en yaygın açık kaynak içerik yönetim sistemi.',
    icon: 'wordpress',
    category: 'Yayın & CMS',
    brandColor: '#21759B',
    features: [
      'Gutenberg blok editörü',
      'Tema ve eklenti ekosistemi',
      'Kullanıcı rolleri ve çoklu site (Multisite)',
      'REST API ve headless kullanım',
      'WooCommerce ile e-ticaret',
    ],
    about:
      'WordPress, PHP tabanlı açık kaynak bir CMS\'dir; internetteki sitelerin önemli bir kısmını güçlendirir. Blogdan kurumsal siteye, üyelik portalından mağazaya genişletilebilir. Topluluk ve ticari eklenti/tema pazarı olgunlaşmıştır.',
    useCases: [
      'Kurumsal web sitesi ve landing page',
      'Haber portalı ve dergi yayını',
      'WooCommerce ile online mağaza',
    ],
  },
  {
    slug: 'umami',
    name: 'Umami',
    description: 'Minimal, gizlilik odaklı açık kaynak web analitiği.',
    icon: 'umami',
    category: 'Analitik & Ürün',
    brandColor: '#000000',
    features: [
      'Çerezsiz, anonim ziyaretçi ölçümü',
      'Özel olay ve hedef URL takibi',
      'Çoklu site ve takım paylaşımı',
      'MySQL veya PostgreSQL backend',
      'Self-host ve Umami Cloud',
    ],
    about:
      'Umami, Next.js ve açık kaynak lisansla geliştirilen hafif bir analitik uygulamasıdır. Plausible ve Fathom gibi gizlilik odaklı alternatifler arasında yer alır; kurulumu basit ve arayüzü sade tutulmuştur.',
    useCases: [
      'Kişisel blog trafik istatistikleri',
      'Startup MVP\'de hızlı analitik',
      'Çerez politikası gerektirmeyen ölçüm',
    ],
  },
  {
    slug: 'grafana',
    name: 'Grafana',
    description: 'Metrik, log ve iz için birleşik gözlemlenebilirlik panoları.',
    icon: 'grafana',
    category: 'Gözlemlenebilirlik',
    brandColor: '#F46800',
    features: [
      'Prometheus, Loki, Tempo, Elasticsearch veri kaynakları',
      'Alerting ve on-call entegrasyonları',
      'Dashboard paylaşımı ve versiyonlama',
      'Grafana Cloud ve self-host Grafana OSS',
      'Plugin ekosistemi',
    ],
    about:
      'Grafana Labs tarafından geliştirilen Grafana, zaman serisi ve log verilerini görsel panolarda birleştirir. SRE ve DevOps ekiplerinin altyapı sağlığını tek camdan izlemesini sağlar. Loki (log), Mimir (metrik) ve Tempo (trace) ile LGTM yığını oluşturulabilir.',
    useCases: [
      'Kubernetes küme ve pod metrikleri',
      'Uygulama SLA ve hata oranı panoları',
      'İş metriklerinin operasyon verisiyle birleştirilmesi',
    ],
  },
  {
    slug: 'prometheus',
    name: 'Prometheus',
    description: 'Zaman serisi metrik toplama ve PromQL sorgu motoru.',
    icon: 'prometheus',
    category: 'Gözlemlenebilirlik',
    brandColor: '#E6522C',
    features: [
      'Pull tabanlı scrape modeli',
      'PromQL ile sorgu ve aggregation',
      'Alertmanager ile uyarı yönlendirme',
      'Service discovery entegrasyonları',
      'CNCF mezuniyet projesi',
    ],
    about:
      'Prometheus, Cloud Native Computing Foundation bünyesindeki açık kaynak bir izleme sistemidir. Etiketli çok boyutlu veri modeli mikroservis ortamlarına uygundur. Genellikle Grafana ile görselleştirilir; uzun süreli depolama için Thanos veya Mimir kullanılır.',
    useCases: [
      'Mikroservis HTTP gecikme ve throughput izleme',
      'Node ve container exporter metrikleri',
      'SLO tabanlı uyarı kuralları',
    ],
  },
  {
    slug: 'directus',
    name: 'Directus',
    description: 'Herhangi bir SQL veritabanı üzerinde anında headless CMS ve API.',
    icon: 'directus',
    category: 'Yayın & CMS',
    brandColor: '#263238',
    features: [
      'Mevcut veya yeni SQL şemasına bağlanma',
      'No-code veri modeli ve ilişki yönetimi',
      'REST ve GraphQL otomatik API',
      'Dosya depolama adaptörleri',
      'Rol tabanlı erişim ve audit log',
    ],
    about:
      'Directus, veritabanınızı doğrudan içerik ve veri katmanına dönüştüren açık kaynak bir veri platformudur. Geliştiriciler şema üzerinde tam kontrolü korurken editörler dost arayüzle kayıt yönetir. Self-host ve Directus Cloud seçenekleri mevcuttur.',
    useCases: [
      'Headless e-ticaret katalog yönetimi',
      'Mobil uygulama içerik API\'si',
      'Legacy veritabanını modern API ile açma',
    ],
  },
  {
    slug: 'strapi',
    name: 'Strapi',
    description: 'Node.js tabanlı özelleştirilebilir headless CMS.',
    icon: 'strapi',
    category: 'Yayın & CMS',
    brandColor: '#4945FF',
    features: [
      'Content-Type Builder ile model tanımı',
      'REST ve GraphQL API',
      'Medya kütüphanesi ve CDN entegrasyonu',
      'Plugin marketplace',
      'Rol tabanlı erişim kontrolü',
    ],
    about:
      'Strapi, JavaScript geliştiriciler için tasarlanmış açık kaynak bir headless CMS\'dir. Ön yüzü React, Vue veya mobil uygulamalardan bağımsız tutarak içerik yönetimini API üzerinden sunar. Strapi Cloud veya kendi sunucunuzda çalıştırılabilir.',
    useCases: [
      'Kurumsal web sitesi içerik hub\'ı',
      'Çok dilli pazarlama sayfaları',
      'IoT veya mobil uygulama içerik senkronizasyonu',
    ],
  },
  {
    slug: 'keycloak',
    name: 'Keycloak',
    description: 'OpenID Connect ve SAML destekli kimlik ve erişim yönetimi.',
    icon: 'keycloak',
    category: 'Kimlik & Güvenlik',
    brandColor: '#4D4D4D',
    features: [
      'SSO, social login ve LDAP/AD federasyonu',
      'OAuth 2.0 ve OpenID Connect',
      'Kullanıcı federasyonu ve özel temalar',
      'Fine-grained authorization (authorization services)',
      'Red Hat tarafından desteklenen açık kaynak proje',
    ],
    about:
      'Keycloak, kurumsal uygulamalara merkezi kimlik doğrulama eklemek için kullanılan açık kaynak bir IAM çözümüdür. Realm, client ve rol kavramlarıyla çoklu uygulama tek oturum açma deneyimi sağlar. Quarkus tabanlı modern sürümler yüksek ölçeklenebilirlik hedefler.',
    useCases: [
      'Şirket içi uygulamalarda SSO',
      'B2B müşteri portalı kimlik yönetimi',
      'Mikroservislerde JWT tabanlı yetkilendirme',
    ],
  },
  {
    slug: 'vaultwarden',
    name: 'Vaultwarden',
    description: 'Bitwarden sunucu API\'si ile uyumlu hafif parola kasası.',
    icon: 'vaultwarden',
    category: 'Kimlik & Güvenlik',
    brandColor: '#000000',
    features: [
      'Bitwarden istemcileri ile tam uyumluluk',
      'Rust ile düşük kaynak tüketimi',
      'Organizasyon, koleksiyon ve paylaşım',
      '2FA ve WebAuthn desteği (istemci üzerinden)',
      'SQLite, MySQL veya PostgreSQL backend',
    ],
    about:
      'Vaultwarden (eski adıyla bitwarden_rs), resmi Bitwarden sunucusunun alternatifi olarak geliştirilen açık kaynak bir uygulamadır. Kişisel veya küçük ekip parola yönetimini kendi altyapınızda barındırmanızı sağlar; resmi Bitwarden mobil ve tarayıcı eklentileriyle çalışır.',
    useCases: [
      'Aile ve küçük ekip parola paylaşımı',
      'Self-host gizlilik odaklı kasa',
      'Düşük RAM\'li VPS\'te kurumsal kasa',
    ],
  },
  {
    slug: 'gitea',
    name: 'Gitea',
    description: 'Hafif, self-host Git barındırma ve birleşik kod platformu.',
    icon: 'gitea',
    category: 'Kaynak Kodu & DevOps',
    brandColor: '#609926',
    features: [
      'Git repository, pull request ve code review',
      'Issues, projeler ve wiki',
      'Actions ile CI (Gitea Actions)',
      'LDAP ve OAuth ile kimlik',
      'Düşük sistem gereksinimleri',
    ],
    about:
      'Gitea, Go ile yazılmış açık kaynak bir Git servisidir; GitHub/GitLab\'a hafif bir self-host alternatifi sunar. Tek ikili veya Docker ile kurulur; binlerce repository barındırmak için tasarlanmıştır. Gitea Ltd. topluluk ve ticari destek sağlar.',
    useCases: [
      'Şirket içi kaynak kod barındırma',
      'Açık kaynak proje forge\'u',
      'Air-gapped ortamda sürüm kontrolü',
    ],
  },
  {
    slug: 'gitlab',
    name: 'GitLab',
    description: 'Git, CI/CD, güvenlik ve DevSecOps tek platformda.',
    icon: 'gitlab',
    category: 'Kaynak Kodu & DevOps',
    brandColor: '#FC6D26',
    features: [
      'Git repository ve merge request akışı',
      'GitLab CI/CD pipeline tanımları',
      'Container Registry ve Package Registry',
      'SAST/DAST ve dependency scanning',
      'Self-managed ve GitLab.com SaaS',
    ],
    about:
      'GitLab, yazılım yaşam döngüsünü tek uygulamada toplayan DevOps platformudur. Planlama, kaynak kodu, test, dağıtım ve izleme adımları entegre edilir. Community Edition açık kaynak; Enterprise sürümünde gelişmiş güvenlik ve uyumluluk özellikleri bulunur.',
    useCases: [
      'Tam pipeline ile sürekli teslimat',
      'Regüle sektörlerde on-prem DevOps',
      'Monorepo ve çoklu proje yönetimi',
    ],
  },
  {
    slug: 'portainer',
    name: 'Portainer',
    description: 'Docker, Swarm ve Kubernetes için görsel konteyner yönetimi.',
    icon: 'portainer',
    category: 'Konteyner & Ağ',
    brandColor: '#13BEF9',
    features: [
      'Container, image, volume ve network yönetimi',
      'Stack ve compose dağıtımı',
      'Kubernetes cluster bağlantısı',
      'RBAC ve activity log',
      'Edge agent ile uzak cihaz yönetimi',
    ],
    about:
      'Portainer, konteyner ortamlarını tek web arayüzünden yönetmeyi kolaylaştıran bir platformdur. Community Edition açık kaynak olup homelab\'dan kurumsal edge senaryolarına kadar kullanılır. CLI yerine görsel işlemlerle operasyon hatalarını azaltmayı hedefler.',
    useCases: [
      'Homelab Docker sunucu yönetimi',
      'Ekip içi self-servis konteyner dağıtımı',
      'Çoklu Kubernetes cluster görünürlüğü',
    ],
  },
  {
    slug: 'traefik',
    name: 'Traefik',
    description: 'Bulut native dinamik reverse proxy ve yük dengeleyici.',
    icon: 'traefikproxy',
    category: 'Konteyner & Ağ',
    brandColor: '#24A1C1',
    features: [
      'Docker, Kubernetes ve Consul service discovery',
      'Otomatik Let\'s Encrypt TLS',
      'HTTP, TCP ve UDP routing',
      'Middleware: rate limit, auth, compress',
      'Observability: metrics, tracing, access log',
    ],
    about:
      'Traefik Proxy, mikroservis ve konteyner ortamları için tasarlanmış modern bir edge yönlendiricisidir. Etiket veya CRD ile yapılandırma güncellenir; statik nginx config dosyalarına kıyasla dinamik keşif sunar. Traefik Labs ayrıca API gateway ve mesh ürünleri geliştirir.',
    useCases: [
      'Docker Compose ile çoklu servis SSL terminasyonu',
      'Kubernetes Ingress controller',
      'Blue-green ve canary trafik bölme',
    ],
  },
  {
    slug: 'nginx-proxy-manager',
    name: 'Nginx Proxy Manager',
    description: 'Nginx reverse proxy ve SSL için web tabanlı yönetim arayüzü.',
    icon: 'nginxproxymanager',
    category: 'Konteyner & Ağ',
    brandColor: '#F15833',
    features: [
      'Host bazlı proxy host tanımları',
      'Let\'s Encrypt sertifika otomasyonu',
      'Access list ve temel HTTP auth',
      'Stream (TCP/UDP) proxy desteği',
      'Docker ile kolay kurulum',
    ],
    about:
      'Nginx Proxy Manager, Nginx\'i teknik olmayan kullanıcılar için sadeleştiren açık kaynak bir yönetim katmanıdır. Ev lab ve küçük sunucularda çoklu web uygulamasını tek IP üzerinden yönlendirmek için yaygın kullanılır. Arka planda OpenResty/Nginx çalışır.',
    useCases: [
      'Ev sunucusunda çoklu subdomain yönlendirme',
      'Internal servislere güvenli dış erişim',
      'Hızlı SSL sertifika yenileme',
    ],
  },
  {
    slug: 'uptime-kuma',
    name: 'Uptime Kuma',
    description: 'Self-host uptime, ping ve SSL süresi izleme.',
    icon: 'uptimekuma',
    category: 'İzleme & Güvenilirlik',
    brandColor: '#5CDD8B',
    features: [
      'HTTP(s), TCP, ping, DNS ve daha fazla monitor tipi',
      'Durum sayfası (status page) oluşturma',
      'Telegram, Slack, e-posta bildirimleri',
      'Docker tabanlı basit kurulum',
      'Çoklu kullanıcı ve 2FA',
    ],
    about:
      'Uptime Kuma, Louis Lam tarafından geliştirilen açık kaynak bir izleme aracıdır. Pingdom ve UptimeRobot benzeri deneyimi kendi sunucunuzda sunar. Modern arayüzü ve geniş bildirim kanalı desteği ile homelab ve KOBİ\'lerde popülerdir.',
    useCases: [
      'Web sitesi ve API erişilebilirlik kontrolü',
      'Müşteriye açık durum sayfası',
      'Ev otomasyonu ve NAS servis izleme',
    ],
  },
  {
    slug: 'sentry',
    name: 'Sentry',
    description: 'Uygulama hata takibi, performans ve session replay.',
    icon: 'sentry',
    category: 'Gözlemlenebilirlik',
    brandColor: '#362D59',
    features: [
      'Exception grouping ve stack trace zenginleştirme',
      'Performance monitoring (transaction tracing)',
      'Release health ve deploy takibi',
      'Çoklu dil SDK (JS, Python, Java, mobile)',
      'Self-host ve Sentry SaaS',
    ],
    about:
      'Sentry, yazılım ekiplerinin production hatalarını gerçek zamanlı yakalamasını sağlayan bir uygulama izleme platformudur. Kaynak haritası ile minified JavaScript hataları okunabilir hale gelir. Açık kaynak self-host sürümü ve bulut hizmeti birlikte sunulur.',
    useCases: [
      'Frontend ve backend exception alerting',
      'Mobil uygulama crash raporlama',
      'Deploy sonrası regresyon tespiti',
    ],
  },
  {
    slug: 'posthog',
    name: 'PostHog',
    description: 'Ürün analitiği, feature flag, A/B test ve session replay.',
    icon: 'posthog',
    category: 'Analitik & Ürün',
    brandColor: '#000000',
    features: [
      'Olay tabanlı product analytics',
      'Feature flags ve multivariate testler',
      'Session recording ve heatmap',
      'Data warehouse sync',
      'Açık kaynak self-host ve PostHog Cloud',
    ],
    about:
      'PostHog, mühendis odaklı ekipler için birleşik bir ürün işletim sistemidir. Amplitude ve LaunchDarkly benzeri yetenekleri tek platformda toplar. ClickHouse tabanlı analitik motoru yüksek hacimli olayları işleyebilir.',
    useCases: [
      'Feature rollout ve kill switch',
      'Dönüşüm hunisi ve retention analizi',
      'Self-host product analytics (GDPR)',
    ],
  },
  {
    slug: 'cal-com',
    name: 'Cal.com',
    description: 'Açık kaynak randevu planlama ve toplantı altyapısı.',
    icon: 'caldotcom',
    category: 'İletişim & Destek',
    brandColor: '#292929',
    features: [
      'Takvim entegrasyonları (Google, Outlook, CalDAV)',
      'Özelleştirilebilir booking linkleri',
      'Ekip round-robin ve kolektif etkinlikler',
      'Ödeme (Stripe) ve workflow otomasyonu',
      'API ve embed widget',
    ],
    about:
      'Cal.com (eski Calendso), Calendly\'nin açık kaynak alternatifidir. Toplantı slotlarını paylaşarak planlama sürtünmesini azaltır. Self-host veya Cal.com bulut hizmeti ile kullanılabilir; white-label kurumsal planlar mevcuttur.',
    useCases: [
      'Satış demo ve keşif görüşmesi randevuları',
      'Destek ve danışmanlık slot yönetimi',
      'Web sitesine gömülü rezervasyon formu',
    ],
  },
  {
    slug: 'outline',
    name: 'Outline',
    description: 'Ekip wiki, bilgi tabanı ve gerçek zamanlı dokümanlar.',
    icon: 'outline',
    category: 'Yayın & CMS',
    brandColor: '#000000',
    features: [
      'Markdown tabanlı zengin doküman editörü',
      'Koleksiyon, izin ve paylaşım linkleri',
      'Slack ve Google ile SSO',
      'Tam metin arama',
      'Self-host ve Outline Cloud',
    ],
    about:
      'Outline, ekiplerin iç bilgisini düzenlemek için tasarlanmış açık kaynak bir wiki uygulamasıdır. Notion benzeri deneyimi kurumsal SSO ve self-host ile birleştirir. Node.js backend ve React arayüzü kullanır.',
    useCases: [
      'Mühendislik runbook ve SOP dokümantasyonu',
      'Onboarding bilgi merkezi',
      'Proje wiki ve karar kayıtları',
    ],
  },
  {
    slug: 'notion',
    name: 'Notion',
    description: 'Blok tabanlı notlar, wiki, veritabanı ve proje yönetimi.',
    icon: 'notion',
    category: 'Yayın & CMS',
    brandColor: '#000000',
    features: [
      'Blok editörü: metin, tablo, kanban, takvim',
      'İlişkili veritabanları ve formüller',
      'Şablon galerisi',
      'API ve entegrasyonlar',
      'Ekip workspace ve granular izinler',
    ],
    about:
      'Notion, all-in-one çalışma alanı olarak doküman, görev ve veritabanını tek arayüzde birleştirir. Bulut hizmeti olarak sunulur; API ile üçüncü taraf otomasyon mümkündür. Startup\'lardan kurumsal ekiplere kadar geniş kullanıcı tabanı vardır.',
    useCases: [
      'Ürün roadmap ve sprint panosu',
      'CRM hafif müşteri takibi',
      'Kişisel bilgi yönetimi (PKM)',
    ],
  },
  {
    slug: 'chatwoot',
    name: 'Chatwoot',
    description: 'Omnichannel müşteri destek ve canlı sohbet platformu.',
    icon: 'chatwoot',
    category: 'İletişim & Destek',
    brandColor: '#1F93FF',
    features: [
      'Web widget, e-posta, WhatsApp, Facebook kanalları',
      'Agent inbox, atama ve etiketler',
      'Canned responses ve makrolar',
      'Captain AI ile yardımcı yanıtlar',
      'Self-host ve Chatwoot Cloud',
    ],
    about:
      'Chatwoot, açık kaynak bir müşteri engagement suite\'idir; Intercom ve Zendesk\'e alternatif olarak konumlanır. Ruby on Rails ile geliştirilir. Çok kanallı konuşmaları tek panelde toplar ve CRM entegrasyonlarına açıktır.',
    useCases: [
      'E-ticaret canlı destek',
      'SaaS uygulama içi chat',
      'WhatsApp Business destek hattı',
    ],
  },
  {
    slug: 'mattermost',
    name: 'Mattermost',
    description: 'Self-host ekip mesajlaşması ve iş birliği.',
    icon: 'mattermost',
    category: 'İletişim & Destek',
    brandColor: '#0058CC',
    features: [
      'Kanallar, thread ve DM',
      'Dosya paylaşımı ve arama',
      'Plugin ve webhook entegrasyonları',
      'LDAP, SAML ve compliance export',
      'Mattermost Calls (ses/görüntü)',
    ],
    about:
      'Mattermost, güvenlik ve veri residency odaklı kurumlar için açık kaynak bir Slack alternatifidir. Go backend ile yüksek eşzamanlı kullanıcıya ölçeklenir. DevOps ekipleri CI bildirimleri ve runbook otomasyonu için sık kullanır.',
    useCases: [
      'Regüle sektörde on-prem chat',
      'DevOps alert kanalları',
      'Mühendislik ve proje iletişimi',
    ],
  },
  {
    slug: 'rocketchat',
    name: 'Rocket.Chat',
    description: 'Omnichannel takım sohbeti ve müşteri iletişim merkezi.',
    icon: 'rocketchat',
    category: 'İletişim & Destek',
    brandColor: '#F5455C',
    features: [
      'Kanallar, thread, ses ve video konferans',
      'Livechat widget ve WhatsApp köprüsü',
      'Bot framework ve App Marketplace',
      'Federation ve air-gapped dağıtım',
      'Enterprise: omnichannel ve audit',
    ],
    about:
      'Rocket.Chat, Brezilya kökenli açık kaynak bir iletişim platformudur. İç ekip mesajlaşması ile müşteri canlı sohbetini aynı üründe birleştirebilir. Kubernetes ve Docker ile cluster kurulumu desteklenir.',
    useCases: [
      'Call center omnichannel inbox',
      'Şirket içi güvenli mesajlaşma',
      'Topluluk forumu ve destek birleşimi',
    ],
  },
  {
    slug: 'mailcow',
    name: 'Mailcow',
    description: 'Docker ile tam özellikli self-host e-posta sunucusu paketi.',
    icon: 'mailcow',
    category: 'E-posta & Pazarlama',
    brandColor: '#D01C3B',
    features: [
      'Postfix, Dovecot, SOGo groupware',
      'Rspamd spam filtreleme ve ClamAV antivirüs',
      'Web admin paneli ve API',
      'DKIM, DMARC ve Let\'s Encrypt desteği',
      'Kolay yedekleme ve domain alias',
    ],
    about:
      'Mailcow, dockerized mail server olarak bilinen açık kaynak bir e-posta yığınıdır. Tek komutla kurulan bileşenler kurumsal posta kutusu, takvim ve adres defteri sunar. Kendi domain\'inizde tam posta kontrolü isteyen KOBİ\'ler tarafından tercih edilir.',
    useCases: [
      'Şirket @domain.com posta kutuları',
      'Gizlilik odaklı kişisel e-posta barındırma',
      'Test ortamı SMTP/IMAP sunucusu',
    ],
  },
  {
    slug: 'listmonk',
    name: 'Listmonk',
    description: 'Yüksek hacimli bülten ve transactional e-posta yönetimi.',
    icon: 'listmonk',
    category: 'E-posta & Pazarlama',
    brandColor: '#0055D4',
    features: [
      'Abone listeleri ve segmentasyon',
      'HTML ve Markdown kampanya şablonları',
      'SMTP relay ve bounce yönetimi',
      'REST API ile programmatic gönderim',
      'Go + PostgreSQL ile performans',
    ],
    about:
      'Listmonk, tek geliştirici topluluğu tarafından sürdürülen açık kaynak bir e-posta listesi yöneticisidir. Mailchimp benzeri pazarlama e-postalarını kendi SMTP altyapınız üzerinden göndermenizi sağlar; abone verisi sizde kalır.',
    useCases: [
      'Ürün güncelleme bültenleri',
      'Topluluk duyuru listeleri',
      'Transactional şablon test ortamı',
    ],
  },
  {
    slug: 'typesense',
    name: 'Typesense',
    description: 'Typo toleranslı, kolay operasyonlu arama motoru.',
    icon: 'typesense',
    category: 'Arama',
    brandColor: '#1035F5',
    features: [
      'Milisaniye altı arama gecikmesi',
      'Faceting, filtering ve sorting',
      'Geo search ve vector arama',
      'Rafts tabanlı yüksek erişilebilirlik kümesi',
      'Typesense Cloud ve self-host',
    ],
    about:
      'Typesense, C++ ile yazılmış açık kaynak bir arama ve vektör veritabanıdır. Algolia benzeri geliştirici deneyimi sunarken self-host seçeneği verir. Basit REST API ve resmi SDK\'lar ile hızlı entegrasyon hedeflenir.',
    useCases: [
      'Marketplace ürün arama',
      'Dokümantasyon instant search',
      'Semantik benzer içerik önerisi (vector)',
    ],
  },
  {
    slug: 'elasticsearch',
    name: 'Elasticsearch',
    description: 'Dağıtık arama, analitik ve log indeksleme motoru.',
    icon: 'elasticsearch',
    category: 'Arama',
    brandColor: '#005571',
    features: [
      'Inverted index ve full-text sorgular',
      'Aggregations ile analitik',
      'Elastic Stack: Kibana, Logstash, Beats',
      'Cluster sharding ve replikasyon',
      'Elastic Cloud ve self-managed',
    ],
    about:
      'Elasticsearch, Apache Lucene tabanlı dağıtık bir arama ve analitik motorudur. Log analytics (ELK), site search ve güvenlik SIEM senaryolarında endüstri standardıdır. Elastic NV ticari lisans ve açık kaynak bileşenleri birlikte yönetir.',
    useCases: [
      'Merkezi uygulama log arama',
      'E-ticaret katalog indeksleme',
      'Güvenlik olay korelasyonu',
    ],
  },
  {
    slug: 'mongodb',
    name: 'MongoDB',
    description: 'Esnek şema ile doküman odaklı NoSQL veritabanı.',
    icon: 'mongodb',
    category: 'Depolama & Veritabanı',
    brandColor: '#47A248',
    features: [
      'BSON doküman modeli',
      'Aggregation pipeline',
      'Replica set ve sharded cluster',
      'Atlas yönetilen bulut ve Community Edition',
      'Change streams ve transaction desteği',
    ],
    about:
      'MongoDB, JSON benzeri dokümanları doğrudan saklayan popüler bir NoSQL veritabanıdır. Hızlı iterasyon gerektiren uygulamalarda esnek şema avantajı sağlar. Sürücüler çoğu programlama dili için mevcuttur.',
    useCases: [
      'İçerik yönetimi ve katalog verisi',
      'IoT telemetri ve time-series benzeri yükler',
      'Mobil backend sync verisi',
    ],
  },
  {
    slug: 'mysql',
    name: 'MySQL',
    description: 'Yaygın açık kaynak ilişkisel veritabanı sunucusu.',
    icon: 'mysql',
    category: 'Depolama & Veritabanı',
    brandColor: '#4479A1',
    features: [
      'InnoDB ACID transaction',
      'Replikasyon ve Group Replication',
      'JSON sütun tipi',
      'MySQL 8 window functions ve CTE',
      'Oracle tarafından geliştirilen topluluk sürümü',
    ],
    about:
      'MySQL, web uygulamalarının uzun yıllardır kullandığı açık kaynak RDBMS\'dir. WordPress, Drupal ve birçok SaaS ürününün varsayılan veritabanıdır. MariaDB ile fork ilişkisi tarihsel olarak önemlidir.',
    useCases: [
      'LAMP/LEMP web uygulamaları',
      'Okuma ağırlıklı raporlama replikası',
      'Geleneksel OLTP iş yükleri',
    ],
  },
  {
    slug: 'clickhouse',
    name: 'ClickHouse',
    description: 'Sütun bazlı OLAP analitik veritabanı.',
    icon: 'clickhouse',
    category: 'Depolama & Veritabanı',
    brandColor: '#FFCC01',
    features: [
      'Sütunar depolama ve vektörleştirilmiş sorgular',
      'Gerçek zamanlı veri ingest',
      'Materialized view ve projection',
      'Replikasyon ve sharding',
      'SQL arayüzü ve geniş format desteği',
    ],
    about:
      'ClickHouse, Yandex kökenli açık kaynak bir analitik DBMS\'dir. Petabyte ölçeğinde olay ve log verisini saniyeler içinde sorgulayabilir. PostHog, Plausible self-host ve birçok observability ürününün arka planında kullanılır.',
    useCases: [
      'Web analitik olay depolama',
      'Finans ve IoT zaman serisi analizi',
      'Log ve trace uzun süreli arşiv',
    ],
  },
  {
    slug: 'rabbitmq',
    name: 'RabbitMQ',
    description: 'AMQP protokollü güvenilir mesaj aracısı.',
    icon: 'rabbitmq',
    category: 'Mesaj Kuyruğu & Akış',
    brandColor: '#FF6600',
    features: [
      'Queue, exchange ve routing key modeli',
      'Publisher confirm ve consumer ack',
      'Dead letter ve delayed message',
      'Management UI ve Prometheus metrikleri',
      'Stream ve quorum queue tipleri',
    ],
    about:
      'RabbitMQ, VMware/Broadcom ekosisteminde gelişen açık kaynak bir message broker\'dır. İş yüklerini asenkron hale getirerek mikroservisler arası gevşek bağlılık sağlar. Erlang OTP üzerinde yüksek erişilebilirlik cluster\'ları kurulabilir.',
    useCases: [
      'E-posta ve bildirim kuyruğu',
      'Sipariş işleme arka plan görevleri',
      'Event-driven mikroservis entegrasyonu',
    ],
  },
  {
    slug: 'kafka',
    name: 'Kafka',
    description: 'Dağıtık commit log ve yüksek throughput olay akışı.',
    icon: 'apachekafka',
    category: 'Mesaj Kuyruğu & Akış',
    brandColor: '#231F20',
    features: [
      'Topic partition ve consumer group',
      'Dayanıklı disk üzerinde log saklama',
      'Kafka Connect ile entegrasyon',
      'Kafka Streams ile stream processing',
      'Apache Software Foundation projesi',
    ],
    about:
      'Apache Kafka, LinkedIn kökenli dağıtık bir event streaming platformudur. Gerçek zamanlı pipeline, activity tracking ve log aggregation için tasarlanmıştır. Confluent ve diğer vendor\'lar yönetilen hizmetler sunar.',
    useCases: [
      'Mikroservisler arası olay bus',
      'Clickstream ve kullanıcı aktivite akışı',
      'CDC (change data capture) pipeline',
    ],
  },
  {
    slug: 'ollama',
    name: 'Ollama',
    description: 'Yerel makinede büyük dil modellerini çalıştırma aracı.',
    icon: 'ollama',
    category: 'Yapay Zeka',
    brandColor: '#000000',
    features: [
      'Llama, Mistral, Gemma vb. model çekme ve çalıştırma',
      'REST API ile chat ve generate',
      'Modelfile ile özelleştirme',
      'macOS, Linux ve Windows desteği',
      'GPU hızlandırma (CUDA, Metal)',
    ],
    about:
      'Ollama, geliştiricilerin LLM\'leri tek komutla indirip yerel olarak çalıştırmasını sağlayan açık kaynak bir araçtır. Docker benzeri basit CLI deneyimi sunar. Verinin cihazdan çıkmadan AI denemeleri yapılmasına olanak tanır.',
    useCases: [
      'Offline kod asistanı ve chatbot',
      'Geliştirme ortamında prompt testi',
      'Gizli veri ile yerel RAG prototipi',
    ],
  },
  {
    slug: 'openwebui',
    name: 'OpenWebUI',
    description: 'Ollama ve OpenAI uyumlu modeller için ChatGPT benzeri arayüz.',
    icon: 'openwebui',
    category: 'Yapay Zeka',
    brandColor: '#000000',
    features: [
      'Çoklu model ve sağlayıcı desteği',
      'RAG: doküman yükleme ve vektör arama',
      'Kullanıcı rolleri ve paylaşımlı sohbetler',
      'Python function calling ve araç entegrasyonu',
      'Docker ile self-host',
    ],
    about:
      'Open WebUI (OpenWebUI), yerel ve uzak LLM backend\'lerine tek web arayüzünden erişim sağlayan açık kaynak bir projedir. Ollama ile sık eşleştirilir; kurumsal ekiplerin internal AI portalı olarak dağıtılır.',
    useCases: [
      'Şirket içi ChatGPT alternatifi',
      'PDF ve wiki üzerinde RAG sohbet',
      'Model karşılaştırma ve prompt kütüphanesi',
    ],
  },
  {
    slug: 'langfuse',
    name: 'Langfuse',
    description: 'LLM uygulamaları için gözlemlenebilirlik ve değerlendirme.',
    icon: 'langfuse',
    category: 'Yapay Zeka',
    brandColor: '#000000',
    features: [
      'Trace, span ve generation loglama',
      'Prompt versiyonlama ve playground',
      'Kullanıcı geri bildirimi ve skorlama',
      'Dataset ile eval ve regression test',
      'Self-host ve Langfuse Cloud',
    ],
    about:
      'Langfuse, Almanya merkezli açık kaynak bir LLM engineering platformudur. Production\'daki zincirleme çağrıları, token maliyetini ve gecikmeyi görünür kılar. LangChain, OpenAI SDK ve diğer framework\'lerle entegre olur.',
    useCases: [
      'Chatbot kalite izleme',
      'Prompt A/B test ve versiyon yönetimi',
      'Maliyet ve latency dashboard',
    ],
  },
  {
    slug: 'flowise',
    name: 'Flowise',
    description: 'Görsel sürükle-bırak LLM agent ve RAG pipeline oluşturucu.',
    icon: 'flowise',
    category: 'Yapay Zeka',
    brandColor: '#7C3AED',
    features: [
      'LangChain tabanlı node editörü',
      'Vector store ve retriever bağlantıları',
      'Agent, tool ve memory yapılandırması',
      'REST API ile chatflow deploy',
      'Self-host ve Flowise Cloud',
    ],
    about:
      'FlowiseAI, kod yazmadan LLM iş akışları tasarlamak için açık kaynak bir low-code aracıdır. LangChain bileşenlerini görselleştirir; hızlı POC ve internal otomasyon için kullanılır.',
    useCases: [
      'Müşteri destek RAG botu',
      'Doküman Q&A internal aracı',
      'Çok adımlı agent prototipi',
    ],
  },
  {
    slug: 'coolify',
    name: 'Coolify',
    description: 'Self-host PaaS: Heroku/Vercel alternatifi dağıtım paneli.',
    icon: 'coolify',
    category: 'Platform & Dağıtım',
    brandColor: '#6B16ED',
    features: [
      'Git push ile otomatik deploy',
      'Docker Compose ve Dockerfile desteği',
      'Let\'s Encrypt, wildcard domain',
      'Sunucu ve multi-server yönetimi',
      'Veritabanı ve servis one-click kurulum',
    ],
    about:
      'Coolify, Andras Bacsai tarafından geliştirilen açık kaynak bir deployment platformudur. Kendi VPS veya bare-metal sunucunuzda uygulama barındırmayı Heroku deneyimine yaklaştırır. DigitalOcean, Hetzner ve diğer sağlayıcılarda yaygın kullanılır.',
    useCases: [
      'Freelancer müşteri projelerini tek panelden host etme',
      'Startup MVP production deploy',
      'Self-host SaaS altyapısı',
    ],
  },
  {
    slug: 'dokku',
    name: 'Dokku',
    description: 'Tek sunucuda git-push ile PaaS deneyimi (mini-Heroku).',
    icon: 'dokku',
    category: 'Platform & Dağıtım',
    brandColor: '#D95656',
    features: [
      'Heroku buildpack uyumluluğu',
      'Plugin ile Postgres, Redis, Letsencrypt',
      'Zero-downtime deploy (dokku ps)',
      'Docker scheduler alternatifi',
      'Açık kaynak, tek bash/Go bileşenleri',
    ],
    about:
      'Dokku, Jeff Croft tarafından başlatılan açık kaynak bir mini PaaS\'tır. `git push dokku main` ile uygulama build ve release edilir. Küçük VPS\'lerde düşük maliyetli production ortamı kurmak isteyen geliştiriciler için klasik çözümdür.',
    useCases: [
      'Side project production hosting',
      'Staging ortamı hızlı klonlama',
      'Buildpack tabanlı legacy uygulama deploy',
    ],
  },
  {
    slug: 'pocketbase',
    name: 'PocketBase',
    description: 'Tek ikili dosyada gömülü veritabanı ve gerçek zamanlı API.',
    icon: 'pocketbase',
    category: 'Backend & BaaS',
    brandColor: '#B8DBE4',
    features: [
      'SQLite tabanlı embedded DB',
      'Auth, OAuth2 ve admin kullanıcı yönetimi',
      'Realtime subscriptions (SSE)',
      'Dosya storage ve thumb generation',
      'Go ile tek binary dağıtım',
    ],
    about:
      'PocketBase, Gani Georgiev tarafından geliştirilen açık kaynak bir backend\'dir. Firebase benzeri özellikleri minimal footprint ile sunar; prototip ve küçük üretim uygulamaları için idealdir. Admin UI dahili gelir.',
    useCases: [
      'Mobil uygulama hızlı backend',
      'Internal tool ve form uygulamaları',
      'Offline-first sync prototipi',
    ],
  },
  {
    slug: 'hasura',
    name: 'Hasura',
    description: 'PostgreSQL (ve diğer DB) üzerinde anında GraphQL API.',
    icon: 'hasura',
    category: 'Backend & BaaS',
    brandColor: '#1EB4D4',
    features: [
      'Schema introspection ile otomatik GraphQL',
      'Satır düzeyinde güvenlik (RLS benzeri)',
      'Remote schema ve action ile özel mantık',
      'Event trigger ve scheduled trigger',
      'Hasura Cloud ve self-host engine',
    ],
    about:
      'Hasura GraphQL Engine, mevcut veritabanını saniyeler içinde GraphQL endpoint\'ine dönüştürür. Real-time subscription ve birleşik veri grafı sorguları sunar. Startup\'lardan kurumsal ekiplere kadar API katmanını hızlandırır.',
    useCases: [
      'Mobil ve web frontend için tek GraphQL gateway',
      'Legacy SQL verisini modern API ile açma',
      'Real-time dashboard ve bildirim feed\'i',
    ],
  },
  {
    slug: 'hoppscotch',
    name: 'Hoppscotch',
    description: 'Tarayıcı ve self-host açık kaynak API geliştirme istemcisi.',
    icon: 'hoppscotch',
    category: 'Geliştirme Araçları',
    brandColor: '#09090B',
    features: [
      'REST, GraphQL ve WebSocket istekleri',
      'Koleksiyon, ortam değişkenleri ve paylaşım',
      'Mock sunucu ve interceptor',
      'CLI ve CI entegrasyonu (Hoppscotch CLI)',
      'Self-host community edition',
    ],
    about:
      'Hoppscotch (eski adı Postwoman), Postman\'a açık kaynak alternatif olarak gelişmiştir. Verilerin tarayıcıda kalması ve self-host seçeneği gizlilik odaklı ekiplere hitap eder. Hafif arayüzü ile hızlı API testi sağlar.',
    useCases: [
      'Backend API geliştirme ve debug',
      'Ekip koleksiyon paylaşımı (self-host)',
      'GraphQL sorgu deneme',
    ],
  },
];

export type ServiceDealMeta = {
  price: number;
  originalPrice: number;
  reviews: number;
};

/** Vitrin meta — deterministik mock fiyat/rating */
export function getServiceDealMeta(slug: string, _index = 0): ServiceDealMeta {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  const priceOptions = [39, 49, 59, 69, 79, 89, 99];
  const price = priceOptions[hash % priceOptions.length];
  const originalPrice = Math.round(price * (2.2 + (hash % 7) * 0.45));
  const reviews = (hash % 180) + 2;
  return {
    price,
    originalPrice,
    reviews,
  };
}

export function getFeaturedServices(limit = 12): ServiceCatalogEntry[] {
  return SERVICES.slice(0, limit);
}

export function getServiceBySlug(slug: string): ServiceCatalogEntry | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return SERVICES.map((service) => service.slug);
}
