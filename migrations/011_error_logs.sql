-- Uygulama hata kayıtları (admin panelinden okunur)
CREATE TABLE IF NOT EXISTS error_logs (
  id          SERIAL PRIMARY KEY,
  source      VARCHAR(120) NOT NULL,
  message     TEXT NOT NULL,
  stack       TEXT,
  detail      TEXT,
  method      VARCHAR(16),
  path        VARCHAR(500),
  user_id     INTEGER,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs (created_at DESC);
