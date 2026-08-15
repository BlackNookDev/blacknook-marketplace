# Docker + Coolify Kurulum Rehberi

BlackNOOK compose yalnızca **Next.js** çalıştırır. PostgreSQL ayrı bir Coolify (veya harici) servistir.

---

## Mimari

| Servis | Port (internal) | Açıklama |
|---|---|---|
| `app` (bu repo) | 3000 | Next.js standalone |
| PostgreSQL (Coolify DB) | 5432 | `postgres:18-alpine` — compose dışında |

`DB_HOST` = Coolify Postgres **internal hostname**. Uygulama ile DB aynı Docker network’te olmalı.

---

## Coolify

1. Ayrı resource: **PostgreSQL 18**. Initial database `postgres` kalabilir.
2. **Ports Mappings boş.** Public proxy kapalı. SSL kapalı.
3. Bu repo: Docker Compose resource.
4. App env:

| Değişken | Kaynak |
|---|---|
| `DB_HOST` | Postgres URL (internal) hostname |
| `DB_PORT` | `5432` |
| `DB_USER` | `postgres` |
| `DB_PASSWORD` | Coolify’ın ürettiği şifre |
| `DB_NAME` | `postgres` (içeride başka DB açarsanız onu yazın) |
| `DB_SSL` | `false` |
| `NEXTAUTH_SECRET` | random 32+ byte |
| `NEXTAUTH_URL` | `https://blacknook.com` |

5. Coolify’de app’i Postgres’in network’üne bağlayın (Connect to predefined network / destination). Hostname çözülmezse `connection refused` veya `getaddrinfo` görürsünüz.
6. Domain: `app` → `https://blacknook.com` (port **3000**).
7. Deploy. Container açılışında `entrypoint.sh` `pg_isready` bekler, sonra `schema.sql` + migrate çalışır.

OAuth callback:

```
https://blacknook.com/api/auth/callback/google
https://blacknook.com/api/auth/callback/github
```

---

## Lokal Docker

Harici Postgres (Coolify, Postgres.app veya başka host) ayakta olmalı.

```bash
cp .env.docker.example .env
# DB_HOST, DB_PASSWORD, NEXTAUTH_SECRET doldur
docker compose up -d --build
```

Uygulama: http://127.0.0.1:18080 (veya `.env` → `APP_PORT`)

---

## Otomatik migration

`app` başlarken [`docker/entrypoint.sh`](../docker/entrypoint.sh):

1. `DB_HOST` yoksa çıkış kodu 1
2. `pg_isready` ile Postgres bekler
3. `node scripts/migrate.js` (`schema.sql` + `migrations/`)
4. Admin seed
5. `node server.js`

---

## Sorun giderme

| Belirti | Çözüm |
|---|---|
| `DB_HOST is required` | Coolify env’e internal hostname |
| `DB_PASSWORD is required` | Coolify Postgres şifresi |
| `getaddrinfo` / host bulunamadı | App ile DB aynı network |
| `connection refused` | Postgres running + `DB_PORT=5432` + mapping yok (host 3000 kullanmayın) |
| NextAuth redirect loop | `NEXTAUTH_URL` = public https domain |

---

## Dosya referansı

| Dosya | Açıklama |
|---|---|
| [`Dockerfile`](../Dockerfile) | Multi-stage Next.js standalone |
| [`docker-compose.yml`](../docker-compose.yml) | Yalnızca app |
| [`.env.docker.example`](../.env.docker.example) | Env şablonu |
| [`docker/entrypoint.sh`](../docker/entrypoint.sh) | DB wait + migrate + start |
