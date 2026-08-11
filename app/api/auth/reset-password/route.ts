import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { passwordChangedEmail } from '@/lib/emailTemplates';
import { sendUserEmail } from '@/lib/mail';
import { hashResetToken } from '@/lib/passwordReset';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!token) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş bağlantı.' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Şifre en az 6 karakter olmalı.' }, { status: 400 });
    }

    const tokenHash = hashResetToken(token);
    const [rows]: any = await pool.query(
      `SELECT id, user_id, expires_at, used_at
       FROM password_reset_tokens
       WHERE token_hash = ?
       LIMIT 1`,
      [tokenHash]
    );
    const row = rows?.[0];

    if (!row || row.used_at) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş bağlantı.' }, { status: 400 });
    }

    if (new Date(row.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş bağlantı.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await pool.query('UPDATE users SET password = ? WHERE id = ?', [
      hashedPassword,
      row.user_id,
    ]);
    await pool.query(
      `UPDATE password_reset_tokens
       SET used_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [row.id]
    );
    await pool.query(
      `UPDATE password_reset_tokens
       SET used_at = CURRENT_TIMESTAMP
       WHERE user_id = ? AND used_at IS NULL`,
      [row.user_id]
    );

    try {
      const [users]: any = await pool.query(
        'SELECT name, email FROM users WHERE id = ? LIMIT 1',
        [row.user_id]
      );
      const user = users?.[0];
      if (user?.email) {
        const mail = passwordChangedEmail({ name: user.name });
        const mailResult = await sendUserEmail({ to: user.email, ...mail });
        if (!mailResult.ok) {
          console.warn('[reset-password] Bildirim maili gönderilemedi:', mailResult.error);
        }
      }
    } catch (mailError) {
      console.warn('[reset-password] Bildirim maili hatası:', mailError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[reset-password] Hata:', error);
    return NextResponse.json(
      { error: 'Şifre güncellenemedi. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
