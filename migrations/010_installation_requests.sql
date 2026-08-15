-- Kurulum talepleri (hesaba bağlı, e-posta yedek kanal)
CREATE TABLE IF NOT EXISTS installation_requests (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  service_slug  VARCHAR(255) NOT NULL,
  service_name  VARCHAR(255) NOT NULL,
  company_name  VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  requirements  TEXT NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'closed', 'cancelled')),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_installation_requests_user
  ON installation_requests (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_installation_requests_email
  ON installation_requests (email);
