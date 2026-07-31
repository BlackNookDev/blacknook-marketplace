# BlackNOOK — MVP Dokümantasyonu

Canlıya çıkacak **basit MVP** için plan, kapsam ve kontrol listeleri.

## Dokümanlar

| Dosya | Açıklama |
|---|---|
| [01-mvp-scope.md](./01-mvp-scope.md) | MVP kapsamı — ne var, ne yok |
| [02-current-state.md](./02-current-state.md) | Mevcut kod tabanı durumu |
| [03-priority-backlog.md](./03-priority-backlog.md) | Önceliklendirilmiş iş listesi (P0–P2) |
| [04-implementation-plan.md](./04-implementation-plan.md) | Uygulama planı ve sprint sırası |
| [05-go-live-checklist.md](./05-go-live-checklist.md) | Canlıya almadan önce kontrol listesi |
| [06-environment-setup.md](./06-environment-setup.md) | Ortam değişkenleri ve kurulum |
| [07-docker-coolify.md](./07-docker-coolify.md) | Docker Compose + Coolify deploy |

## Hızlı özet

**MVP hedefi:** Ziyaretçi servis kataloğunu gezebilsin, kayıt olup giriş yapabilsin, kurulum talebi gönderebilsin.

**Canlıda çalışması gerekenler (P0):**

1. Auth UI ↔ NextAuth + PostgreSQL
2. Servis listesi / detay (statik katalog)
3. Kurulum talebi e-postası (SMTP)
4. Production env + DB migration

**Canlı MVP dışında (sonraki faz):** GitHub deploy, marketplace DB, ödeme, admin panel, MVP Pasaportu.

## İlgili kaynaklar

- `PROJECT_SPEC.md` — uzun vadeli marketplace spesifikasyonu (henüz tam uygulanmadı)
- `schema.sql` — PostgreSQL şeması
- `.env.example` — ortam değişkeni şablonu (lokal Node)
- `.env.docker.example` — Docker Compose / Coolify env şablonu
