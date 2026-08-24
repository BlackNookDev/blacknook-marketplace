import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/sessionUser';
import { loadTiers, rowToProduct, serializeProduct } from '@/lib/marketplace';
import { ensureCriticalSchema } from '@/lib/ensureSchema';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await ensureCriticalSchema();
    const user = await getSessionUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
    }

    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'Geçersiz ürün.' }, { status: 400 });
    }

    const body = await req.json();
    const status = body.status as string;
    if (!['pending', 'approved', 'rejected', 'unpublished'].includes(status)) {
      return NextResponse.json({ error: 'Geçersiz durum.' }, { status: 400 });
    }
    const rejectReason =
      status === 'rejected'
        ? String(body.rejectReason || 'Eksik bilgi veya politika uyumsuzluğu.').trim()
        : status === 'unpublished'
          ? String(body.rejectReason || 'Yayından kaldırıldı.').trim()
          : null;

    const [result]: any = await pool.query(
      'UPDATE products SET status = ?, reject_reason = ? WHERE id = ?',
      [status, rejectReason, id]
    );
    if (!result.affectedRows) {
      return NextResponse.json({ error: 'Ürün bulunamadı.' }, { status: 404 });
    }

    const [rows]: any = await pool.query(
      `SELECT p.*, u.name AS vendor_name, u.email AS vendor_email
       FROM products p JOIN users u ON u.id = p.vendor_id WHERE p.id = ?`,
      [id]
    );
    const product = rowToProduct(rows[0], await loadTiers(id));

    if (status === 'approved' && product.vendorId) {
      await pool.query(
        `UPDATE users SET role = 'vendor' WHERE id = ? AND role = 'user'`,
        [product.vendorId]
      );
    }

    try {
      await pool.query(
        `INSERT INTO user_notifications (user_id, title, body, href, is_read)
         VALUES (?, ?, ?, ?, FALSE)`,
        [
          product.vendorId,
          status === 'approved'
            ? 'Ürününüz yayınlandı'
            : status === 'unpublished'
              ? 'Ürününüz yayından alındı'
              : 'Ürün başvurunuz güncellendi',
          status === 'approved'
            ? `${product.title} ekosistemde önde sergileniyor.`
            : status === 'unpublished'
              ? `${product.title} katalogdan kaldırıldı.`
              : status === 'rejected'
                ? rejectReason
                : `${product.title} durumu: ${status}`,
          status === 'approved' ? `/service/${product.slug}` : '/partners/listings',
        ]
      );
    } catch (notifError) {
      console.warn('[products] Bildirim yazılamadı:', notifError);
    }

    return NextResponse.json({ product: serializeProduct(product) });
  } catch (error) {
    console.error('[products] Güncelleme hatası:', error);
    return NextResponse.json({ error: 'Ürün güncellenemedi.' }, { status: 500 });
  }
}
