import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { normalizeEmail } from '@/lib/authUrl';
import { escapeHtml, sendPlatformEmail } from '@/lib/mail';
import { createResetToken, getAppBaseUrl } from '@/lib/passwordReset';

export const dynamic = 'force-dynamic';

const GENERIC_OK =
  'E-posta adresiniz sistemde kayıtlıysa sıfırlama bağlantısı gönderildi. Gelen kutunuzu ve spam klasörünü kontrol edin.';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(typeof body.email === 'string' ? body.email : '');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta girin.' }, { status: 400 });
    }

    const [rows]: any = await pool.query(
      'SELECT id, name, email FROM users WHERE LOWER(email) = ? LIMIT 1',
      [email]
    );
    const user = rows?.[0];

    // Kullanıcı yoksa da aynı mesaj (enumeration engeli)
    if (!user) {
      return NextResponse.json({ ok: true, message: GENERIC_OK });
    }

    const { token, tokenHash } = createResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

    await pool.query(
      `UPDATE password_reset_tokens
       SET used_at = CURRENT_TIMESTAMP
       WHERE user_id = ? AND used_at IS NULL`,
      [user.id]
    );

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
       VALUES (?, ?, ?)`,
      [user.id, tokenHash, expiresAt]
    );

    const resetUrl = `${getAppBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;

    const mailResult = await sendPlatformEmail({
      to: user.email,
      subject: 'Blacknook şifre sıfırlama',
      text: [
        `Merhaba${user.name ? ` ${user.name}` : ''},`,
        '',
        'Şifrenizi sıfırlamak için aşağıdaki bağlantıyı kullanın (1 saat geçerli):',
        resetUrl,
        '',
        'Bu isteği siz yapmadıysanız bu e-postayı yok sayabilirsiniz.',
      ].join('\n'),
      html: `
        <p>Merhaba${user.name ? ` ${escapeHtml(String(user.name))}` : ''},</p>
        <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın. Bağlantı <strong>1 saat</strong> geçerlidir.</p>
        <p><a href="${escapeHtml(resetUrl)}">Şifremi sıfırla</a></p>
        <p style="color:#71717a;font-size:13px;">İstek sizden gelmediyse bu e-postayı yok sayın.</p>
      `,
    });

    if (!mailResult.ok) {
      console.error('[forgot-password] SMTP hatası:', mailResult.error, 'resetUrl=', resetUrl);
    }

    return NextResponse.json({ ok: true, message: GENERIC_OK });
  } catch (error) {
    console.error('[forgot-password] Hata:', error);
    return NextResponse.json(
      { error: 'İstek işlenemedi. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}
