import { escapeHtml } from './mail';
import { getAppBaseUrl } from './passwordReset';

/** Site ile uyumlu koyu monokrom e-posta şablonları (inline CSS — e-posta istemcileri). */

const COLORS = {
  bg: '#161618',
  surface: '#1c1c1f',
  elevated: '#242428',
  border: 'rgba(255,255,255,0.12)',
  text: '#f4f4f5',
  muted: '#a1a1aa',
  faint: '#71717a',
  accent: '#fafafa',
  black: '#09090b',
} as const;

function siteUrl(path = '/') {
  const base = getAppBaseUrl();
  if (path.startsWith('http')) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function ctaButton(href: string, label: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;">
      <tr>
        <td align="center" style="border-radius:999px;background:${COLORS.accent};">
          <a href="${escapeHtml(href)}"
             style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;letter-spacing:0.02em;color:${COLORS.black};text-decoration:none;border-radius:999px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

function detailRow(label: string, valueHtml: string) {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${COLORS.border};font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.faint};width:34%;vertical-align:top;">
        ${escapeHtml(label)}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid ${COLORS.border};font-family:Arial,Helvetica,sans-serif;font-size:15px;color:${COLORS.text};vertical-align:top;">
        ${valueHtml}
      </td>
    </tr>`;
}

export type BrandEmailPayload = {
  preheader?: string;
  eyebrow?: string;
  title: string;
  bodyHtml: string;
  cta?: { href: string; label: string };
  footerNote?: string;
};

/** Ortak Blacknook HTML zarfı */
export function renderBrandEmail(payload: BrandEmailPayload): string {
  const home = siteUrl('/');
  const preheader = payload.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(payload.preheader)}</div>`
    : '';
  const eyebrow = payload.eyebrow
    ? `<p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.faint};">${escapeHtml(payload.eyebrow)}</p>`
    : '';
  const cta = payload.cta ? ctaButton(payload.cta.href, payload.cta.label) : '';
  const footerNote = payload.footerNote
    ? `<p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.5;color:${COLORS.faint};">${escapeHtml(payload.footerNote)}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(payload.title)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};">
  ${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:${COLORS.surface};border:1px solid ${COLORS.border};border-radius:20px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid ${COLORS.border};background:${COLORS.elevated};">
              <a href="${escapeHtml(home)}" style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.02em;color:${COLORS.text};text-decoration:none;">
                Blacknook
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${eyebrow}
              <h1 style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:24px;line-height:1.25;font-weight:800;letter-spacing:-0.03em;color:${COLORS.text};">
                ${escapeHtml(payload.title)}
              </h1>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${COLORS.muted};">
                ${payload.bodyHtml}
              </div>
              ${cta}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid ${COLORS.border};background:${COLORS.elevated};">
              ${footerNote}
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${COLORS.faint};">
                © ${new Date().getFullYear()} Blacknook ·
                <a href="${escapeHtml(home)}" style="color:${COLORS.muted};text-decoration:none;">blacknook.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function p(text: string) {
  return `<p style="margin:0 0 14px;color:${COLORS.muted};">${text}</p>`;
}

export function welcomeRegisterEmail(params: { name: string; email: string }) {
  const name = params.name.trim() || 'merhaba';
  const services = siteUrl('/services');
  const html = renderBrandEmail({
    preheader: 'Blacknook hesabınız hazır. Kataloğu keşfedin.',
    eyebrow: 'Hoş geldiniz',
    title: `Merhaba ${name}`,
    bodyHtml: [
      p('Hesabınız başarıyla oluşturuldu. Artık servis kataloğunu gezebilir, kurulum talebi gönderebilir ve geliştirici eşleşmesi isteyebilirsiniz.'),
      p(`Kayıtlı e-posta: <strong style="color:${COLORS.text};">${escapeHtml(params.email)}</strong>`),
    ].join(''),
    cta: { href: services, label: 'Servisleri keşfet' },
    footerNote: 'Bu e-postayı kayıt olduğunuz için aldınız.',
  });

  return {
    subject: 'Blacknook’a hoş geldiniz',
    text: [
      `Merhaba ${name},`,
      '',
      'Hesabınız başarıyla oluşturuldu.',
      `Kayıtlı e-posta: ${params.email}`,
      '',
      `Servisleri keşfet: ${services}`,
    ].join('\n'),
    html,
  };
}

export function waitlistConfirmEmail(params: { email: string }) {
  const home = siteUrl('/');
  const html = renderBrandEmail({
    preheader: 'Early access listesine eklendiniz.',
    eyebrow: 'Waitlist',
    title: 'Listenize eklendiniz',
    bodyHtml: [
      p('Blacknook erken erişim listesine kaydınız alındı. Lansman ve önemli güncellemelerde sizi bilgilendireceğiz.'),
      p(`Adresiniz: <strong style="color:${COLORS.text};">${escapeHtml(params.email)}</strong>`),
    ].join(''),
    cta: { href: home, label: 'Ana sayfaya dön' },
    footerNote: 'İstemediyseniz bu e-postayı yok sayabilirsiniz.',
  });

  return {
    subject: 'Blacknook waitlist kaydınız alındı',
    text: [
      'Blacknook erken erişim listesine kaydınız alındı.',
      `E-posta: ${params.email}`,
      home,
    ].join('\n'),
    html,
  };
}

export function waitlistTeamEmail(params: { email: string }) {
  const html = renderBrandEmail({
    preheader: `Yeni waitlist: ${params.email}`,
    eyebrow: 'Ekip bildirimi',
    title: 'Yeni waitlist kaydı',
    bodyHtml: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${detailRow('E-posta', escapeHtml(params.email))}${detailRow('Kaynak', 'Ana sayfa hero formu')}</table>`,
  });

  return {
    subject: `Waitlist: ${params.email}`,
    text: `Yeni waitlist kaydı: ${params.email}\nKaynak: Ana sayfa hero formu`,
    html,
  };
}

