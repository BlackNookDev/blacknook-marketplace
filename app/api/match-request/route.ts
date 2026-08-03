import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import pool from '@/lib/db';
import { escapeHtml, sendPlatformEmail } from '@/lib/mail';

const MATCH_MAIL_TO =
  process.env.MATCH_REQUEST_TO?.trim() || 'contact@blacknook.com';

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
    const url = new URL(req.url);
    const queryEmail = url.searchParams.get('email')?.trim().toLowerCase() || '';
    const sessionEmail = session?.user?.email?.trim().toLowerCase() || '';

    const email = sessionEmail || queryEmail;
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'E-posta gerekli.' }, { status: 400 });
    }

    // Session varsa yalnızca kendi taleplerini görsün
    if (sessionEmail && queryEmail && sessionEmail !== queryEmail) {
      return NextResponse.json({ error: 'Yetkisiz.' }, { status: 403 });
    }

    const status = url.searchParams.get('status')?.trim() || 'active';
    const params: any[] = [email];
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

    const mailResult = await sendPlatformEmail({
      to: MATCH_MAIL_TO,
      subject: `Geliştirici eşleşme talebi: ${name}`,
      replyTo: email || undefined,
      text: [
        `Kullanıcı: ${name}`,
        `E-posta: ${email || '(belirtilmedi)'}`,
        `Talep ID: ${insertId ?? '-'}`,
        '',
        'İhtiyaç:',
        need,
      ].join('\n'),
      html: `
        <p><strong>Kullanıcı:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-posta:</strong> ${escapeHtml(email || '(belirtilmedi)')}</p>
        <p><strong>Talep ID:</strong> ${escapeHtml(String(insertId ?? '-'))}</p>
        <hr />
        <p><strong>İhtiyaç:</strong></p>
        <p>${escapeHtml(need).replace(/\n/g, '<br />')}</p>
      `,
    });

    if (!mailResult.ok) {
      // Talep profilde görünsün; mail altyapısı sonra tamamlanabilir
      console.error('[match-request] SMTP hatası (talep DB’de):', mailResult.error);
    }

    return NextResponse.json({
      ok: true,
      id: insertId,
      mailed: mailResult.ok,
    });
  } catch (error) {
    console.error('[match-request] Hata:', error);
    return NextResponse.json(
      { error: 'Talep gönderilemedi. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
