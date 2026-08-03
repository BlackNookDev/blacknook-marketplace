/** Client-side identity mirror — NextAuth session ile senkron (partner localStorage anahtarı için). */

export type AuthIdentity = {
  id?: number;
  email: string;
  name: string;
  role?: string;
};

let current: AuthIdentity | null = null;
const listeners = new Set<() => void>();

export function getAuthIdentity(): AuthIdentity | null {
  return current;
}

export function setAuthIdentity(next: AuthIdentity | null) {
  current = next;
  listeners.forEach((fn) => fn());
}

export function subscribeAuthIdentity(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export const AUTH_IDENTITY_EVENT = 'bn-auth-identity';

export function emitAuthIdentity() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_IDENTITY_EVENT));
}
