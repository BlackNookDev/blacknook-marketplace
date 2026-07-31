import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { escapeHtml, sendPlatformEmail } from '@/lib/mail';

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

    const mailResult = await sendPlatformEmail({
      subject: `Waitlist: ${email}`,
      replyTo: email,
      text: [`Yeni waitlist kaydı: ${email}`, '', 'Kaynak: Ana sayfa hero formu'].join('\n'),
      html: `<p><strong>Yeni waitlist kaydı:</strong> ${escapeHtml(email)}</p><p>Kaynak: Ana sayfa hero formu</p>`,
    });

    if (!mailResult.ok) {
      console.warn('[waitlist] SMTP bildirimi gönderilemedi:', mailResult.error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[waitlist] Beklenmeyen hata:', error);
    return NextResponse.json({ error: 'Kayıt alınamadı. Lütfen tekrar deneyin.' }, { status: 500 });
  }
}