export function passwordResetEmail(params: { name?: string | null; resetUrl: string }) {
  const greeting = params.name?.trim() ? `Merhaba ${params.name.trim()}` : 'Merhaba';
  const html = renderBrandEmail({
    preheader: 'Şifre sıfırlama bağlantınız (1 saat geçerli).',
    eyebrow: 'Güvenlik',
    title: 'Şifrenizi sıfırlayın',
    bodyHtml: [
      p(`${escapeHtml(greeting)},`),
      p('Şifrenizi sıfırlamak için aşağıdaki düğmeyi kullanın. Bağlantı <strong style="color:#f4f4f5;">1 saat</strong> geçerlidir.'),
      p(`Bağlantı çalışmazsa: <a href="${escapeHtml(params.resetUrl)}" style="color:#fafafa;word-break:break-all;">${escapeHtml(params.resetUrl)}</a>`),
    ].join(''),
    cta: { href: params.resetUrl, label: 'Şifremi sıfırla' },
    footerNote: 'Bu isteği siz yapmadıysanız e-postayı yok sayın.',
  });

  return {
    subject: 'Blacknook şifre sıfırlama',
    text: [
      greeting + ',',
      '',
      'Şifrenizi sıfırlamak için (1 saat geçerli):',
      params.resetUrl,
      '',
      'İstek sizden gelmediyse yok sayın.',
    ].join('\n'),
    html,
  };
}

export function passwordChangedEmail(params: { name?: string | null }) {
  const greeting = params.name?.trim() ? `Merhaba ${params.name.trim()}` : 'Merhaba';
  const login = siteUrl('/login');
  const html = renderBrandEmail({
    preheader: 'Şifreniz güncellendi.',
    eyebrow: 'Güvenlik',
    title: 'Şifreniz değiştirildi',
    bodyHtml: [
      p(`${escapeHtml(greeting)},`),
      p('Blacknook hesabınızın şifresi başarıyla güncellendi. Bu işlemi siz yapmadıysanız hemen bizimle iletişime geçin.'),
    ].join(''),
    cta: { href: login, label: 'Giriş yap' },
  });

  return {
    subject: 'Blacknook şifreniz güncellendi',
    text: [
      greeting + ',',
      '',
      'Hesap şifreniz güncellendi.',
      `Giriş: ${login}`,
    ].join('\n'),
    html,
  };
}

