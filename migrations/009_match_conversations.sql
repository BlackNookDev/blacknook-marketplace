-- Eşleşme havuzu + konuşmalar (1:1 mesaj)
ALTER TABLE users ADD COLUMN IF NOT EXISTS match_available BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS match_skills VARCHAR(255);

ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS assigned_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS conversation_id INTEGER;

CREATE TABLE IF NOT EXISTS conversations (
  id                SERIAL PRIMARY KEY,
  type              VARCHAR(20) NOT NULL DEFAULT 'match',
  match_request_id  INTEGER REFERENCES match_requests(id) ON DELETE SET NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_read_at    TIMESTAMP,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_user
  ON conversation_participants (user_id);

ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON messages (conversation_id, created_at);

CREATE INDEX IF NOT EXISTS idx_match_requests_assigned
  ON match_requests (assigned_user_id, status);
