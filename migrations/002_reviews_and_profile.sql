-- Migration: Satıcı profil bilgileri (avatar, bio, LinkedIn) ve ürün yorumları
-- Not: Sıfırdan bir Supabase/Postgres kurulumu yapıyorsanız bu dosyaya gerek yoktur;
-- schema.sql zaten bu sütun/tabloları içerir. Bu dosya sadece "avatar/bio/linkedin_url"
-- olmadan oluşturulmuş eski bir Postgres veritabanını güncellemek için saklanır.
-- Kullanım: node scripts/run-migration.js migrations/002_reviews_and_profile.sql

ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255);

CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     INTEGER NOT NULL REFERENCES users(id),
  rating      SMALLINT NOT NULL DEFAULT 5,
  comment     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (product_id, user_id)
);
