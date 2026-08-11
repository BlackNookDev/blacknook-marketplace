import { NextRequest, NextResponse } from 'next/server';
import { installationTeamEmail, installationUserEmail } from '@/lib/emailTemplates';
import { getPlatformMailTo, sendPlatformEmail, sendUserEmail } from '@/lib/mail';

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

    const teamMail = installationTeamEmail({
      serviceName,
      serviceSlug,
      companyName: company,
      email: fromEmail,
      requirements: reqText,
    });

    const teamResult = await sendPlatformEmail({
      to: getPlatformMailTo(),
      replyTo: fromEmail,
      ...teamMail,
    });

    if (!teamResult.ok) {
      console.error('[installation-request] SMTP yapılandırması eksik.');
      return NextResponse.json({ error: teamResult.error }, { status: 503 });
    }

    const userMail = installationUserEmail({
      serviceName,
      serviceSlug,
      companyName: company,
      requirements: reqText,
    });
    const userResult = await sendUserEmail({ to: fromEmail, ...userMail });
    if (!userResult.ok) {
      console.warn('[installation-request] Kullanıcı onay maili gönderilemedi:', userResult.error);
    }

    return NextResponse.json({ ok: true, mailed: userResult.ok });
  } catch (error) {
    console.error('Kurulum talebi e-posta hatası:', error);
    return NextResponse.json(
      { error: 'Talep gönderilemedi. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
