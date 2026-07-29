import { Pool, type PoolClient } from 'pg';
import { getPgConfig } from './pgConfig';

// Postgres bağlantı havuzu (.env: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME).
// mysql2 uyumluluk katmanı — rota dosyalarında ek değişiklik gerekmez.

const pool = new Pool(getPgConfig());

interface MysqlLikeResult {
  affectedRows: number;
  insertId?: number;
  [key: string]: any;
}

function isSelectQuery(sql: string) {
  const normalized = sql.trim().toLowerCase();
  return normalized.startsWith('select') || normalized.startsWith('with');
}

/**
 * mysql2 tarzı "?" placeholder'larını Postgres'in "$1, $2, ..." placeholder'larına çevirir.
 * Bir parametre dizi (array) ise -- örn. `WHERE id IN (?)` -- onu `($1, $2, $3)` şeklinde açar.
 * INSERT sorgularına, mysql2'nin `insertId` davranışını taklit edebilmek için otomatik olarak
 * `RETURNING id` ekler (zaten yoksa).
 */
function buildPgQuery(sql: string, params: any[] = []) {
  let paramIndex = 0;
  let placeholderCount = 0;
  const values: any[] = [];

  let text = sql.replace(/\?/g, () => {
    const value = params[paramIndex++];
    if (Array.isArray(value)) {
      const placeholders = value.map(() => `$${++placeholderCount}`).join(', ');
      values.push(...value);
      return `(${placeholders})`;
    }
    placeholderCount += 1;
    values.push(value === undefined ? null : value);
    return `$${placeholderCount}`;
  });

  const lower = text.trim().toLowerCase();
  if (lower.startsWith('insert') && !lower.includes('returning')) {
    text = `${text.trimEnd()} RETURNING id`;
  }

  return { text, values };
}

async function runQuery(
  executor: { query: (text: string, values: any[]) => Promise<any> },
  sql: string,
  params?: any[]
): Promise<[any, any]> {
  const { text, values } = buildPgQuery(sql, params || []);
  const result = await executor.query(text, values);

  if (isSelectQuery(sql)) {
    return [result.rows, result.fields];
  }

  const resultLike: MysqlLikeResult = {
    affectedRows: result.rowCount ?? 0,
    ...(result.rows?.[0] || {}),
  };
  if (result.rows?.[0]?.id !== undefined) {
    resultLike.insertId = result.rows[0].id;
  }

  return [resultLike, result.fields];
}

interface MysqlLikeConnection {
  query: (sql: string, params?: any[]) => Promise<[any, any]>;
  beginTransaction: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  release: () => void;
}

const db = {
  query: (sql: string, params?: any[]) => runQuery(pool, sql, params),

  async getConnection(): Promise<MysqlLikeConnection> {
    const client: PoolClient = await pool.connect();
    return {
      query: (sql: string, params?: any[]) => runQuery(client, sql, params),
      beginTransaction: async () => {
        await client.query('BEGIN');
      },
      commit: async () => {
        await client.query('COMMIT');
      },
      rollback: async () => {
        await client.query('ROLLBACK');
      },
      release: () => client.release(),
    };
  },
};

export default db;
