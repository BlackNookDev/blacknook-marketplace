const { randomUUID } = require('crypto');
const { spawnSync } = require('child_process');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Client } = require('pg');
const { resolveEnv, getPgConfig } = require('./pgEnv');

const CATALOG_EMAIL = 'catalog@blacknook.com';
const CATALOG_NAME = 'BlackNook';
const ROOT = path.join(__dirname, '..');

function loadServices() {
  const result = spawnSync(
    process.execPath,
    [
      '--experimental-strip-types',
      '--no-warnings',
      '--input-type=module',
      '-e',
      "import { SERVICES } from './lib/data.ts'; process.stdout.write(JSON.stringify(SERVICES))",
    ],
    { cwd: ROOT, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || 'SERVICES okunamadı');
  }
  return JSON.parse(result.stdout);
}

async function ensureCatalogVendor(client) {
  const found = await client.query(
    'SELECT id FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1',
    [CATALOG_EMAIL]
  );
  if (found.rows[0]?.id) {
    const id = Number(found.rows[0].id);
    await client.query('UPDATE users SET name = $1 WHERE id = $2 AND name <> $1', [
      CATALOG_NAME,
      id,
    ]);
    return id;
  }

  const hash = await bcrypt.hash(`${randomUUID()}-${Date.now()}`, 10);
  const inserted = await client.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, 'vendor')
     RETURNING id`,
    [CATALOG_NAME, CATALOG_EMAIL, hash]
  );
  return Number(inserted.rows[0].id);
}

async function main() {
  const services = loadServices();
  const env = resolveEnv();
  const client = new Client(getPgConfig(env));
  await client.connect();

  try {
    await client.query(
      'ALTER TABLE products ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE'
    );
    const vendorId = await ensureCatalogVendor(client);
    const existingRows = await client.query('SELECT slug FROM products');
    const existing = new Set(existingRows.rows.map((row) => String(row.slug)));

    let inserted = 0;
    let updated = 0;

    for (const service of services) {
      const listingType = service.listingType || 'service';
      const listing = {
        productName: service.name,
        listingType,
        category: service.category,
        tagline: service.description,
        usp: service.about,
        tldr: service.useCases,
        catalogIcon: service.icon,
        delivery: 'self-host',
      };

      if (existing.has(service.slug)) {
        await client.query(
          `UPDATE products
           SET listing_data = COALESCE(listing_data, '{}'::jsonb) || $1::jsonb,
               icon_image = COALESCE(NULLIF(icon_image, ''), $2),
               verified = TRUE
           WHERE slug = $3`,
          [JSON.stringify(listing), service.icon, service.slug]
        );
        updated += 1;
        continue;
      }

      await client.query(
        `INSERT INTO products
          (vendor_id, title, slug, category, short_description, long_description,
           features_list, listing_data, icon_image, brand_color, status, verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10, 'approved', TRUE)`,
        [
          vendorId,
          service.name,
          service.slug,
          service.category,
          service.description,
          service.about,
          JSON.stringify(service.features || []),
          JSON.stringify(listing),
          service.icon,
          service.brandColor,
        ]
      );
      existing.add(service.slug);
      inserted += 1;
    }

    const types = await client.query(`
      SELECT COALESCE(listing_data->>'listingType', '(null)') AS listing_type, COUNT(*)::int AS n
      FROM products
      WHERE status = 'approved'
      GROUP BY 1
      ORDER BY n DESC
    `);
    const saas = await client.query(`
      SELECT slug FROM products
      WHERE status = 'approved' AND listing_data->>'listingType' = 'saas'
      ORDER BY title
    `);

    console.log(
      JSON.stringify(
        {
          host: env.DB_HOST,
          database: env.DB_NAME,
          catalog: services.length,
          inserted,
          updated,
          listingTypes: types.rows,
          saasCount: saas.rows.length,
          saasSlugs: saas.rows.map((row) => row.slug),
        },
        null,
        2
      )
    );
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('ERR', error.message);
  process.exit(1);
});
