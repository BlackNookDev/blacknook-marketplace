# PROJECT_SPEC.md — BlackNOOK Digital Marketplace

> **Cursor AI Reference Document**
> Bu doküman, BlackNOOK dijital pazaryeri projesinin tüm teknik mimarisini, sayfa spesifikasyonlarını, bileşen yapılarını ve veritabanı şemasını kapsar. Tüm dosya yolları projenin gerçek ağacıyla birebir eşleşmektedir.

---

## 1. Proje Genel Bakış

**BlackNOOK**, çok satıcılı (multi-vendor) bir dijital yazılım pazaryeridir. Satıcılar ürünlerini listeleyebilir, adminler onay/red işlemi yapabilir ve kullanıcılar ömür boyu lisans (lifetime deal) satın alabilir.

### Temel Özellikler

- Çok satıcılı (vendor/user/admin) rol tabanlı sistem
- Ürün onay/moderasyon iş akışı (`pending → approved / rejected`)
- Tier (katman) tabanlı lisanslama
- Base64 ile sunucu tarafı depolama (harici CDN yok)
- Spline ile 3D hero alanı
- NextAuth.js session tabanlı kimlik doğrulama
- iyzico ödeme entegrasyonu (roadmap)

---

## 2. Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Framework | Next.js 14+ (App Router, TypeScript) |
| Stil | Tailwind CSS — Zinc monokrom tema (`zinc-900`, `zinc-800`, `zinc-700`, `white`) |
| Veritabanı | Supabase (PostgreSQL) |
| ORM / DB Client | `pg` (raw queries via `src/lib/db.ts`, mysql2-uyumlu ince katman) |
| Auth | NextAuth.js v4, bcryptjs |
| 3D | Spline (`@splinetool/react-spline`), `next/dynamic` ile SSR devre dışı |
| Dosya Yükleme | FileReader API → Base64 → Postgres `TEXT` |
| Ödeme (Roadmap) | iyzico Card Storage API |

---

## 3. Renk Paleti & Tasarım Sistemi

Ekran görüntülerinden analiz edilen Tailwind Zinc monokrom tema:

```
Arkaplan (sayfa): bg-zinc-950  (#09090b)
Kart / Panel:     bg-zinc-900  (#18181b)
Input / Border:   bg-zinc-800, border-zinc-700
Metin (ana):      text-white
Metin (ikincil):  text-zinc-400
Vurgu (kırmızı):  text-red-500  (Çıkış, Paketi Sil butonları)
CTA Butonu:       bg-white text-black, font-bold, rounded-full
Etiket (badge):   bg-zinc-800 text-zinc-300, text-xs tracking-widest uppercase
```

**Tipografi:** `font-black` (900) büyük başlıklar, `tracking-tight`, `uppercase` etiketler için `tracking-widest text-xs`.

**Köşe Yuvarlaklığı:** Kartlar `rounded-2xl`, inputlar `rounded-xl`, ana CTA butonu `rounded-full`.

---

## 4. Dosya Ağacı

