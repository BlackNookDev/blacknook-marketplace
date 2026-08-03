-- BlackNOOK Digital Marketplace — PostgreSQL (Supabase) Şema
-- Kullanım: Supabase Dashboard > SQL Editor içine yapıştırıp çalıştırın,
-- veya: node scripts/run-migration.js schema.sql

-- Kullanıcılar
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,            -- bcryptjs hash
  role          VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user','vendor','admin')),
  avatar        TEXT,                              -- Base64 encoded profil fotoğrafı
  bio           TEXT,                              -- Kısa özet / hakkında
  linkedin_url  VARCHAR(255),                       -- LinkedIn profil linki
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ürünler
CREATE TABLE IF NOT EXISTS products (
  id                  SERIAL PRIMARY KEY,
  vendor_id           INTEGER NOT NULL REFERENCES users(id),
  title               VARCHAR(255) NOT NULL,
  slug                VARCHAR(255) NOT NULL UNIQUE,
  category            VARCHAR(100) NOT NULL,
  short_description   TEXT,
  long_description    TEXT,                       -- HTML veya Markdown içerik
  cover_image         TEXT,                        -- Base64 encoded string
  gallery_images      TEXT,                        -- JSON array of Base64 strings
  video_url           TEXT,                        -- Base64 encoded MP4/WebM
  features_list       JSONB,                       -- ["Özellik 1", "Özellik 2", ...]
  status              VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ürün Lisans Katmanları (Tiers)
CREATE TABLE IF NOT EXISTS product_tiers (
  id              SERIAL PRIMARY KEY,
  product_id      INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tier_name       VARCHAR(100) NOT NULL,        -- "License Tier 1", "License Tier 2"
  price           DECIMAL(10,2) NOT NULL,       -- Satış fiyatı
  original_price  DECIMAL(10,2),                -- Çizili orijinal fiyat
  features        JSONB                          -- ["Tüm temel özellikler", "1 Kullanıcı erişimi"]
);

-- Siparişler
CREATE TABLE IF NOT EXISTS orders (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  product_id  INTEGER NOT NULL REFERENCES products(id),
  tier_id     INTEGER NOT NULL REFERENCES product_tiers(id),
  amount      DECIMAL(10,2) NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mesajlar
CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  sender_id   INTEGER NOT NULL REFERENCES users(id),
  receiver_id INTEGER NOT NULL REFERENCES users(id),
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Bildirimleri
CREATE TABLE IF NOT EXISTS admin_notifications (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id),
  message     VARCHAR(500) NOT NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ürün Yorumları
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  rating      SMALLINT NOT NULL DEFAULT 5,        -- 1-5 arası yıldız puanı
  comment     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (product_id, user_id)
);

-- Waitlist (ana sayfa e-posta toplama)
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Geliştirici eşleşme talepleri
CREATE TABLE IF NOT EXISTS match_requests (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name        VARCHAR(255),
  email       VARCHAR(255),
  need        TEXT NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'closed', 'cancelled')),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_match_requests_email ON match_requests (email);
CREATE INDEX IF NOT EXISTS idx_match_requests_status ON match_requests (status);
