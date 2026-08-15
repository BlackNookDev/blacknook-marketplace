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

export async function notifyAdmins(params: {
  title: string;
  body: string;
  href: string;
  exceptUserId?: number;
}) {
  try {
    const [rows]: any = await pool.query(`SELECT id FROM users WHERE role = 'admin'`);
    const ids = (rows || [])
      .map((row: { id: unknown }) => Number(row.id))
      .filter(
        (id: number) => Number.isFinite(id) && id > 0 && id !== params.exceptUserId
      );
    await Promise.all(
      ids.map((userId: number) =>
        notifyUser({
          userId,
          title: params.title,
          body: params.body,
          href: params.href,
        })
      )
    );
  } catch (error) {
    console.warn('[notify] Admin bildirimi yazılamadı:', error);
  }
}