```
MARKETPLACE/
├── app/
│   ├── admin/
│   │   └── products/
│   │       └── page.tsx           # Admin Onay & Moderasyon Paneli
│   ├── api/
│   │   ├── admin/
│   │   │   └── notifications/
│   │   │       └── route.ts       # Admin Bildirimleri API
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   │   └── route.ts       # NextAuth API handler
│   │   │   └── register/
│   │   │       └── route.ts       # Kullanıcı Kayıt API
│   │   ├── messages/
│   │   │   └── route.ts           # Chat / Mesajlaşma API
│   │   ├── orders/
│   │   │   └── route.ts           # Siparişler API
│   │   └── products/
│   │       ├── [slug]/
│   │       │   └── route.ts       # Ürün Detay GET & Status PATCH API
│   │       └── route.ts           # Ürün Ekleme POST & Listeleme GET API
│   ├── login/
│   │   └── page.tsx               # Giriş Sayfası
│   ├── products/
│   │   ├── [slug]/
│   │   │   └── page.tsx           # Ürün Detay Sayfası
│   │   └── page.tsx               # Kategori Filtreli Ürün Listeleme
│   ├── profile/
│   │   └── page.tsx               # Kullanıcı / Satıcı / Admin Profil Sayfası
│   ├── register/
│   │   └── page.tsx               # Kayıt Sayfası
│   ├── vendor/
│   │   └── add-product/
│   │       └── page.tsx           # Satıcı Ürün & Dosya Yükleme Paneli
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx                 # Root Layout (Navbar + Providers)
│   └── page.tsx                   # Ana Sayfa (Hero + Spline 3D + Sections)
├── src/
│   ├── components/
│   │   ├── ChatModal.tsx          # Concierge Canlı Destek Modali
│   │   ├── Navbar.tsx             # Dropdown Kategori Navigasyonu
│   │   └── Providers.tsx          # NextAuth SessionProvider Wrapper
│   ├── data/                      # Statik veri sabitleri (kategoriler vb.)
│   └── lib/
│       ├── authOptions.ts         # NextAuth yapılandırması (CredentialsProvider)
│       └── db.ts                  # Supabase (Postgres) bağlantı havuzu (pg), mysql2-uyumlu shim
├── .env                           # DATABASE_URL (Supabase), NEXTAUTH_SECRET
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 5. Veritabanı Şeması (PostgreSQL / Supabase)

Güncel şema için bkz. `schema.sql` (tek kaynak — kanonik şema burada tutulur; aşağıdaki özet referans amaçlıdır). `users` tablosu ayrıca `avatar`, `bio`, `linkedin_url` sütunlarını; şema ayrıca ürün yorumları için bir `reviews` tablosunu içerir.

```sql
-- Kullanıcılar
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,            -- bcryptjs hash
  role        VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user','vendor','admin')),
  avatar      TEXT,
  bio         TEXT,
  linkedin_url VARCHAR(255),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ürünler
