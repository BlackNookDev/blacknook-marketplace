/**
 * Vercel / production ortamında NextAuth için gerekli env vars.
 * .env dosyası Vercel'e gitmez; dashboard veya CLI ile set edilmeli.
 */
export function ensureAuthEnv() {
  if (!process.env.NEXTAUTH_URL) {
    if (process.env.VERCEL_URL) {
      process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
    } else if (process.env.NEXT_PUBLIC_SITE_URL) {
      process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
    } else if (process.env.NEXT_PUBLIC_APP_URL) {
      process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
    }
  }

  if (!process.env.NEXTAUTH_SECRET && process.env.AUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = process.env.AUTH_SECRET;
  }
}

export function getAuthSecret(): string {
  ensureAuthEnv();
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  if (secret) return secret;

  // Production'da secret yoksa NextAuth "Server error / server configuration" sayfası basar.
  // Build/preview'ın tamamen kırılmaması için deterministik fallback (Vercel'de mutlaka override edin).
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[auth] NEXTAUTH_SECRET / AUTH_SECRET tanımlı değil. Vercel Environment Variables ekleyin.'
    );
    return 'blacknook-vercel-missing-secret-replace-me';
  }

  return 'blacknook-dev-secret';
}
