import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import pool from '@/lib/db';
import { matchTeamEmail, matchUserEmail } from '@/lib/emailTemplates';
import { getMatchMailTo, sendPlatformEmail, sendUserEmail } from '@/lib/mail';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function resolveUserId(email: string | null): Promise<number | null> {
  if (!email) return null;
  try {
    const [rows]: any = await pool.query('SELECT id FROM users WHERE email = ?', [
      email.toLowerCase(),
    ]);
    return rows[0]?.id != null ? Number(rows[0].id) : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email?.trim().toLowerCase() || '';

    if (!sessionEmail || !isValidEmail(sessionEmail)) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get('status')?.trim() || 'active';
    const params: any[] = [sessionEmail];
    let sql =
      'SELECT id, name, email, need, status, created_at FROM match_requests WHERE LOWER(email) = ?';

    if (status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT 50';

    const [rows]: any = await pool.query(sql, params);

    return NextResponse.json({
      requests: (rows || []).map((row: any) => ({
        id: Number(row.id),
        name: row.name,
        email: row.email,
        need: row.need,
        status: row.status,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error('[match-request] Listeleme hatası:', error);
    return NextResponse.json({ error: 'Talepler yüklenemedi.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const need = typeof body.need === 'string' ? body.need.trim() : '';

    if (!need) {
      return NextResponse.json({ error: 'İhtiyacınızı kısaca yazın.' }, { status: 400 });
    }

    if (need.length > 4000) {
      return NextResponse.json({ error: 'Talep metni çok uzun.' }, { status: 400 });
    }

    const bodyName = typeof body.name === 'string' ? body.name.trim() : '';
    const bodyEmail = typeof body.email === 'string' ? body.email.trim() : '';

    const name = session?.user?.name?.trim() || bodyName || 'İsimsiz kullanıcı';
    const emailRaw =
      session?.user?.email?.trim() ||
      (bodyEmail && isValidEmail(bodyEmail) ? bodyEmail : '');
    const email = emailRaw ? emailRaw.toLowerCase() : '';

    const userId = await resolveUserId(email || null);

    let insertId: number | undefined;
    try {
      const [result]: any = await pool.query(
        'INSERT INTO match_requests (user_id, name, email, need, status) VALUES (?, ?, ?, ?, ?)',
        [userId, name, email || null, need, 'active']
      );
      if (result.insertId != null) insertId = Number(result.insertId);
    } catch (dbError) {
      console.error('[match-request] DB kayıt hatası:', dbError);
      return NextResponse.json(
        { error: 'Talep kaydedilemedi. Lütfen tekrar deneyin.' },
        { status: 500 }
      );
    }

    if (userId != null) {
      try {
        await pool.query(
          `INSERT INTO user_notifications (user_id, title, body, href, is_read)
           VALUES (?, ?, ?, ?, FALSE)`,
          [
            userId,
            'Eşleşme talebiniz alındı',
            need.length > 120 ? `${need.slice(0, 117)}…` : need,
            '/account/requests',
          ]
        );
      } catch (notifError) {
        console.error('[match-request] Bildirim kaydı hatası:', notifError);
      }
    }

    const teamMail = matchTeamEmail({
      name,
      email,
      need,
      requestId: insertId,
    });
    const teamResult = await sendPlatformEmail({
      to: getMatchMailTo(),
      replyTo: email || undefined,
      ...teamMail,
    });

    if (!teamResult.ok) {
      console.error('[match-request] Ekip SMTP hatası (talep DB’de):', teamResult.error);
    }

    let userMailed = false;
    if (email) {
      const userMail = matchUserEmail({ name, need, requestId: insertId });
      const userResult = await sendUserEmail({ to: email, ...userMail });
      userMailed = userResult.ok;
      if (!userResult.ok) {
        console.warn('[match-request] Kullanıcı onay maili gönderilemedi:', userResult.error);
      }
    }

    return NextResponse.json({
      ok: true,
      id: insertId,
      mailed: teamResult.ok || userMailed,
    });
  } catch (error) {
    console.error('[match-request] Hata:', error);
    return NextResponse.json(
      { error: 'Talep gönderilemedi. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
