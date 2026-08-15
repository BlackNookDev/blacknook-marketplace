import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/sessionUser';
import { normalizeListingDraft, type ListingDraft } from '@/lib/listingDraft';

export const dynamic = 'force-dynamic';

const MAX_JSON_CHARS = 500_000;

function parseStoredDraft(raw: unknown): ListingDraft | null {
  if (!raw) return null;
  if (typeof raw === 'string') {
    try {
      return normalizeListingDraft(JSON.parse(raw) as Partial<ListingDraft>);
    } catch {
      return null;
    }
  }
  if (typeof raw === 'object') {
    return normalizeListingDraft(raw as Partial<ListingDraft>);
  }
  return null;
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const [rows]: any = await pool.query(
      'SELECT data, updated_at FROM listing_drafts WHERE user_id = ?',
      [user.id]
    );
    const row = rows?.[0];
    if (!row) {
      return NextResponse.json({ draft: null });
    }

    return NextResponse.json({
      draft: parseStoredDraft(row.data),
      updatedAt: row.updated_at,
    });
  } catch (error) {
    console.error('[listing-draft] Okuma hatası:', error);
    return NextResponse.json({ error: 'Taslak yüklenemedi.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const listing = body.listing as Partial<ListingDraft> | undefined;
    if (!listing || typeof listing !== 'object') {
      return NextResponse.json({ error: 'Taslak bilgileri eksik.' }, { status: 400 });
    }

    const draft = normalizeListingDraft({
      ...listing,
      updatedAt: new Date().toISOString(),
    });
    const encoded = JSON.stringify(draft);
    if (encoded.length > MAX_JSON_CHARS) {
      return NextResponse.json({ error: 'Taslak çok büyük. Görselleri yeniden yükleyin.' }, { status: 413 });
    }

    await pool.query(
      `INSERT INTO listing_drafts (user_id, data, updated_at)
       VALUES (?, ?::jsonb, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id) DO UPDATE
         SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP
       RETURNING user_id`,
      [user.id, encoded]
    );

    return NextResponse.json({ ok: true, updatedAt: draft.updatedAt });
  } catch (error) {
    console.error('[listing-draft] Kayıt hatası:', error);
    return NextResponse.json({ error: 'Taslak kaydedilemedi.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    await pool.query('DELETE FROM listing_drafts WHERE user_id = ?', [user.id]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[listing-draft] Silme hatası:', error);
    return NextResponse.json({ error: 'Taslak silinemedi.' }, { status: 500 });
  }
}
