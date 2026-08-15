const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');

const DEFAULT_EMAIL = 'admin@blacknook.com';
const DEFAULT_PASSWORD = 'BlacknookAdmin1';
const DEFAULT_NAME = 'Admin';

function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) {
    return {};
  }
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function resolveEnv() {
  const fileEnv = loadEnv(path.join(__dirname, '..', '.env'));
  return { ...fileEnv, ...process.env };
}

function getPgConfig(env) {
  let host = env.DB_HOST || 'localhost';
  const port = Number(env.DB_PORT || 5432);
  const user = env.DB_USER || 'postgres';
  const password = env.DB_PASSWORD ?? '';
  const database = env.DB_NAME || 'postgres';
  const socketOverride = (env.DB_SOCKET || '').trim();

  if (socketOverride) {
    host = socketOverride;
  } else if (
    process.platform === 'darwin' &&
    !password &&
    (host === 'localhost' || host === '127.0.0.1')
  ) {
    host = '/tmp';
  }

  const isLocalHost =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '/tmp' ||
    host.startsWith('/');

  const sslFlag = (env.DB_SSL || '').toLowerCase();
  let ssl;
  if (sslFlag === 'true') ssl = { rejectUnauthorized: false };
  else if (sslFlag === 'false') ssl = undefined;
  else ssl = isLocalHost ? undefined : { rejectUnauthorized: false };

  return { host, port, user, password, database, ssl };
}

async function seedAdmin() {
  const env = resolveEnv();
  const email = String(env.ADMIN_EMAIL || DEFAULT_EMAIL).toLowerCase().trim();
  const password = String(env.ADMIN_PASSWORD || DEFAULT_PASSWORD);
  const name = String(env.ADMIN_NAME || DEFAULT_NAME).trim() || DEFAULT_NAME;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('ADMIN_EMAIL geçersiz.');
  }
  if (password.length < 6) {
    throw new Error('ADMIN_PASSWORD en az 6 karakter olmalı.');
  }

  const client = new Client(getPgConfig(env));
  await client.connect();
  try {
    const { rows } = await client.query(
      'SELECT id, role FROM users WHERE LOWER(email) = $1',
      [email]
    );

    if (rows[0]) {
      if (rows[0].role !== 'admin') {
        await client.query('UPDATE users SET role = $1 WHERE id = $2', ['admin', rows[0].id]);
        console.log(`[seed-admin] Mevcut hesap admin yapıldı: ${email}`);
      } else {
        console.log(`[seed-admin] Admin hesabı zaten var, atlandı: ${email}`);
      }
      return { created: false, email };
    }

    const hash = await bcrypt.hash(password, 12);
    await client.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      [name, email, hash, 'admin']
    );
    console.log(`[seed-admin] Admin hesabı oluşturuldu: ${email}`);
    return { created: true, email };
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  seedAdmin().catch((err) => {
    console.error('[seed-admin] Hata:', err.message);
    process.exit(1);
  });
}

module.exports = { seedAdmin };
