import pool from '@/lib/db';
import { seedOfficialCatalog } from '@/lib/seedCatalog';

const CRITICAL_STATEMENTS = [
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS match_available BOOLEAN DEFAULT FALSE`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS match_skills VARCHAR(255)`,
  `ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS assigned_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL`,
  `ALTER TABLE match_requests ADD COLUMN IF NOT EXISTS conversation_id INTEGER`,
  `CREATE TABLE IF NOT EXISTS conversations (
     id SERIAL PRIMARY KEY,
     type VARCHAR(20) NOT NULL DEFAULT 'match',
     match_request_id INTEGER REFERENCES match_requests(id) ON DELETE SET NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   )`,
  `CREATE TABLE IF NOT EXISTS conversation_participants (
     conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     last_read_at TIMESTAMP,
     PRIMARY KEY (conversation_id, user_id)
   )`,
  `CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants (user_id)`,
  `ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE`,
  `CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages (conversation_id, created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_match_requests_assigned ON match_requests (assigned_user_id, status)`,
  `CREATE TABLE IF NOT EXISTS installation_requests (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
     service_slug VARCHAR(255) NOT NULL,
     service_name VARCHAR(255) NOT NULL,
     company_name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     requirements TEXT NOT NULL,
     status VARCHAR(20) NOT NULL DEFAULT 'active'
       CHECK (status IN ('active', 'closed', 'cancelled')),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   )`,
  `CREATE INDEX IF NOT EXISTS idx_installation_requests_user ON installation_requests (user_id, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_installation_requests_email ON installation_requests (email)`,
  `CREATE TABLE IF NOT EXISTS error_logs (
     id SERIAL PRIMARY KEY,
     source VARCHAR(120) NOT NULL,
     message TEXT NOT NULL,
     stack TEXT,
     detail TEXT,
     method VARCHAR(16),
     path VARCHAR(500),
     user_id INTEGER,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   )`,
  `CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs (created_at DESC)`,
  `DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'products'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%status%'
  LOOP
    EXECUTE format('ALTER TABLE products DROP CONSTRAINT IF EXISTS %I', r.conname);
  END LOOP;
  ALTER TABLE products
    ADD CONSTRAINT products_status_check
    CHECK (status IN ('pending','approved','rejected','unpublished'));
END $$`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE`,
];

let ensurePromise: Promise<void> | null = null;

async function runCriticalStatements() {
  for (const sql of CRITICAL_STATEMENTS) {
    try {
      await pool.query(sql);
    } catch (error) {
      const err = error as { message?: string; code?: string };
      console.error('[ensureSchema] SQL hatası:', err.code || '', err.message || error);
    }
  }
  await seedOfficialCatalog();
}

/** Eksik kolon/tabloyu idempotent tamamlar. Migrate başarısız olsa bile API ayağa kalkınca şema toparlanır. */
export function ensureCriticalSchema(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = runCriticalStatements().catch((error) => {
      ensurePromise = null;
      console.error('[ensureSchema] Başarısız:', error);
    });
  }
  return ensurePromise;
}

export type SchemaCheck = {
  ok: boolean;
  missing: string[];
};

export async function checkRequiredSchema(): Promise<SchemaCheck> {
  const required = [
    { kind: 'column', table: 'users', column: 'match_available' },
    { kind: 'column', table: 'users', column: 'match_skills' },
    { kind: 'column', table: 'match_requests', column: 'assigned_user_id' },
    { kind: 'column', table: 'match_requests', column: 'conversation_id' },
    { kind: 'table', table: 'conversations' },
    { kind: 'table', table: 'conversation_participants' },
    { kind: 'table', table: 'installation_requests' },
    { kind: 'table', table: 'error_logs' },
    { kind: 'column', table: 'products', column: 'verified' },
  ] as const;

  const missing: string[] = [];

  try {
    const [tables]: any = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
    );
    const tableSet = new Set((tables || []).map((row: any) => String(row.table_name)));

    const [columns]: any = await pool.query(
      `SELECT table_name, column_name
       FROM information_schema.columns
       WHERE table_schema = 'public'`
    );
    const columnSet = new Set(
      (columns || []).map((row: any) => `${row.table_name}.${row.column_name}`)
    );

    for (const item of required) {
      if (item.kind === 'table') {
        if (!tableSet.has(item.table)) missing.push(item.table);
      } else if (!columnSet.has(`${item.table}.${item.column}`)) {
        missing.push(`${item.table}.${item.column}`);
      }
    }
  } catch (error) {
    const err = error as { message?: string };
    missing.push(`schema_check_failed: ${err.message || 'unknown'}`);
  }

  return { ok: missing.length === 0, missing };
}
