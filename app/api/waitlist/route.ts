import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { waitlistConfirmEmail, waitlistTeamEmail } from '@/lib/emailTemplates';
import { getPlatformMailTo, sendPlatformEmail, sendUserEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 });
    }

    try {
      await pool.query('INSERT INTO waitlist_signups (email) VALUES (?)', [email]);
    } catch (error: any) {
      if (error?.code === '23505') {
        return NextResponse.json({ ok: true, duplicate: true });
      }
      console.error('[waitlist] DB hatası:', error);
      return NextResponse.json(
        { error: 'Waitlist kaydı alınamadı. Veritabanı migration kontrol edin.' },
        { status: 503 }
      );
    }

    const userMail = waitlistConfirmEmail({ email });
    const userResult = await sendUserEmail({ to: email, ...userMail });
    if (!userResult.ok) {
      console.warn('[waitlist] Kullanıcı onay maili gönderilemedi:', userResult.error);
    }

    const teamMail = waitlistTeamEmail({ email });
    const teamResult = await sendPlatformEmail({
      to: getPlatformMailTo(),
      replyTo: email,
      ...teamMail,
    });
    if (!teamResult.ok) {
      console.warn('[waitlist] Ekip bildirimi gönderilemedi:', teamResult.error);
    }

    return NextResponse.json({ ok: true, mailed: userResult.ok });
  } catch (error) {
    console.error('[waitlist] Beklenmeyen hata:', error);
    return NextResponse.json({ error: 'Kayıt alınamadı. Lütfen tekrar deneyin.' }, { status: 500 });
  }
}
