import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0, items: [] });
    }

    const userId = Number(session.user.id);

    const [sumRows]: any = await pool.query(
      `SELECT COALESCE(SUM(quantity), 0)::int AS count
       FROM cart_items
       WHERE user_id = ?`,
      [userId]
    );
    const count = Number(sumRows?.[0]?.count ?? 0);

    const [rows]: any = await pool.query(
      `SELECT
         c.id,
         c.product_id,
         c.tier_id,
         c.quantity,
         c.created_at,
         p.title AS product_title,
         p.slug AS product_slug
       FROM cart_items c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ?
       ORDER BY c.created_at DESC`,
      [userId]
    );

    const items = (rows || []).map((row: any) => ({
      id: Number(row.id),
      productId: Number(row.product_id),
      tierId: row.tier_id != null ? Number(row.tier_id) : null,
      quantity: Number(row.quantity),
      productName: row.product_title,
      productSlug: row.product_slug,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ count, items });
  } catch (error) {
    console.error('[cart] Listeleme hatası:', error);
    return NextResponse.json({ error: 'Sepet yüklenemedi.' }, { status: 500 });
  }
}
