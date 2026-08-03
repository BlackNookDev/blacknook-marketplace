-- Eşleşme talepleri (profil > aktif talepler)
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
