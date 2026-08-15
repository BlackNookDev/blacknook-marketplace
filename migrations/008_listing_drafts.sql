-- Partner ürün formu taslağı (hesaba bağlı, tarayıcıda tutulmaz)
CREATE TABLE IF NOT EXISTS listing_drafts (
  user_id     INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  data        JSONB NOT NULL,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