export function installationUserEmail(params: {
  serviceName: string;
  serviceSlug: string;
  companyName: string;
  requirements: string;
}) {
  const detail = siteUrl(`/service/${params.serviceSlug}`);
  const html = renderBrandEmail({
    preheader: `${params.serviceName} kurulum talebiniz alındı.`,
    eyebrow: 'Kurulum talebi',
    title: 'Talebiniz alındı',
    bodyHtml: [
      p('Kurulum talebinizi aldık. Ekibimiz en kısa sürede sizinle iletişime geçecek.'),
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 16px;">
        ${detailRow('Servis', escapeHtml(params.serviceName))}
        ${detailRow('Şirket', escapeHtml(params.companyName))}
      </table>`,
      p(`<strong style="color:${COLORS.text};">Talebiniz</strong><br />${escapeHtml(params.requirements).replace(/\n/g, '<br />')}`),
    ].join(''),
    cta: { href: detail, label: 'Servis sayfasına dön' },
  });

  return {
    subject: `Kurulum talebiniz alındı — ${params.serviceName}`,
    text: [
      `Kurulum talebiniz alındı: ${params.serviceName}`,
      `Şirket: ${params.companyName}`,
      '',
      params.requirements,
      '',
      detail,
    ].join('\n'),
    html,
  };
}

export function installationTeamEmail(params: {
  serviceName: string;
  serviceSlug: string;
  companyName: string;
  email: string;
  requirements: string;
}) {
  const html = renderBrandEmail({
    preheader: `Kurulum: ${params.serviceName}`,
    eyebrow: 'Ekip bildirimi',
    title: 'Yeni kurulum talebi',
    bodyHtml: [
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${detailRow('Servis', `${escapeHtml(params.serviceName)} <span style="color:${COLORS.faint};">(${escapeHtml(params.serviceSlug)})</span>`)}
        ${detailRow('Şirket', escapeHtml(params.companyName))}
        ${detailRow('E-posta', escapeHtml(params.email))}
      </table>`,
      p(`<strong style="color:${COLORS.text};">Detay</strong><br />${escapeHtml(params.requirements).replace(/\n/g, '<br />')}`),
    ].join(''),
  });

  return {
    subject: `Kurulum talebi: ${params.serviceName}`,
    text: [
      `Servis: ${params.serviceName} (${params.serviceSlug})`,
      `Şirket: ${params.companyName}`,
      `E-posta: ${params.email}`,
      '',
      params.requirements,
    ].join('\n'),
    html,
  };
}

export function matchUserEmail(params: { name: string; need: string; requestId?: number }) {
  const requests = siteUrl('/account/requests');
  const html = renderBrandEmail({
    preheader: 'Geliştirici eşleşme talebiniz alındı.',
    eyebrow: 'Eşleşme',
    title: 'Talebiniz kaydedildi',
    bodyHtml: [
      p(`Merhaba ${escapeHtml(params.name)}, eşleşme talebinizi aldık. Uygun geliştiricilerle bağlantı için sizi bilgilendireceğiz.`),
      params.requestId != null
        ? p(`Talep no: <strong style="color:${COLORS.text};">#${params.requestId}</strong>`)
        : '',
      p(`<strong style="color:${COLORS.text};">İhtiyacınız</strong><br />${escapeHtml(params.need).replace(/\n/g, '<br />')}`),
    ].join(''),
    cta: { href: requests, label: 'Taleplerimi gör' },
  });

  return {
    subject: 'Eşleşme talebiniz alındı — Blacknook',
    text: [
      `Merhaba ${params.name},`,
      '',
      'Geliştirici eşleşme talebiniz alındı.',
      params.requestId != null ? `Talep #${params.requestId}` : '',
      '',
      params.need,
      '',
      requests,
    ]
      .filter(Boolean)
      .join('\n'),
    html,
  };
}

export function matchTeamEmail(params: {
  name: string;
  email: string;
  need: string;
  requestId?: number;
}) {
  const html = renderBrandEmail({
    preheader: `Eşleşme: ${params.name}`,
    eyebrow: 'Ekip bildirimi',
    title: 'Yeni eşleşme talebi',
    bodyHtml: [
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${detailRow('Kullanıcı', escapeHtml(params.name))}
        ${detailRow('E-posta', escapeHtml(params.email || '(belirtilmedi)'))}
        ${detailRow('Talep ID', escapeHtml(String(params.requestId ?? '-')))}
      </table>`,
      p(`<strong style="color:${COLORS.text};">İhtiyaç</strong><br />${escapeHtml(params.need).replace(/\n/g, '<br />')}`),
    ].join(''),
  });

  return {
    subject: `Geliştirici eşleşme talebi: ${params.name}`,
    text: [
      `Kullanıcı: ${params.name}`,
      `E-posta: ${params.email || '(belirtilmedi)'}`,
      `Talep ID: ${params.requestId ?? '-'}`,
      '',
      params.need,
    ].join('\n'),
    html,
  };
}
