import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ notifications: [], unread: 0 });
    }

    const userId = Number(session.user.id);
    const [rows]: any = await pool.query(
      `SELECT id, title, body, href, is_read, created_at
       FROM user_notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 40`,
      [userId]
    );

    const notifications = (rows || []).map((row: any) => ({
      id: Number(row.id),
      title: row.title,
      body: row.body || '',
      href: row.href || '/account/requests',
      isRead: Boolean(row.is_read),
      createdAt: row.created_at,
    }));

    const unread = notifications.filter((n: { isRead: boolean }) => !n.isRead).length;

    return NextResponse.json({ notifications, unread });
  } catch (error) {
    console.error('[notifications] Listeleme hatası:', error);
    return NextResponse.json({ error: 'Bildirimler yüklenemedi.' }, { status: 500 });
  }
}

/** Panel açılınca tüm okunmamışları okundu yap */
export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const userId = Number(session.user.id);
    await pool.query(
      `UPDATE user_notifications SET is_read = TRUE
       WHERE user_id = ? AND is_read = FALSE`,
      [userId]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[notifications] Okundu güncelleme hatası:', error);
    return NextResponse.json({ error: 'Bildirimler güncellenemedi.' }, { status: 500 });
  }
}
