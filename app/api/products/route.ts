import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/sessionUser';
import type { ListingDraft } from '@/lib/listingDraft';
import {
  getAllMarketplaceProducts,
  getApprovedCatalogEntries,
  getProductsForVendor,
  serializeProduct,
  slugifyTitle,
  uniqueProductSlug,
} from '@/lib/marketplace';

function featuresFromDraft(draft: ListingDraft) {
  const fromStories = draft.stories.flatMap((s) =>
    s.bullets.map((b) => b.trim()).filter(Boolean)
  );
  if (fromStories.length) return fromStories;
  return (draft.tldr || []).map((t) => t.trim()).filter(Boolean);
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const mine = url.searchParams.get('mine') === '1';
    const scope = url.searchParams.get('scope');

    if (mine || scope === 'admin') {
      const user = await getSessionUser();
      if (!user) {
        return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
      }
      if (scope === 'admin') {
        if (user.role !== 'admin') {
          return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
        }
        const products = await getAllMarketplaceProducts();
        return NextResponse.json({ products: products.map(serializeProduct) });
      }
      const products = await getProductsForVendor(user.id);
      return NextResponse.json({ products: products.map(serializeProduct) });
    }

    const catalog = await getApprovedCatalogEntries();
    return NextResponse.json({ products: catalog });
  } catch (error) {
    console.error('[products] Listeleme hatası:', error);
    return NextResponse.json({ error: 'Ürünler yüklenemedi.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Ürün göndermek için giriş yapın.' }, { status: 401 });
    }

    const body = await req.json();
    const listing = body.listing as ListingDraft | undefined;
    if (!listing || typeof listing !== 'object') {
      return NextResponse.json({ error: 'Ürün bilgileri eksik.' }, { status: 400 });
    }

    const title = String(listing.productName || '').trim();
    if (title.length < 2) {
      return NextResponse.json({ error: 'Ürün adı gerekli.' }, { status: 400 });
    }

    const category = String(listing.category || 'Diğer').trim();
    const shortDescription = String(listing.tagline || '').trim();
    const longDescription = String(listing.usp || listing.founderNarrative || '').trim();
    const features = featuresFromDraft(listing);
    const coverImage = listing.heroImageData || '';
    const iconImage = listing.companyIconData || '';
    const gallery = (listing.screenshotData || []).filter(Boolean);
    const slug = await uniqueProductSlug(slugifyTitle(title));
    const status = user.role === 'admin' ? 'approved' : 'pending';

    const [result]: any = await pool.query(
      `INSERT INTO products
        (vendor_id, title, slug, category, short_description, long_description,
         cover_image, gallery_images, features_list, listing_data, icon_image, brand_color, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        title,
        slug,
        category,
        shortDescription,
        longDescription,
        coverImage || null,
        JSON.stringify(gallery),
        JSON.stringify(features),
        JSON.stringify(listing),
        iconImage || null,
        '#6366F1',
        status,
      ]
    );

    const productId = Number(result.insertId);
    const tiers = Array.isArray(listing.tiers) ? listing.tiers : [];
    for (const tier of tiers) {
      const name = String(tier.name || '').trim();
      if (!name) continue;
      const price = Number(tier.price) || 0;
      const idx = listing.tiers.findIndex((t) => t.id === tier.id);
      const tierFeatures = (listing.matrix || [])
        .filter((row) => !row.inAllPlans)
        .map((row) => `${row.label}: ${row.values[idx] ?? '—'}`);
      await pool.query(
        'INSERT INTO product_tiers (product_id, tier_name, price, original_price, features) VALUES (?, ?, ?, ?, ?)',
        [productId, name, price, price ? Math.round(price * 3) : null, JSON.stringify(tierFeatures)]
      );
    }

    try {
      await pool.query(
        `INSERT INTO user_notifications (user_id, title, body, href, is_read)
         VALUES (?, ?, ?, ?, FALSE)`,
        [
          user.id,
          status === 'approved' ? 'Ürününüz yayınlandı' : 'Ürününüz incelemeye alındı',
          status === 'approved'
            ? `${title} pazaryerinde öne çıkan bölümde yayında.`
            : `${title} admin onayından sonra katalogda görünecek.`,
          status === 'approved' ? `/service/${slug}` : '/partners/listings',
        ]
      );
    } catch (notifError) {
      console.warn('[products] Bildirim yazılamadı:', notifError);
    }

    return NextResponse.json({ id: productId, slug, status }, { status: 201 });
  } catch (error) {
    console.error('[products] Oluşturma hatası:', error);
    return NextResponse.json({ error: 'Ürün kaydedilemedi.' }, { status: 500 });
  }
}
