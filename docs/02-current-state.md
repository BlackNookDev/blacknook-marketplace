# Mevcut Durum (Kod Tabanı)

Son güncelleme: MVP planı oluşturulurken.

---

## Çalışan (gerçek entegrasyon)

| Parça | Dosya / route | Not |
|---|---|---|
| NextAuth handler | `app/api/auth/[...nextauth]/route.ts` | JWT session |
| Kayıt API | `app/api/auth/register/route.ts` | bcrypt, `users` tablosu |
| Auth config | `src/lib/authOptions.ts` | Credentials + OAuth |
| DB pool | `src/lib/db.ts` | PostgreSQL, mysql2 uyum shim |
| Kurulum talebi | `app/api/installation-request/route.ts` | Nodemailer, SMTP gerekli |
| Servis detay aksiyon | `app/service/[slug]/ServiceDetailActions.tsx` | API’yi çağırıyor |

---

## Düzeltilmesi gereken (P0 — MVP blocker)

| Sorun | Etki |
|---|---|
| Login formu `signIn()` çağırmıyordu | Giriş çalışmıyordu → **düzeltildi** |
| Register formu API’ye gitmiyordu | Kayıt çalışmıyordu → **düzeltildi** |
| OAuth butonları bağlı değildi | Google/GitHub çalışmıyordu → **düzeltildi** |
| Navbar session göstermiyordu | UX kırık → **düzeltildi** |

---

## Statik / mock (MVP’de kabul edilebilir)

- `lib/data.ts` — 51 servis
- `lib/pricingTiers.ts` — sahte tier fiyatları
- `lib/developerPresence.ts` — mock presence
- `HeroMailCollector` — fake submit
- `MatchDeveloperModal` — demo UX

---

## Var ama kullanılmayan

| Dosya | Durum |
|---|---|
| `WelcomePopup.tsx` | Import yok |
| `HeroPremium.tsx` | Import yok |
| `ScrollStorytelling.tsx` | Import yok |
| Spline / Three.js paketleri | Kodda kullanılmıyor |

---

## DB şeması vs kullanım

`schema.sql` tanımlı tablolar:

| Tablo | Kodda kullanım |
|---|---|
| `users` | ✅ Auth |
| `products` | ❌ |
| `product_tiers` | ❌ |
| `orders` | ❌ |
| `messages` | ❌ |
| `admin_notifications` | ❌ |
| `reviews` | ❌ |

MVP için yalnızca `users` yeterli. Tam şema migration ile kurulabilir; marketplace tabloları Faz 2’ye kadar boş kalabilir.

---

## Route haritası

```
/                     → Ana sayfa
/services             → Servis listesi
/service/[slug]       → Servis detay
/login                → Giriş
/register             → Kayıt

/api/auth/*           → NextAuth + register
/api/installation-request → Kurulum talebi e-postası
```

`PROJECT_SPEC.md` içindeki `/products`, `/admin`, `/profile`, `/vendor` **henüz yok**.
