import nodemailer from 'nodemailer';

const DEFAULT_TO = 'dev@blacknook.com';

export function getTransporter() {
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

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function getPlatformMailTo() {
  return process.env.INSTALLATION_REQUEST_TO || DEFAULT_TO;
}

export async function sendPlatformEmail(params: {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  to?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    return {
      ok: false,
      error:
        'E-posta sunucusu yapılandırılmamış. Lütfen daha sonra tekrar deneyin veya doğrudan dev@blacknook.com adresine yazın.',
    };
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: params.to || getPlatformMailTo(),
    replyTo: params.replyTo,
    subject: params.subject,
    text: params.text,
    html: params.html,
  });

  return { ok: true };
}
