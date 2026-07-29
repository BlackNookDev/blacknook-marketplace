import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const DEFAULT_TO = 'dev@blacknook.com';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
}

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

    const to = process.env.INSTALLATION_REQUEST_TO || DEFAULT_TO;
    const subject = `Kurulum talebi: ${serviceName}`;
    const text = [
      `Servis: ${serviceName} (${serviceSlug})`,
      `Şirket: ${company}`,
      `İletişim e-postası: ${fromEmail}`,
      '',
      'Talep detayı:',
      reqText,
    ].join('\n');

    const transporter = getTransporter();
    if (!transporter) {
      console.error(
        '[installation-request] SMTP yapılandırması eksik (SMTP_HOST, SMTP_USER, SMTP_PASSWORD).'
      );
      return NextResponse.json(
        {
          error:
            'E-posta sunucusu yapılandırılmamış. Lütfen daha sonra tekrar deneyin veya doğrudan dev@blacknook.com adresine yazın.',
        },
        { status: 503 }
      );
    }

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
      from,
      to,
      replyTo: fromEmail,
      subject,
      text,
      html: `
        <p><strong>Servis:</strong> ${escapeHtml(serviceName)} (<code>${escapeHtml(serviceSlug)}</code>)</p>
        <p><strong>Şirket:</strong> ${escapeHtml(company)}</p>
        <p><strong>E-posta:</strong> ${escapeHtml(fromEmail)}</p>
        <hr />
        <p><strong>Talep detayı:</strong></p>
        <p>${escapeHtml(reqText).replace(/\n/g, '<br />')}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Kurulum talebi e-posta hatası:', error);
    return NextResponse.json(
      { error: 'Talep gönderilemedi. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
