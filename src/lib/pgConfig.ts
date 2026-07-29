import type { PoolConfig } from 'pg';

/** TablePlus ile aynı alanlar — tek DATABASE_URL yok. */
export function getPgConfig(): PoolConfig {
  let host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT || 5432);
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD ?? '';
  const database = process.env.DB_NAME || 'postgres';
  const socketOverride = process.env.DB_SOCKET?.trim();

  if (socketOverride) {
    host = socketOverride;
  } else if (
    process.platform === 'darwin' &&
    !password &&
    (host === 'localhost' || host === '127.0.0.1')
  ) {
    // Postgres.app: TCP from IDE (Cursor) often requires a password; Unix socket in /tmp works locally.
    host = '/tmp';
  }

  const isLocalHost =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '/tmp' ||
    host.startsWith('/');

  const sslFlag = process.env.DB_SSL?.toLowerCase();
  let ssl: PoolConfig['ssl'];
  if (sslFlag === 'true') {
    ssl = { rejectUnauthorized: false };
  } else if (sslFlag === 'false') {
    ssl = undefined;
  } else {
    ssl = isLocalHost ? undefined : { rejectUnauthorized: false };
  }

  return { host, port, user, password, database, ssl };
}
