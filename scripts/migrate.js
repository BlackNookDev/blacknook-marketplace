const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { resolveEnv, getPgConfig } = require('./pgEnv');

function logMigrateError(label, err) {
  console.error(`[migrate] ${label}:`, err && err.message ? err.message : err);
  if (err && err.code) console.error('[migrate] code:', err.code);
  if (err && err.detail) console.error('[migrate] detail:', err.detail);
  if (err && err.hint) console.error('[migrate] hint:', err.hint);
  if (err && err.stack) console.error(err.stack);
}

async function migrate() {
  const env = resolveEnv();
  const client = new Client(getPgConfig(env));
  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const dir = path.join(__dirname, '..', 'migrations');
    if (fs.existsSync(dir)) {
      const files = fs
        .readdirSync(dir)
        .filter((file) => file.endsWith('.sql'))
        .sort();

      for (const file of files) {
        const { rows } = await client.query('SELECT id FROM schema_migrations WHERE id = $1', [
          file,
        ]);
        if (rows[0]) {
          console.log(`[migrate] atlandı: ${file}`);
          continue;
        }

        const sql = fs.readFileSync(path.join(dir, file), 'utf8');
        try {
          await client.query(sql);
          await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [file]);
          console.log(`[migrate] uygulandı: ${file}`);
        } catch (err) {
          logMigrateError(`${file} başarısız`, err);
          throw err;
        }
      }
    } else {
      console.log('[migrate] migrations/ yok, atlandı.');
    }

    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('[migrate] schema.sql uygulanıyor…');
      try {
        await client.query(fs.readFileSync(schemaPath, 'utf8'));
        console.log('[migrate] schema.sql tamam.');
      } catch (err) {
        logMigrateError('schema.sql başarısız (incremental migrate zaten işlendi)', err);
      }
    }

    console.log('[migrate] tamam.');
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  migrate().catch((err) => {
    logMigrateError('Hata', err);
    process.exit(1);
  });
}

module.exports = { migrate };
