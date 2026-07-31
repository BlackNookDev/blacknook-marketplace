# Öncelik Backlog

---

## P0 — Canlı MVP blocker (hemen)

| # | Görev | Durum | Dosyalar |
|---|---|---|---|
| P0-1 | Login → `signIn('credentials')` | ✅ | `app/login/LoginForm.tsx` |
| P0-2 | Register → `POST /api/auth/register` + otomatik giriş | ✅ | `app/register/RegisterEarlyAccessForm.tsx` |
| P0-3 | OAuth butonları → `signIn('google'/'github')` | ✅ | Login + Register formları |
| P0-4 | Navbar session UI (çıkış) | ✅ | `src/components/Navbar.tsx` |
| P0-5 | Production env dokümantasyonu | ✅ | `docs/06-environment-setup.md` |
| P0-6 | Go-live checklist | ✅ | `docs/05-go-live-checklist.md` |
| P0-7 | DB migration (`users` tablosu) | ⬜ | `schema.sql` veya sadece users |
| P0-8 | Production deploy + smoke test | ⬜ | — |

---

## P1 — Canlı sonrası ilk hafta

| # | Görev | Açıklama |
|---|---|---|
| P1-1 | Hero mail → waitlist API | E-postaları DB’ye kaydet |
| P1-2 | Basit profil sayfası | Ad, e-posta, çıkış |
| P1-3 | Kurulum taleplerini DB’ye logla | `installation_requests` tablosu |
| P1-4 | Hata / boş SMTP mesajları UX | Kullanıcıya net feedback |
| P1-5 | `middleware.ts` | Opsiyonel route koruması |
| P1-6 | README root | Proje kurulum özeti |
| P1-7 | Kullanılmayan bileşenleri temizle | WelcomePopup, HeroPremium, vb. |

---

## P2 — Marketplace Faz 1 (spec)

| # | Görev |
|---|---|
| P2-1 | `products` API + vendor form |
| P2-2 | Admin onay paneli |
| P2-3 | Ürün listeleme DB’den |
| P2-4 | GitHub OAuth → GitHub App geçişi |
| P2-5 | Coolify deployment pipeline |
| P2-6 | Listeleme ücreti / iyzico |
| P2-7 | Arama + gerçek filtreler |

---

## P3 — İnovatif özellikler (doküman 02)

MVP Pasaportu, tersine pazar, pilot modül, escrow, veri odası vb.

Detay: [inovatif özellikler](https://mdshare.huseyinalav.com/02_inovatif_ozellikler_ve_gelisim_fikirleri-39653c)

---

## Bilinçli ertelenen

- Şifre sıfırlama
- E-posta doğrulama
- i18n (EN/TR tam ayrım)
- Unit / E2E test suite
- CI/CD pipeline
