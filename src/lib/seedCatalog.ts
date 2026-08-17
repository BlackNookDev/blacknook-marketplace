import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import pool from '@/lib/db';
import { SERVICES } from '../../lib/data';

const CATALOG_EMAIL = 'catalog@blacknook.com';
const CATALOG_NAME = 'BlackNook';

let seedPromise: Promise<void> | null = null;

async function ensureCatalogVendor(): Promise<number> {
  const [rows]: any = await pool.query(
    'SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1',
    [CATALOG_EMAIL]
  );
  if (rows?.[0]?.id) {
    const id = Number(rows[0].id);
    await pool.query('UPDATE users SET name = ? WHERE id = ? AND name <> ?', [
      CATALOG_NAME,
      id,
      CATALOG_NAME,
    ]);
    return id;
  }

  const hash = await bcrypt.hash(`${randomUUID()}-${Date.now()}`, 10);
  const [result]: any = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES (?, ?, ?, 'vendor')`,
    [CATALOG_NAME, CATALOG_EMAIL, hash]
  );
  return Number(result.insertId);
}

async function runSeed() {
  await pool.query(
    `ALTER TABLE products ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE`
  );

  const vendorId = await ensureCatalogVendor();
  const [slugRows]: any = await pool.query('SELECT slug FROM products');
  const existing = new Set((slugRows || []).map((row: { slug: string }) => String(row.slug)));

  for (const service of SERVICES) {
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
      if (listingType === 'saas' || listingType === 'micro-saas') {
        try {
          await pool.query(
            `UPDATE products
             SET listing_data = COALESCE(listing_data, '{}'::jsonb) || CAST(? AS jsonb),
                 icon_image = COALESCE(NULLIF(icon_image, ''), ?),
                 verified = TRUE
             WHERE slug = ?`,
            [JSON.stringify({ listingType, catalogIcon: service.icon }), service.icon, service.slug]
          );
        } catch (error) {
          console.warn('[seedCatalog] Güncellenemedi:', service.slug, error);
        }
      }
      continue;
    }

    try {
      await pool.query(
        `INSERT INTO products
          (vendor_id, title, slug, category, short_description, long_description,
           features_list, listing_data, icon_image, brand_color, status, verified)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', TRUE)`,
        [
          vendorId,
          service.name,
          service.slug,
          service.category,
          service.description,
          service.about,
          JSON.stringify(service.features),
          JSON.stringify(listing),
          service.icon,
          service.brandColor,
        ]
      );
      existing.add(service.slug);
    } catch (error) {
      console.warn('[seedCatalog] Atlandı:', service.slug, error);
    }
  }
}

/** Statik katalog servislerini BlackNook hesabıyla products tablosuna yazar. Tekrar çalışınca mevcut slug’lara dokunmaz. */
export function seedOfficialCatalog(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      console.error('[seedCatalog] Başarısız:', error);
    });
  }
  return seedPromise;
}
