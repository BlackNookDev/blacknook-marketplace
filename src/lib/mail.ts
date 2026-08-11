import nodemailer from 'nodemailer';

const DEFAULT_TO = 'dev@blacknook.com';

/**
 * En basit yol: Gmail App Password.
 * SMTP_HOST=smtp.gmail.com
 * SMTP_PORT=587
 * SMTP_SECURE=false
 * SMTP_USER=you@gmail.com
 * SMTP_PASSWORD=<16 haneli uygulama şifresi>
 * SMTP_FROM="Blacknook <you@gmail.com>"  (Gmail’de FROM ≈ USER olmalı)
 */
export function getTransporter() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();

  if (!host || !user || !pass) {
    return null;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export function isMailConfigured() {
  return Boolean(getTransporter());
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function getPlatformMailTo() {
  return process.env.INSTALLATION_REQUEST_TO?.trim() || DEFAULT_TO;
}

export function getMatchMailTo() {
  return process.env.MATCH_REQUEST_TO?.trim() || 'contact@blacknook.com';
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
        'E-posta sunucusu yapılandırılmamış. Gmail için SMTP_HOST=smtp.gmail.com ve App Password ekleyin.',
    };
  }

  const from =
    process.env.SMTP_FROM?.trim() ||
    `Blacknook <${process.env.SMTP_USER!.trim()}>`;

  try {
    await transporter.sendMail({
      from,
      to: params.to || getPlatformMailTo(),
      replyTo: params.replyTo,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return { ok: true };
  } catch (error) {
    console.error('[mail] sendMail hatası:', error);
    return {
      ok: false,
      error: 'E-posta gönderilemedi. SMTP ayarlarını kontrol edin.',
    };
  }
}

/** Kullanıcıya giden mail — hata kayıt akışını bozmasın diye fire-and-forget için uygun */
export async function sendUserEmail(params: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  return sendPlatformEmail({
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html,
  });
}
