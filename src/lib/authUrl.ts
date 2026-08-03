/** Aynı origin relative path; open redirect engeli */
export function safeCallbackUrl(raw: string | null | undefined, fallback = '/'): string {
  if (!raw) return fallback;
  const value = raw.trim();
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  if (value.includes('://')) return fallback;
  return value;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
