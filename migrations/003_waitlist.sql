-- Waitlist (hero e-posta toplama)
-- Kullanım: node scripts/run-migration.js migrations/003_waitlist.sql

CREATE TABLE IF NOT EXISTS waitlist_signups (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
