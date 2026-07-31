# Uygulama Planı

Canlı MVP’ye giden adım adım plan.

---

## Sprint 0 — Dokümantasyon + Auth (1–2 gün)

**Amaç:** Plan netleşsin, auth uçtan uca çalışsın.

### Görevler

1. ✅ `docs/` MVP doküman seti
2. ✅ Login form → NextAuth credentials
3. ✅ Register form → register API + signIn
4. ✅ OAuth butonları
5. ✅ Navbar session state
6. ⬜ Lokal smoke test:
   ```bash
   cp .env.example .env
   # DB + NEXTAUTH_SECRET doldur
   node scripts/run-migration.js schema.sql
   npm run dev
   ```
7. ⬜ Kayıt → giriş → servis detay → kurulum talebi akışını manuel test et

### Kabul kriteri

- Yeni hesap oluşturulup oturum açılıyor
- Navbar’da kullanıcı adı / çıkış görünüyor
- Kurulum talebi modalı session ile açılıyor

---

## Sprint 1 — Production hazırlık (1 gün)

**Amaç:** Canlı ortamda çalışır hale getir.

### Görevler

1. PostgreSQL provision (Neon, Supabase, RDS, VPS)
2. `schema.sql` migrate — MVP için minimum:
   ```sql
   -- Sadece users yeterli; tam şema da çalıştırılabilir
   ```
3. Env production değerleri:
   - `NEXTAUTH_URL=https://yourdomain.com`
   - `NEXTAUTH_SECRET` (32+ byte random)
   - `DB_*` veya connection
   - `SMTP_*` + `INSTALLATION_REQUEST_TO`
4. OAuth callback URL’leri provider panelinde güncelle
5. `npm run build` — build hatasız
6. Deploy (Vercel önerilir — Next.js native)

### Kabul kriteri

- Production URL’de auth çalışıyor
- Kurulum talebi e-postası hedef adrese ulaşıyor

---

## Sprint 2 — Canlı sonrası iyileştirme (1 hafta)

**Amaç:** Mock’ları azalt, operasyonel görünürlük.

1. `installation_requests` tablosu + API log
2. Hero waitlist endpoint
3. Basit `/profile` sayfası
4. Analytics (Plausible / Vercel Analytics)
5. 404 / error sayfaları polish

---

## Sprint 3+ — Marketplace Faz 1

`PROJECT_SPEC.md` ve platform doküman 01’e göre:

```
GitHub bağlantısı → teknik kontrol → deploy → ürün sayfası → listeleme ücreti
```

Öncelik sırası:

1. Products CRUD + admin onay
2. GitHub App read-only repo erişimi
3. Coolify API entegrasyonu
4. Wildcard demo subdomain
5. Ödeme (listeleme $10)

---

## Teknik kararlar (MVP)

| Karar | Seçim | Gerekçe |
|---|---|---|
| Veritabanı | PostgreSQL | Mevcut şema + auth |
| Auth | NextAuth JWT | Zaten kurulu |
| Servis kataloğu | Statik TS | MVP hızı |
| Fiyatlandırma | Mock | Ödeme yok |
| Deploy hedefi | Vercel + managed PG | En az ops |

---

## Riskler

| Risk | Azaltma |
|---|---|
| SMTP production’da blok | Resend / SendGrid / AWS SES |
| OAuth callback yanlış URL | `NEXTAUTH_URL` kontrol |
| DB bağlantı timeout | Managed PG + SSL |
| Mock fiyat yanıltıcı | MVP’de “tahmini fiyat” etiketi (P1) |
