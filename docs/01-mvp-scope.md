# MVP Kapsamı

> **Hedef:** BlackNOOK’u canlıya alıp gerçek kullanıcıların gezebileceği, kayıt olup kurulum talebi gönderebileceği minimum ürün.

---

## MVP’de olacak

### Kullanıcı deneyimi

- [x] Ana sayfa — hero, servis grid, marka deneyimi
- [x] `/services` — kategori / menü filtreli servis listesi
- [x] `/service/[slug]` — servis detay, fiyat tablosu (deterministik mock fiyat)
- [x] `/login`, `/register` — gerçek auth akışı
- [x] Navbar — oturum durumuna göre giriş / çıkış
- [x] Kurulum talebi modalı — giriş zorunlu, SMTP ile e-posta

### Backend

- [x] NextAuth (credentials + opsiyonel Google/GitHub)
- [x] `POST /api/auth/register`
- [x] `POST /api/installation-request`
- [x] PostgreSQL `users` tablosu

### Altyapı

- [ ] Production PostgreSQL (managed veya VPS)
- [ ] `NEXTAUTH_URL` production domain
- [ ] SMTP yapılandırması
- [ ] `next build` + deploy (Vercel, VPS, vb.)

---

## MVP’de bilinçli olarak mock / statik kalan

Bunlar canlıda **görünür** ama gerçek veri/backend kullanmaz. MVP sonrası backlog’a alınır.

| Özellik | Davranış | Sonraki adım |
|---|---|---|
| Servis kataloğu | `lib/data.ts` statik 51 servis | DB’ye taşı veya CMS |
| Fiyat / review / “Ends in” | Slug hash ile üretilir | Gerçek tier + ödeme |
| Hero e-posta toplama | UI-only success | Waitlist API + DB |
| Geliştirici eşleştirme modalı | Animasyonlu demo | RFQ + eşleştirme motoru |
| Presence dock / aktif geliştirici | Mock sayılar | Gerçek presence veya kaldır |
| Şifre sıfırlama linki | Sayfa yok | E-posta reset flow |

---

## MVP dışında (Faz 2+)

Aşağıdakiler **canlı MVP’ye dahil değildir**; uzun vadeli platform vizyonu:

- GitHub App + repo bağlama
- Docker / Coolify otomatik deployment
- Canlı demo subdomain (`*.apps.blacknook.com`)
- Marketplace ürün CRUD (`products`, `product_tiers`)
- Admin onay paneli
- Sipariş, ödeme (iyzico), komisyon
- Mesajlaşma / ChatModal
- MVP Pasaportu, tersine pazar, pilot modül
- Escrow / proje devri

Detay: [platform gereksinimleri](https://mdshare.huseyinalav.com/01_platform_isleyisi_ve_gereksinimler-618f4b)

---

## Başarı kriterleri (canlı MVP)

1. Yeni kullanıcı kayıt olup giriş yapabiliyor
2. Giriş yapmış kullanıcı kurulum talebi gönderebiliyor ve e-posta ulaşıyor
3. Tüm public sayfalar production’da hatasız yükleniyor
4. OAuth (varsa env dolu) çalışıyor
5. DB bağlantı hatası olmadan auth işlemleri tamamlanıyor
