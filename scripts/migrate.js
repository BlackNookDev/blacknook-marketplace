const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { resolveEnv, getPgConfig } = require('./pgEnv');

async function migrate() {
  const env = resolveEnv();
  const client = new Client(getPgConfig(env));
  await client.connect();

  try {
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('[migrate] schema.sql uygulanıyor…');
      await client.query(fs.readFileSync(schemaPath, 'utf8'));
    }

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const dir = path.join(__dirname, '..', 'migrations');
    if (!fs.existsSync(dir)) {
      console.log('[migrate] migrations/ yok, atlandı.');
      return;
    }

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
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (id) VALUES ($1)', [file]);
      console.log(`[migrate] uygulandı: ${file}`);
    }

    console.log('[migrate] tamam.');
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  migrate().catch((err) => {
    console.error('[migrate] Hata:', err.message);
    process.exit(1);
  });
}

module.exports = { migrate };
