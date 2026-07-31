import { NextRequest, NextResponse } from 'next/server';
import { escapeHtml, sendPlatformEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceSlug, serviceName, requirements, companyName, email } = body;

    if (!serviceSlug || !serviceName) {
      return NextResponse.json({ error: 'Servis bilgisi eksik.' }, { status: 400 });
    }

    const reqText = typeof requirements === 'string' ? requirements.trim() : '';
    const company = typeof companyName === 'string' ? companyName.trim() : '';
    const fromEmail = typeof email === 'string' ? email.trim() : '';

    if (!reqText || !company || !fromEmail) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurmanız gerekiyor.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 });
    }

    const mailResult = await sendPlatformEmail({
      subject: `Kurulum talebi: ${serviceName}`,
      replyTo: fromEmail,
      text: [
        `Servis: ${serviceName} (${serviceSlug})`,
        `Şirket: ${company}`,
        `İletişim e-postası: ${fromEmail}`,
        '',
        'Talep detayı:',
        reqText,
      ].join('\n'),
      html: `
        <p><strong>Servis:</strong> ${escapeHtml(serviceName)} (<code>${escapeHtml(serviceSlug)}</code>)</p>
        <p><strong>Şirket:</strong> ${escapeHtml(company)}</p>
        <p><strong>E-posta:</strong> ${escapeHtml(fromEmail)}</p>
        <hr />
        <p><strong>Talep detayı:</strong></p>
        <p>${escapeHtml(reqText).replace(/\n/g, '<br />')}</p>
      `,
    });

    if (!mailResult.ok) {
      console.error('[installation-request] SMTP yapılandırması eksik.');
      return NextResponse.json({ error: mailResult.error }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Kurulum talebi e-posta hatası:', error);
    return NextResponse.json(
      { error: 'Talep gönderilemedi. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
