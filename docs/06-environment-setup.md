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
| `SMTP_HOST` | Kurulum talebi için | Mail sunucusu |
| `SMTP_PORT` | ⬜ | Varsayılan `587` |
| `SMTP_SECURE` | ⬜ | `true` port 465 için |
| `SMTP_USER` | Kurulum talebi için | SMTP kullanıcı |
| `SMTP_PASSWORD` | Kurulum talebi için | SMTP şifre |
| `SMTP_FROM` | ⬜ | Gönderen adresi |
| `INSTALLATION_REQUEST_TO` | ⬜ | Varsayılan `dev@blacknook.com` |
| `GOOGLE_CLIENT_ID` | ⬜ | OAuth |
| `GOOGLE_CLIENT_SECRET` | ⬜ | OAuth |
| `GITHUB_CLIENT_ID` | ⬜ | OAuth |
| `GITHUB_CLIENT_SECRET` | ⬜ | OAuth |

SMTP tanımlı değilse kurulum talebi `503` döner — auth yine çalışır.

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
