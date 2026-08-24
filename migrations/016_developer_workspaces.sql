-- developer_workspaces: Blacknook kullanıcı ↔ Coder v2 workspace eşlemesi
CREATE TABLE IF NOT EXISTS developer_workspaces (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_name VARCHAR(64) NOT NULL DEFAULT 'default',
  coder_workspace_id VARCHAR(64) NOT NULL,
  coder_workspace_name VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  access_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, project_name)
);

CREATE INDEX IF NOT EXISTS idx_developer_workspaces_user
  ON developer_workspaces (user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_developer_workspaces_coder
  ON developer_workspaces (coder_workspace_id);
