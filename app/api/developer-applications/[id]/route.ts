import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/sessionUser';
import { ensureCriticalSchema } from '@/lib/ensureSchema';
import { rowToApp } from '@/lib/developerApplications';

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
      return NextResponse.json({ error: 'Geçersiz başvuru.' }, { status: 400 });
    }

    const body = await req.json();
    const status = body.status as string;
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Geçersiz durum.' }, { status: 400 });
    }

    const rejectReason =
      status === 'rejected'
        ? String(body.rejectReason || 'Başvuru kriterleri karşılanmadı.').trim()
        : null;

    const [result]: any = await pool.query(
      `UPDATE developer_applications
       SET status = ?, reject_reason = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, rejectReason, user.id, id]
    );
    if (!result.affectedRows) {
      return NextResponse.json({ error: 'Başvuru bulunamadı.' }, { status: 404 });
    }

    const [rows]: any = await pool.query(
      `SELECT d.*, u.email AS user_email, u.name AS user_name
       FROM developer_applications d
       JOIN users u ON u.id = d.user_id
       WHERE d.id = ?`,
      [id]
    );
    const application = rowToApp(rows[0]);

    if (status === 'approved') {
      await pool.query(
        `UPDATE users SET role = 'vendor' WHERE id = ? AND role = 'user'`,
        [application.userId]
      );
      try {
        await pool.query(
          `INSERT INTO user_notifications (user_id, title, body, href, is_read)
           VALUES (?, ?, ?, ?, FALSE)`,
          [
            application.userId,
            'Geliştirici başvurunuz onaylandı',
            'Portal ve ürün ekleme açıldı.',
            '/partners/overview',
          ]
        );
      } catch {
        /* ignore */
      }
    } else if (status === 'rejected') {
      try {
        await pool.query(
          `INSERT INTO user_notifications (user_id, title, body, href, is_read)
           VALUES (?, ?, ?, ?, FALSE)`,
          [
            application.userId,
            'Geliştirici başvurunuz reddedildi',
            rejectReason || 'Başvurunuz şu an onaylanmadı.',
            '/developers/status',
          ]
        );
      } catch {
        /* ignore */
      }
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error('[developer-applications PATCH]', error);
    return NextResponse.json({ error: 'Güncelleme başarısız.' }, { status: 500 });
  }
}
