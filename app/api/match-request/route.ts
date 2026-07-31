import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { escapeHtml, sendPlatformEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Eşleşme talebi için giriş yapmalısınız.' }, { status: 401 });
    }

    const body = await req.json();
    const need = typeof body.need === 'string' ? body.need.trim() : '';

    if (!need) {
      return NextResponse.json({ error: 'İhtiyacınızı kısaca yazın.' }, { status: 400 });
    }

    const name = session.user.name || 'İsimsiz kullanıcı';
    const email = session.user.email;

    const mailResult = await sendPlatformEmail({
      subject: `Geliştirici eşleşme talebi: ${name}`,
      replyTo: email,
      text: [
        `Kullanıcı: ${name}`,
        `E-posta: ${email}`,
        '',
        'İhtiyaç:',
        need,
      ].join('\n'),
      html: `
        <p><strong>Kullanıcı:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-posta:</strong> ${escapeHtml(email)}</p>
        <hr />
        <p><strong>İhtiyaç:</strong></p>
        <p>${escapeHtml(need).replace(/\n/g, '<br />')}</p>
      `,
    });

    if (!mailResult.ok) {
      return NextResponse.json({ error: mailResult.error }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[match-request] Hata:', error);
    return NextResponse.json({ error: 'Talep gönderilemedi. Lütfen tekrar deneyin.' }, { status: 500 });
  }
}
