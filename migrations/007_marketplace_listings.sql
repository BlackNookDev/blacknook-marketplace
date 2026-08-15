-- Partner listing alanları (mevcut products tablosunu genişletir)
ALTER TABLE products ADD COLUMN IF NOT EXISTS listing_data JSONB;
ALTER TABLE products ADD COLUMN IF NOT EXISTS icon_image TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_color VARCHAR(32) DEFAULT '#6366F1';
ALTER TABLE products ADD COLUMN IF NOT EXISTS reject_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_products_status ON products (status, created_at DESC);
