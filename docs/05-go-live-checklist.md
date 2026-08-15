# Go-Live Checklist

Canlıya almadan önce tek tek işaretle.

---

## Kod & build

- [ ] `npm run lint` — kritik hata yok
- [ ] `npm run build` — başarılı
- [ ] Auth formları gerçek API/NextAuth kullanıyor
- [ ] Navbar oturum durumunu doğru gösteriyor
- [ ] Kurulum talebi `/api/installation-request` çalışıyor

---

## Veritabanı

- [ ] Production PostgreSQL erişilebilir
- [ ] `schema.sql` (veya en az `users`) migrate edildi
- [ ] `users.email` unique index aktif
- [ ] Bağlantı SSL ayarı doğru (`DB_SSL=true` remote için)

Migration komutu:

```bash
node scripts/run-migration.js schema.sql
```

---

## Ortam değişkenleri (production)

- [ ] `NEXTAUTH_SECRET` — güçlü, rastgele, gizli
- [ ] `NEXTAUTH_URL` — production domain (trailing slash yok)
- [ ] `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- [ ] `DB_SSL=true` (managed Postgres için)
- [ ] `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`
- [ ] `SMTP_FROM`, `INSTALLATION_REQUEST_TO`
- [ ] (Opsiyonel) `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- [ ] (Opsiyonel) `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

`.env` dosyası repoya commit edilmedi ✅

---

## OAuth provider ayarları

Google Cloud Console / GitHub OAuth App:

- [ ] Authorized redirect URI: `https://YOUR_DOMAIN/api/auth/callback/google`
- [ ] Authorized redirect URI: `https://YOUR_DOMAIN/api/auth/callback/github`
- [ ] Production domain onaylı

---

## Deploy (Docker / Coolify — önerilen)

- [ ] `cp .env.docker.example .env` — şifreler değiştirildi
- [ ] `docker compose up -d --build` — tüm servisler healthy
- [ ] Coolify'de `app` domain ataması yapıldı
- [ ] `NEXTAUTH_URL` = production https domain
- [ ] `DB_HOST` Coolify Postgres internal hostname; app ile DB aynı network

Detay: [07-docker-coolify.md](./07-docker-coolify.md)

## Deploy (alternatif — Vercel + managed PG)

- [ ] Domain DNS → hosting
- [ ] HTTPS aktif
- [ ] Node 18+ runtime
- [ ] Env değişkenleri hosting panelinde tanımlı

---

## Smoke test (production)

Sırayla dene:

1. [ ] `/` — ana sayfa yükleniyor
2. [ ] `/services` — liste görünüyor
3. [ ] `/service/ghost` — detay açılıyor
4. [ ] `/register` — yeni hesap oluştur
5. [ ] `/login` — giriş yap
6. [ ] Navbar — isim + çıkış görünüyor
7. [ ] Servis detay → “Kurulum talep et” → form gönder → e-posta geldi
8. [ ] (Varsa) Google/GitHub ile giriş
9. [ ] Çıkış → tekrar giriş sayfasına yönlendirme

---

## Bilinen MVP sınırlamaları (canlıda normal)

- Fiyatlar gerçek değil (deterministik mock)
- Waitlist hero formu DB'ye yazıyor (SMTP bildirimi opsiyonel)
- Geliştirici eşleştirme SMTP ile e-posta gönderir (SMTP gerekli)
- Şifre sıfırlama yok
- Admin / vendor paneli yok

Bunlar bilinçli; [01-mvp-scope.md](./01-mvp-scope.md) referans.

---

## Rollback planı

- [ ] Önceki deploy tag/commit not edildi
- [ ] DB migration geri alma stratejisi (MVP’de genelde gerekmez)
- [ ] DNS TTL düşük tutuldu (ilk launch)

---

## Launch sonrası (24 saat)

- [ ] Error logları kontrol (hosting panel / Vercel)
- [ ] İlk gerçek kurulum talebi e-postası doğrulandı
- [ ] İlk kayıt akışı sorunsuz
