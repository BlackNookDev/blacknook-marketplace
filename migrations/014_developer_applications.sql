-- Geliştirici başvuruları (ürün ekleme / portal onayı öncesi)
CREATE TABLE IF NOT EXISTS developer_applications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  website_url VARCHAR(500),
  github_url VARCHAR(500),
  portfolio_url VARCHAR(500),
  skills TEXT,
  about TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reject_reason TEXT,
  reviewed_at TIMESTAMP,
  reviewed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_developer_applications_user_pending
  ON developer_applications (user_id)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_developer_applications_status
  ON developer_applications (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_developer_applications_user
  ON developer_applications (user_id, created_at DESC);
