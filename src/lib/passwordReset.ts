import { createHash, randomBytes } from 'crypto';

export function hashResetToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function createResetToken() {
  const token = randomBytes(32).toString('hex');
  return { token, tokenHash: hashResetToken(token) };
}

export function getAppBaseUrl() {
  const raw =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    'http://127.0.0.1:18080';
  return raw.replace(/\/$/, '');
}
