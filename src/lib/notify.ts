import pool from '@/lib/db';

export async function notifyUser(params: {
  userId: number;
  title: string;
  body: string;
  href: string;
}) {
  try {
    await pool.query(
      `INSERT INTO user_notifications (user_id, title, body, href, is_read)
       VALUES (?, ?, ?, ?, FALSE)`,
      [params.userId, params.title, params.body, params.href]
    );
  } catch (error) {
    console.warn('[notify] Bildirim yazılamadı:', error);
  }
}
