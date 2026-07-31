export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
}

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = getApiBaseUrl();
  return base ? `${base}${normalizedPath}` : normalizedPath;
}

function isCrossOriginApi(): boolean {
  if (typeof window === 'undefined') return false;
  const base = getApiBaseUrl();
  if (!base) return false;
  try {
    return new URL(base).origin !== window.location.origin;
  } catch {
    return false;
  }
}

/** Client-side API istekleri — api subdomain kullanıldığında cookie gönderir. */
export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), {
    ...init,
    credentials: isCrossOriginApi() ? 'include' : init?.credentials,
  });
}