CREATE TABLE products (
  id                  SERIAL PRIMARY KEY,
  vendor_id           INTEGER NOT NULL REFERENCES users(id),
  title               VARCHAR(255) NOT NULL,
  slug                VARCHAR(255) NOT NULL UNIQUE,
  category            VARCHAR(100) NOT NULL,
  short_description   TEXT,
  long_description    TEXT,                    -- HTML veya Markdown içerik
  cover_image         TEXT,                    -- Base64 encoded string
  gallery_images      TEXT,                    -- JSON array of Base64 strings
  video_url           TEXT,                    -- Base64 encoded MP4/WebM
  features_list       JSONB,                   -- ["Özellik 1", "Özellik 2", ...]
  status              VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ürün Lisans Katmanları (Tiers)
CREATE TABLE product_tiers (
  id              SERIAL PRIMARY KEY,
  product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tier_name       VARCHAR(100) NOT NULL,        -- "License Tier 1", "License Tier 2"
  price           DECIMAL(10,2) NOT NULL,       -- Satış fiyatı
  original_price  DECIMAL(10,2),               -- Çizili orijinal fiyat
  features        JSONB                         -- ["Tüm temel özellikler", "1 Kullanıcı erişimi"]
);

-- Siparişler
CREATE TABLE orders (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  product_id  INTEGER NOT NULL REFERENCES products(id),
  tier_id     INTEGER NOT NULL REFERENCES product_tiers(id),
  amount      DECIMAL(10,2) NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mesajlar
CREATE TABLE messages (
  id          SERIAL PRIMARY KEY,
  sender_id   INTEGER NOT NULL REFERENCES users(id),
  receiver_id INTEGER NOT NULL REFERENCES users(id),
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Bildirimleri
CREATE TABLE admin_notifications (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id),
  message     VARCHAR(500) NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ürün Yorumları
CREATE TABLE reviews (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  rating      SMALLINT NOT NULL DEFAULT 5,
  comment     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (product_id, user_id)
);
```

---

## 6. Temel Kütüphane Dosyaları

### `src/lib/db.ts` — Supabase (Postgres) Bağlantı Havuzu

`pg` paketi ile Supabase Postgres'e bağlanır. Rota dosyalarının (`app/api/**`) hiç değişmeden çalışabilmesi için mysql2'nin `?` placeholder / `insertId` / `affectedRows` / `getConnection().beginTransaction()` API'sini taklit eden ince bir uyumluluk katmanı içerir.

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase.co') ? { rejectUnauthorized: false } : undefined,
});

// ?-placeholder → $1,$2,... çevirisi, INSERT için otomatik RETURNING id,
// ve pool.getConnection()/beginTransaction()/commit()/rollback() uyumluluğu
// için bkz. gerçek dosya: src/lib/db.ts
```

### `src/lib/authOptions.ts` — NextAuth Yapılandırması

```typescript
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import pool from './db';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const [rows]: any = await pool.query(
          'SELECT * FROM users WHERE email = ?',
          [credentials?.email]
        );
        const user = rows[0];
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.role = (user as any).role; token.id = (user as any).id; }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).role = token.role;
      (session.user as any).id = token.id;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### `src/components/Providers.tsx`

```typescript
'use client';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

---

## 7. Sayfa Spesifikasyonları

---

### 7.1 `app/layout.tsx` — Root Layout

**Görev:** Tüm sayfalara Navbar ve Providers'ı sarar.

```typescript
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-zinc-950 text-white min-h-screen">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

---

### 7.2 `src/components/Navbar.tsx` — Dropdown Kategori Navigasyonu

**Görsel Analizi (Image 1):** Siyah (`bg-zinc-950`) arka plan üzerinde solda **BlackNOOK** bold logo, sağda sırasıyla:
- `● Yeni Gelenler` — yeşil nokta ikonlu link
- `Kategoriler ▼` — tıklanınca açılan dropdown, tekrar tıklayınca kapanan toggle mantığı
- Dikey ayırıcı `|`
- `+ Ürün Listele` — beyaz arka plan, siyah metin, `rounded-full` buton
- `Profilim` — text link
- `Çıkış` — `text-red-500`

**Teknik Spesifikasyon:**

```typescript
'use client';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const CATEGORIES = ['Marketing', 'AI Tools', 'Developer Tools', 'Design', 'Productivity', 'E-Commerce'];

export default function Navbar() {
  const { data: session } = useSession();
  const [categoryOpen, setCategoryOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-zinc-950 border-b border-zinc-800 px-6 h-14 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="font-black text-white text-xl tracking-tight">BlackNOOK</Link>

      {/* Right Nav */}
      <div className="flex items-center gap-6">
        <Link href="/products?sort=newest" className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          Yeni Gelenler
        </Link>

        {/* Kategori Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCategoryOpen(prev => !prev)}
            className="flex items-center gap-1 text-sm text-zinc-300 hover:text-white"
          >
            Kategoriler ▼
          </button>
          {categoryOpen && (
            <div className="absolute top-8 left-0 bg-zinc-900 border border-zinc-700 rounded-xl p-2 w-48 shadow-xl">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat}
                  href={`/products?category=${cat}`}
                  onClick={() => setCategoryOpen(false)}
                  className="block px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-zinc-700" />

        <Link href="/vendor/add-product" className="bg-white text-black text-sm font-bold px-4 py-1.5 rounded-full hover:bg-zinc-100">
          + Ürün Listele
        </Link>

        {session ? (
          <>
            <Link href="/profile" className="text-sm text-zinc-300 hover:text-white">Profilim</Link>
            <button onClick={() => signOut()} className="text-sm text-red-500 hover:text-red-400">Çıkış</button>
          </>
        ) : (
          <Link href="/login" className="text-sm text-zinc-300 hover:text-white">Giriş Yap</Link>
        )}
      </div>
    </nav>
  );
}
```

---

### 7.3 `app/page.tsx` — Ana Sayfa

**Görsel Analizi (Image 1 & 2):**

**Bölüm 1 — Hero (İki Kolon):**
- Sol kolon: Üstte `bg-zinc-800 rounded-full` pill badge ("NESLİN EN İYİ DİJİTAL PAZARYERİ"), altında `font-black` dev başlık, açıklama metni, beyaz `rounded-full` CTA butonu ("Araçları Keşfet ↓")
- Sağ kolon: `rounded-3xl overflow-hidden bg-zinc-900` kart içinde Spline 3D sahnesi, sağ alt köşede "Built with Spline" küçük badge

**Bölüm 2 — "Nasıl Satın Alınır?" (3 Adım Kartı):**
- Ortalanmış başlık bloğu
- 3 kolon kart grid: Her kart `bg-zinc-900 rounded-2xl p-6`, üstte `text-xs tracking-widest text-zinc-500` adım etiketi + ikonlu badge, altında başlık ve açıklama
- İkon badge'leri: Adım 1 gri ✓, Adım 2 gri $, Adım 3 sarı ⚡ — `rounded-lg p-2`

**Bölüm 3 — "Öne Çıkan Fırsatlar":**
- Büyük sol hizalı başlık, alt kısmında ürün kartları grid'i (onaylı ürünler)

**Teknik Spesifikasyon:**

```typescript
import dynamic from 'next/dynamic';
import Link from 'next/link';
import pool from '@/lib/db';

// Spline SSR'ı kapat
const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

async function getFeaturedProducts() {
  const [rows] = await pool.query(
    "SELECT p.*, pt.price FROM products p LEFT JOIN product_tiers pt ON pt.product_id = p.id WHERE p.status = 'approved' GROUP BY p.id ORDER BY p.created_at DESC LIMIT 6"
  );
  return rows as any[];
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <main className="pt-14">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 gap-12 items-center">
        {/* Sol */}
        <div className="space-y-6">
          <span className="inline-block bg-zinc-800 text-zinc-300 text-xs tracking-widest uppercase px-4 py-2 rounded-full">
            Neslin En İyi Dijital Pazaryeri
          </span>
          <h1 className="text-6xl font-black leading-none">
            <span className="text-white">EKOSİSTEMİNİZİ</span><br />
            <span className="text-zinc-500">BERABER</span><br />
            <span className="text-zinc-500">İNŞA EDELİM</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md">
            Erken aşama harika girişimleri, yapay zeka araçlarını ve kod paketlerini keşfedin.
          </p>
          <Link href="#featured" className="inline-block bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-zinc-100">
            Araçları Keşfet ↓
          </Link>
        </div>

        {/* Sağ — Spline 3D */}
        <div className="relative bg-zinc-900 rounded-3xl overflow-hidden aspect-square">
          <Spline scene="YOUR_SPLINE_SCENE_URL" />
          <div className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur text-xs text-zinc-400 px-3 py-1.5 rounded-full flex items-center gap-2">
            🎨 Built with Spline
          </div>
        </div>
      </section>

      {/* NASIL SATIN ALINIR */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest text-zinc-500 uppercase mb-2">3 Kolay Adımda Başlayın</p>
          <h2 className="text-4xl font-black">Nasıl Satın Alınır?</h2>
          <p className="text-zinc-400 mt-3">Aylık faturalara veda edin. Süreç tamamen şeffaf ve güvenlidir.</p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[
            { step: 'Adım 1', icon: '✓', iconBg: 'bg-zinc-700', title: 'Yazılımınızı Seçin', desc: 'İhtiyacınıza en uygun yapay zeka aracını, SaaS yazılımını veya geliştirici paketini inceleyin.' },
            { step: 'Adım 2', icon: '$', iconBg: 'bg-zinc-700', title: 'Ödemenizi Yapın', desc: 'Güvenli ödeme altyapısı ile tek seferlik ömür boyu lisansınızı satın alın.' },
            { step: 'Adım 3', icon: '⚡', iconBg: 'bg-yellow-400 text-black', title: 'Kullanmaya Başlayın', desc: 'Lisans anahtarınızı anında alın ve ürünü hemen kullanmaya başlayın.' },
          ].map((item) => (
            <div key={item.step} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs tracking-widest text-zinc-500 uppercase">{item.step}</span>
                <span className={`${item.iconBg} text-sm p-2 rounded-lg font-bold`}>{item.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-zinc-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ÖNE ÇIKAN FIRSATLAR */}
      <section id="featured" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-black mb-2">Öne Çıkan Fırsatlar</h2>
        <p className="text-zinc-400 mb-10">Topluluk tarafından en çok oylanan ve yeni eklenen kaçırılmayacak yazılımlar.</p>
        <div className="grid grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
```

---

### 7.4 `app/products/[slug]/page.tsx` — Ürün Detay Sayfası

**Görev:** İki kolonlu ürün detay sayfası.

**Layout Spesifikasyonu:**

```
┌─────────────────────────────────────────────────────┐
│  Sol Kolon (flex-1)          │  Sağ Kolon (w-80)   │
│                              │  [sticky top-20]     │
│  1. Başlık + Kısa Özet       │                     │
│  2. HTML5 Video Oynatıcı     │  Tier Seçim Kartı   │
│  3. Galeri (thumbnail grid)  │  ─────────────────  │
│  4. Tab Menü:                │  • Tier 1: $49      │
│     [Genel Bakış]            │    ~~$199~~         │
│     [Özellikler]             │  • Tier 2: $99      │
│     [SSS]                    │    ~~$399~~         │
│  5. Tab İçeriği              │  ─────────────────  │
│                              │  [Şimdi Satın Al]  │
│                              │  [Concierge Chat]  │
└─────────────────────────────────────────────────────┘
```

**Teknik Spesifikasyon:**

```typescript
// app/products/[slug]/page.tsx
import pool from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient'; // Client bileşeni

export async function generateStaticParams() {
  const [rows]: any = await pool.query("SELECT slug FROM products WHERE status = 'approved'");
  return rows.map((r: any) => ({ slug: r.slug }));
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [productRows]: any = await pool.query(
    "SELECT * FROM products WHERE slug = ? AND status = 'approved'", [params.slug]
  );
  if (!productRows[0]) notFound();

  const product = productRows[0];
  const [tierRows]: any = await pool.query(
    "SELECT * FROM product_tiers WHERE product_id = ? ORDER BY price ASC", [product.id]
  );

  return <ProductDetailClient product={product} tiers={tierRows} />;
}
```

**`ProductDetailClient` (Client Component) — Kritik Bileşenler:**

```typescript
'use client';
import { useState } from 'react';

// Galeri: cover_image + gallery_images (JSON.parse) kombine edilir
// Aktif galeri öğesi tıklanınca video veya resim ana alana yüklenir
// Video: <video controls className="w-full rounded-xl" src={videoDataUrl} />
// Resim: <img src={base64String} className="w-full rounded-xl object-cover" />

// Tier Kartları (Sağ Kolon Sticky)
// Her tier için: tier_name, price (büyük), original_price (line-through text-zinc-500)
// Seçili tier: ring-2 ring-white
// "Şimdi Satın Al" butonu: bg-white text-black font-bold rounded-xl w-full py-3

// Tab Menü: ['Genel Bakış', 'Özellikler', 'SSS']
// activeTab state ile içerik alanı değişir
// Genel Bakış: long_description (dangerouslySetInnerHTML veya markdown render)
// Özellikler: features_list (JSON.parse) → ul listesi
```

---

### 7.5 `app/vendor/add-product/page.tsx` — Satıcı Ürün Ekleme Paneli

**Görsel Analizi (Image 3, 4, 5):**

Sayfa 4 bölüme ayrılmıştır, her biri `bg-zinc-900 rounded-2xl` kart içindedir:

**Bölüm 1 — Temel Ürün Bilgileri (Image 3):**
- `ÜRÜN ADI`: text input, placeholder "Örn: Vexp - AI Video Creator"
- `KATEGORİ`: select dropdown, default "Marketing"
- `KISA ÖZET`: text input
- `DETAYLI AÇIKLAMA (OVERVIEW)`: `<textarea>` büyük alan

**Bölüm 2 — Görsel ve Video Yükleme (Image 4):**
- `ANA KAPAK GÖRSELİ`: tek dosya input, `accept="image/*"`, FileReader → Base64
- `EKRAN GÖRÜNTÜLERİ / GALERİ`: çoklu dosya input, `multiple accept="image/*"`, sonuçlar Base64 dizisine push edilir
- `TANITIM VİDEOSU (MP4 / WEBM)`: tek dosya input, `accept="video/mp4,video/webm"`, FileReader → Base64

**Bölüm 3 — Öne Çıkan Genel Özellikler (Image 4):**
- Dinamik string dizisi: `features: string[]` state
- Her özellik için text input
- `+ Özellik Maddesi Ekle` butonu (yeni boş string push)

**Bölüm 4 — Fiyatlandırma ve Ömür Boyu Paketler / Tiers (Image 5):**
- `+ Yeni Paket Ekle` butonu (sağ üst köşe, `bg-zinc-800 rounded-xl`)
- Her Tier kartı: `PAKET KATMANI #N`, `PAKET ADI`, `SATIŞ FİYATI ($)`, `ORİJİNAL FİYAT ($) (ÇİZİLİ)`, `PAKET İÇERİĞİ VE HAKLARI` (dinamik liste)
- `Paketi Sil` butonu: `text-red-500` (sağ üst)
- `+ Bu Pakete Özellik Maddesi Ekle` butonu

**Teknik Spesifikasyon:**

```typescript
'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Tier {
  tier_name: string;
  price: string;
  original_price: string;
  features: string[];
}

interface FormState {
  title: string;
  category: string;
  short_description: string;
  long_description: string;
  cover_image: string;          // Base64
  gallery_images: string[];     // Base64[]
  video_url: string;            // Base64
  features_list: string[];
  tiers: Tier[];
}

// FileReader yardımcı fonksiyon
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export default function AddProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    title: '', category: 'Marketing', short_description: '',
    long_description: '', cover_image: '', gallery_images: [],
    video_url: '', features_list: ['', ''], tiers: [
      { tier_name: 'License Tier 1', price: '', original_price: '', features: [''] }
    ]
  });

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, vendor_id: (session?.user as any)?.id }),
    });
    if (res.ok) router.push('/profile');
    setLoading(false);
  };

  // ... JSX render (4 bölümlü form)
}
```

---

### 7.6 `app/admin/products/page.tsx` — Admin Moderasyon Paneli

**Görev:** `status = 'pending'` ürünleri listeler. Her ürün için "Onayla" ve "Reddet" butonları.

**Teknik Spesifikasyon:**

```typescript
// Server component: sadece admin rolüne izin ver
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import pool from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminProductActions from './AdminProductActions'; // 'use client'

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') redirect('/');

  const [pending]: any = await pool.query(
    "SELECT p.*, u.name as vendor_name FROM products p JOIN users u ON p.vendor_id = u.id WHERE p.status = 'pending' ORDER BY p.created_at DESC"
  );

  return (
    <main className="pt-20 max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-black mb-8">Admin — Ürün Onay Paneli</h1>
      <div className="space-y-4">
        {pending.map((product: any) => (
          <div key={product.id} className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold">{product.title}</h3>
              <p className="text-zinc-400 text-sm">{product.vendor_name} · {product.category}</p>
            </div>
            <AdminProductActions productId={product.id} slug={product.slug} />
          </div>
        ))}
        {pending.length === 0 && (
          <p className="text-zinc-500 text-center py-20">Bekleyen ürün yok.</p>
        )}
      </div>
    </main>
  );
}
```

**`AdminProductActions` (Client Component):**

```typescript
'use client';
import { useRouter } from 'next/navigation';

export default function AdminProductActions({ productId, slug }: { productId: number; slug: string }) {
  const router = useRouter();

  const updateStatus = async (status: 'approved' | 'rejected') => {
    await fetch(`/api/products/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  };

  return (
    <div className="flex gap-3">
      <button onClick={() => updateStatus('approved')} className="bg-green-500 text-black font-bold px-4 py-2 rounded-xl text-sm">
        Onayla ✓
      </button>
      <button onClick={() => updateStatus('rejected')} className="bg-red-500/20 text-red-400 font-bold px-4 py-2 rounded-xl text-sm">
        Reddet ✗
      </button>
    </div>
  );
}
```

---

### 7.7 `app/profile/page.tsx` — Profil Sayfası

**Görsel Analizi (Image 6):**
- Üstte `HESAP PROFİLİ • SATICI / ADMİN` etiketi (`text-xs tracking-widest text-zinc-500`)
- Kullanıcı adı büyük (`font-black text-3xl`), altında email (`text-zinc-400`)
- Kartın tamamı `bg-zinc-900 rounded-2xl border border-zinc-800`
- "Tüm Müşteri Siparişleri" başlığı
- Sipariş yoksa `bg-zinc-900 rounded-2xl` boş durum kartı: "Henüz herhangi bir sipariş bulunmuyor."

**Rol Bazlı İçerik:**
- `role === 'vendor'` veya `role === 'admin'`: ek olarak kendi ürünleri listesi
- `role === 'admin'`: admin paneline link

---

### 7.8 `app/login/page.tsx` ve `app/register/page.tsx`

**Ortak Tasarım:** Sayfa ortalanmış, `min-h-screen flex items-center justify-center`.
Tek kart: `bg-zinc-900 rounded-2xl border border-zinc-800 p-8 w-full max-w-md`

**Login:** email + password input, `signIn('credentials', {...})` çağrısı.
**Register:** name + email + password, `POST /api/auth/register`.

---

## 8. API Route Spesifikasyonları

### `app/api/products/route.ts`

```typescript
// GET: Onaylı ürünleri listeler (kategori/sort query param destekli)
// POST: Yeni ürün ekler (vendor_id, tüm form alanları)
//   - slug otomatik üretilir: title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')
//   - status = 'pending' ile kaydedilir
//   - admin_notifications tablosuna bildirim eklenir
//   - product_tiers ayrıca eklenir (transaction içinde)
```

### `app/api/products/[slug]/route.ts`

```typescript
// GET: Tek ürünü getirir (tiers dahil JOIN)
// PATCH: Admin tarafından status güncelleme: { status: 'approved' | 'rejected' }
```

### `app/api/auth/register/route.ts`

```typescript
// POST: { name, email, password }
// bcrypt.hash(password, 12) → users tablosuna ekle, varsayılan role = 'user'
```

### `app/api/orders/route.ts`

```typescript
// POST: { user_id, product_id, tier_id, amount }
// Şimdilik status = 'completed' (iyzico entegrasyonu roadmap)
// GET: session'dan user_id ile kullanıcının siparişleri
```

### `app/api/admin/notifications/route.ts`

```typescript
// GET: admin_notifications tablosundan okunmamış (is_read = 0) bildirimleri döner
// PATCH: { id } ile is_read = 1 günceller
```

### `app/api/messages/route.ts`

```typescript
// GET: ?with={userId} ile iki kullanıcı arasındaki mesajlar
// POST: { sender_id, receiver_id, message } yeni mesaj ekler
```

---

## 9. `src/components/ChatModal.tsx` — Concierge Canlı Destek

**Görev:** Ürün detay sayfasından tetiklenen, satıcı ile alıcı arasında anlık mesajlaşma modali.

```typescript
'use client';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorId: number;
  productTitle: string;
}

// Mesajlar /api/messages?with={vendorId} ile çekilir
// Polling: useEffect + setInterval(3000) veya WebSocket (roadmap)
// Input: text input + "Gönder" butonu
// Modal: fixed inset-0 bg-black/60 backdrop-blur, ortalanmış kart
```

---

## 10. Çok Satıcılı (Multi-Vendor) İş Akışı

```
Satıcı          Admin             Veritabanı
  │                │                  │
  ├─ POST /api/products ──────────────► products (status='pending')
  │                │                  ├── admin_notifications (yeni kayıt)
  │                │                  │
  │    ◄── Bildirim Badge (navbar) ───┤
  │                │                  │
  │           İncele & Karar          │
  │                ├─ PATCH (approved) ► products.status = 'approved'
  │                └─ PATCH (rejected) ► products.status = 'rejected'
  │                                   │
  └─────────────────── Ürün ana sayfada görünür (sadece approved)
```

**Kural:** `app/page.tsx` ve `app/products/page.tsx` her zaman `WHERE status = 'approved'` filtresi kullanır.

---

## 11. Ortam Değişkenleri (`.env`)

```env
# Veritabanı (Supabase Postgres bağlantı dizesi)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres

# NextAuth
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Spline (opsiyonel, public URL)
NEXT_PUBLIC_SPLINE_URL=https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode
```

---

## 12. `next.config.ts`

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Base64 görüntüler için harici domain gerekmez
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  // Spline için büyük paket boyutu uyarısını bastır
  experimental: {
    optimizePackageImports: ['@splinetool/react-spline'],
  },
};

export default nextConfig;
```

---

## 13. `package.json` — Bağımlılıklar

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "next-auth": "^4.24.0",
    "bcryptjs": "^2.4.3",
    "pg": "^8.22.0",
    "@splinetool/react-spline": "^2.2.6",
    "@splinetool/runtime": "^0.9.490"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.0.0",
    "@types/pg": "^8.20.0",
    "@types/react": "^18.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## 14. Roadmap — iyzico Ödeme Entegrasyonu

Şu an siparişler manuel `status = 'completed'` ile işaretlenmektedir. Gelecek aşamada:

1. `app/api/orders/route.ts` içinde iyzico `initialize` endpoint'i çağrılacak
2. Kart kaydetme için iyzico Card Storage API (`cardUserKey`, `cardToken`) kullanılacak
3. Tek tıkla ödeme için kayıtlı kart token'ı ile `charge` işlemi yapılacak
4. Webhook ile sipariş status'u güncellenecek (`pending → completed`)

---

## 15. Cursor AI için Hızlı Görev Listesi

Aşağıdaki dosyalar henüz **eksik veya iskelet** halindedir; bu spesifikasyona göre kodlanmalıdır:

- [ ] `app/products/[slug]/page.tsx` — Ürün detay (galeri, video, tabs, sticky tier kartı)
- [ ] `app/products/[slug]/ProductDetailClient.tsx` — Client bileşeni
- [ ] `app/products/page.tsx` — Kategori filtreleme sayfası
- [ ] `app/admin/products/page.tsx` — Admin moderasyon paneli
- [ ] `app/admin/products/AdminProductActions.tsx` — Approve/Reject butonları
- [ ] `src/components/ChatModal.tsx` — Concierge mesajlaşma modali
- [ ] `app/api/products/route.ts` — POST (tier transaction dahil) & GET
- [ ] `app/api/products/[slug]/route.ts` — GET & PATCH
- [ ] `app/api/orders/route.ts` — Sipariş oluşturma & listeleme
- [ ] `app/api/messages/route.ts` — Mesajlaşma API
- [ ] `app/api/admin/notifications/route.ts` — Admin bildirim API
- [ ] `app/login/page.tsx` ve `app/register/page.tsx`

---

*Bu doküman BlackNOOK projesinin tek referans kaynağıdır. Tüm kod üretiminde dosya yolları, Tailwind sınıfları ve veritabanı şeması bu dokümana uygun olmalıdır.*
