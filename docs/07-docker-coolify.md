# Docker + Coolify Kurulum Rehberi

BlackNOOK stack: **Next.js (FE+BE)** + **PostgreSQL** + **pgAdmin** — tek `docker-compose.yml`.

---

## Mimari

| Servis | Container adı | Port (internal) | Açıklama |
|---|---|---|---|
| `app` | app | 3000 | Next.js standalone |
| `postgres` | postgres | 5432 | PostgreSQL 16 (host'a publish edilmez) |
| `pgadmin` | pgadmin | 80 | pgAdmin 4 |

Internal DNS: `app` → `DB_HOST=postgres`, pgAdmin'de sunucu host'u `postgres`.

---

## Lokal çalıştırma

### 1. Env dosyası

```bash
cp .env.docker.example .env
```

`.env` içinde mutlaka değiştir:

- `DB_PASSWORD`
- `NEXTAUTH_SECRET` (`openssl rand -base64 32`)
- `PGADMIN_DEFAULT_PASSWORD`

### 2. Stack'i başlat

```bash
docker compose up -d --build
```

| URL | Adres |
|---|---|
| Uygulama | http://localhost:3000 |
| pgAdmin | http://localhost:5050 |

### 3. pgAdmin'e PostgreSQL bağlama

1. http://localhost:5050 — `.env` içindeki `PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD`
2. **Add New Server**
   - **General → Name:** BlackNOOK
   - **Connection → Host:** `postgres`
   - **Port:** `5432`
   - **Username:** `.env` → `DB_USER` (varsayılan `postgres`)
   - **Password:** `.env` → `DB_PASSWORD`
   - **Save password:** ✓

Tablolar: `users`, `waitlist_signups`, `products`, …

### 4. Loglar

```bash
docker compose logs -f app
docker compose ps
```

### 5. Durdurma

```bash
docker compose down        # volume korunur
docker compose down -v     # tüm veriyi siler
```

---

## Coolify deploy

### Ön koşullar

- Coolify sunucusu (Docker + Compose destekli)
- Git repo erişimi
- Domain(ler): uygulama + pgAdmin

### Adımlar

1. **Coolify → New Resource → Docker Compose**
2. Repository + branch seç
3. Compose file path: `docker-compose.yml`
4. **Environment Variables** ekle (`.env.docker.example` referans):

| Değişken | Örnek | Not |
|---|---|---|
| `DB_PASSWORD` | güçlü şifre | postgres + app paylaşır |
| `DB_USER` | `postgres` | |
| `DB_NAME` | `blacknook` | |
| `NEXTAUTH_SECRET` | random 32+ byte | |
| `NEXTAUTH_URL` | `https://marketplace.domain.com` | https, slash yok |
| `PGADMIN_DEFAULT_EMAIL` | admin@... | |
| `PGADMIN_DEFAULT_PASSWORD` | güçlü şifre | |
| `SMTP_*` | ... | opsiyonel |

5. **Domain ataması (Coolify UI):**
   - `app` servisi → `https://marketplace.domain.com` (port **3000**)
   - `pgadmin` servisi → `https://pgadmin.domain.com` (port **80**)

6. **OAuth callback URL'leri** (Google/GitHub panel):
   ```
   https://marketplace.domain.com/api/auth/callback/google
   https://marketplace.domain.com/api/auth/callback/github
   ```

7. Deploy → smoke test ([05-go-live-checklist.md](./05-go-live-checklist.md))

### Coolify notları

- Postgres verisi `postgres_data` volume'da kalır; resource silinmedikçe korunur.
- `DB_HOST=postgres` compose içinde sabit — Coolify'de override etmeyin.
- pgAdmin production'da güçlü şifre kullanın; mümkünse ayrı subdomain + erişim kısıtı.
- SMTP harici servis olarak env ile girilir (container içinde mail sunucusu yok).

---

## Otomatik migration

`app` container başlarken [`docker/entrypoint.sh`](../docker/entrypoint.sh):

1. PostgreSQL hazır olana kadar bekler (`pg_isready`)
2. `schema.sql` uygular (`IF NOT EXISTS` — idempotent)
3. `node server.js` başlatır

İlk boot'ta `postgres` servisi ayrıca `schema.sql`'i init volume'a yükler.

Ek migration (host'tan):

```bash
docker compose exec app psql -h postgres -U postgres -d blacknook -f migrations/003_waitlist.sql
```

veya lokal Node:

```bash
DB_HOST=localhost DB_PORT=5432 ... node scripts/run-migration.js migrations/003_waitlist.sql
```

---

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `DB_PASSWORD is required` | `.env` veya Coolify env'de tanımla |
| App `connection refused` postgres | `docker compose ps` — postgres healthy mi? |
| pgAdmin sunucuya bağlanamıyor | Host `postgres` olmalı, `localhost` değil |
| NextAuth redirect loop | `NEXTAUTH_URL` = public https domain |
| Build fail | `docker compose build --no-cache app` |
| Port 3000 meşgul | `.env` → `APP_PORT=3001` |

---

## Dosya referansı

| Dosya | Açıklama |
|---|---|
| [`Dockerfile`](../Dockerfile) | Multi-stage Next.js standalone |
| [`docker-compose.yml`](../docker-compose.yml) | Stack tanımı |
| [`.env.docker.example`](../.env.docker.example) | Env şablonu |
| [`docker/entrypoint.sh`](../docker/entrypoint.sh) | DB wait + schema + start |
