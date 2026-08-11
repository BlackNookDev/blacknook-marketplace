# Ortam Kurulumu

---

## Gereksinimler

- Node.js 18+
- PostgreSQL 14+
- npm

---

## Docker (önerilen — tam stack)

Tüm stack tek komutla:

```bash
cp .env.docker.example .env
# .env içinde DB_PASSWORD, NEXTAUTH_SECRET, PGADMIN_DEFAULT_PASSWORD değiştir
docker compose up -d --build
```

| Servis | URL |
|---|---|
| Uygulama | http://localhost:3000 |
| pgAdmin | http://localhost:5050 |

Coolify deploy: [07-docker-coolify.md](./07-docker-coolify.md)

Compose içinde `DB_HOST=postgres` otomatik ayarlanır; `.env`'de `DB_HOST` tanımlamanız gerekmez.

---

## Lokal kurulum (Node doğrudan)

```bash
git clone <repo>
cd blacknook-marketplace
npm install
cp .env.example .env
```

`.env` dosyasını düzenle (aşağıya bak).

### Veritabanı

PostgreSQL’de veritabanı oluştur:

```sql
CREATE DATABASE blacknook;
```

Şemayı uygula:

```bash
node scripts/run-migration.js schema.sql
```

MVP için yalnızca `users` tablosu zorunlu. Tam şema gelecek fazlar için hazır.

### NextAuth secret

```bash
# macOS / Linux
openssl rand -base64 32

# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

Çıktıyı `NEXTAUTH_SECRET` olarak kullan.

### Geliştirme sunucusu

```bash
npm run dev
```

http://localhost:3000

---

## Ortam değişkenleri

| Değişken | Zorunlu | Açıklama |
|---|---|---|
| `DB_HOST` | ✅ | Postgres host |
| `DB_PORT` | ✅ | Varsayılan `5432` |
| `DB_USER` | ✅ | DB kullanıcı |
| `DB_PASSWORD` | ✅ | DB şifre |
| `DB_NAME` | ✅ | Veritabanı adı |
| `DB_SSL` | ⬜ | `true` remote, `false` lokal |
| `NEXTAUTH_SECRET` | ✅ | Session şifreleme |
| `NEXTAUTH_URL` | ✅ | `http://localhost:3000` veya prod URL |
| `SMTP_HOST` | Mail için | `smtp.gmail.com` (Gmail App Password) |
| `SMTP_PORT` | ⬜ | Varsayılan `587` |
| `SMTP_SECURE` | ⬜ | `true` port 465 için |
| `SMTP_USER` | Mail için | Gmail adresi |
| `SMTP_PASSWORD` | Mail için | 16 haneli **uygulama şifresi** (normal şifre değil) |
| `SMTP_FROM` | ⬜ | `Blacknook <aynı@gmail.com>` |
| `INSTALLATION_REQUEST_TO` | ⬜ | Varsayılan `dev@blacknook.com` |
| `MATCH_REQUEST_TO` | ⬜ | Varsayılan `contact@blacknook.com` |
| `GOOGLE_CLIENT_ID` | ⬜ | OAuth |
| `GOOGLE_CLIENT_SECRET` | ⬜ | OAuth |
| `GITHUB_CLIENT_ID` | ⬜ | OAuth |
| `GITHUB_CLIENT_SECRET` | ⬜ | OAuth |

SMTP tanımlı değilse kurulum talebi `503` döner; kayıt yine tamamlanır (hoş geldin maili log’a düşer).

### Gmail ile gönderme (önerilen basit yol)

1. Google Hesabı → **Güvenlik** → **2 Adımlı Doğrulama** açık olsun  
2. **Uygulama şifreleri** → Mail → 16 haneli şifre üret  
3. `.env` içinde:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SMTP_FROM="Blacknook <your@gmail.com>"
```

Gmail’de `SMTP_FROM` adresi `SMTP_USER` ile aynı hesap olmalı. Değişiklikten sonra container’ı yeniden başlatın.

---

## Production önerileri

### Hosting

- **Docker + Coolify:** [07-docker-coolify.md](./07-docker-coolify.md) (önerilen)
- **Next.js:** Vercel (ayrı managed Postgres gerekir)
- **PostgreSQL:** Neon, Supabase, Railway, RDS (Vercel deploy için)

### E-posta

- Resend, SendGrid, AWS SES, Mailgun
- SPF / DKIM domain doğrulama

### OAuth

Production callback URL’leri:

```
https://yourdomain.com/api/auth/callback/google
https://yourdomain.com/api/auth/callback/github
```

---

## Sık hatalar

| Belirti | Çözüm |
|---|---|
| `NEXTAUTH_URL` mismatch | URL tam eşleşmeli (http/https, port) |
| DB connection refused | `DB_HOST`, firewall, SSL |
| OAuth redirect_uri_mismatch | Provider panel callback URL |
| Kurulum talebi 503 | SMTP env eksik |
| Kayıt 500 | `users` tablosu yok — migration çalıştır |

---

## Migration dosyaları

| Dosya | Amaç |
|---|---|
| `schema.sql` | Tam şema (kanonik) |
| `migrations/002_reviews_and_profile.sql` | Eski DB upgrade |
| `migrations/fix-users-role.sql` | Role constraint düzeltme |

Yeni kurulumda yalnızca `schema.sql` yeterli.
