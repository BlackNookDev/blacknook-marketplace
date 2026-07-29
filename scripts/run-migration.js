const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function loadEnv(envPath) {
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

async function main() {
  const migrationFile = process.argv[2];
  if (!migrationFile) {
    console.error('Kullanım: node scripts/run-migration.js <dosya.sql>');
    process.exit(1);
  }

  const env = loadEnv(path.join(__dirname, '..', '.env'));
  const sql = fs.readFileSync(migrationFile, 'utf-8');

  if (!env.DB_HOST && !env.DB_NAME) {
    console.error('✗ .env dosyasında DB_HOST / DB_NAME (TablePlus alanları) tanımlı değil.');
    process.exit(1);
  }

  const client = new Client(getPgConfig(env));

  await client.connect();
  try {
    console.log(`Bağlanıldı. Dosya çalıştırılıyor: ${migrationFile}`);
    await client.query(sql);
    console.log('✓ SQL dosyası başarıyla uygulandı.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('✗ Hata:', err.message);
  process.exit(1);
});
