import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSessionUser } from '@/lib/sessionUser';
import { installationTeamEmail, installationUserEmail } from '@/lib/emailTemplates';
import { getPlatformMailTo, sendPlatformEmail, sendUserEmail } from '@/lib/mail';
import { notifyUser } from '@/lib/notify';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Giriş gerekli.' }, { status: 401 });
    }

    const [rows]: any = await pool.query(
      `SELECT id, service_slug, service_name, company_name, email, requirements, status, created_at
       FROM installation_requests
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [user.id]
    );

    return NextResponse.json({
      requests: (rows || []).map((row: any) => ({
        id: Number(row.id),
        serviceSlug: row.service_slug,
        serviceName: row.service_name,
        companyName: row.company_name,
        email: row.email,
        requirements: row.requirements,
        status: row.status,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    console.error('[installation-request] Listeleme hatası:', error);
    return NextResponse.json({ error: 'Talepler yüklenemedi.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Kurulum talebi için giriş yapın.' }, { status: 401 });
    }

    const body = await req.json();
    const { serviceSlug, serviceName, requirements, companyName, email } = body;

    if (!serviceSlug || !serviceName) {
      return NextResponse.json({ error: 'Servis bilgisi eksik.' }, { status: 400 });
    }

    const reqText = typeof requirements === 'string' ? requirements.trim() : '';
    const company = typeof companyName === 'string' ? companyName.trim() : '';
    const fromEmail =
      user.email ||
      (typeof email === 'string' ? email.trim().toLowerCase() : '');

    if (!reqText || !company || !fromEmail) {
      return NextResponse.json(
        { error: 'Tüm alanları doldurmanız gerekiyor.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fromEmail)) {
      return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 });
    }

    if (reqText.length > 4000) {
      return NextResponse.json({ error: 'Talep metni çok uzun.' }, { status: 400 });
    }

    let insertId: number | undefined;
    try {
      const [result]: any = await pool.query(
        `INSERT INTO installation_requests
          (user_id, service_slug, service_name, company_name, email, requirements, status)
         VALUES (?, ?, ?, ?, ?, ?, 'active')`,
        [user.id, String(serviceSlug).slice(0, 255), String(serviceName).slice(0, 255), company, fromEmail, reqText]
      );
      if (result.insertId != null) insertId = Number(result.insertId);
    } catch (dbError) {
      console.error('[installation-request] DB kayıt hatası:', dbError);
      return NextResponse.json({ error: 'Talep kaydedilemedi.' }, { status: 500 });
    }

    await notifyUser({
      userId: user.id,
      title: 'Kurulum talebiniz alındı',
      body: `${serviceName}: ${reqText.length > 80 ? `${reqText.slice(0, 77)}…` : reqText}`,
      href: '/account/requests',
    });

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
      console.error('[installation-request] SMTP (talep DB’de):', teamResult.error);
    }

    const userMail = installationUserEmail({
      serviceName,
      serviceSlug,
      companyName: company,
      requirements: reqText,
    });
    const userResult = await sendUserEmail({ to: fromEmail, ...userMail });
    if (!userResult.ok) {
      console.warn('[installation-request] Kullanıcı maili gönderilemedi:', userResult.error);
    }

    return NextResponse.json({
      ok: true,
      id: insertId,
      mailed: teamResult.ok || userResult.ok,
    });
  } catch (error) {
    console.error('Kurulum talebi hatası:', error);
    return NextResponse.json(
      { error: 'Talep gönderilemedi. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
