export type DemoUser = {
  email: string;
  name: string;
};

const STORAGE_KEY = 'bn_demo_user';
export const AUTH_EVENT = 'bn-auth-change';

const RANDOM_USERNAMES = [
  'ayse.kaya',
  'mert_yilmaz',
  'deniz.arslan',
  'can_ozkan',
  'elif.demir',
  'burak_celik',
  'selin.akin',
  'emre_sahin',
];

export function randomUsername() {
  return RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)];
}

export function getDemoUser(): DemoUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoUser;
    if (!parsed?.email) return null;
    const local = parsed.name || parsed.email.split('@')[0] || '';
    if (
      local === 'google.user' ||
      local === 'github.user' ||
      local.startsWith('google.') ||
      local.startsWith('github.')
    ) {
      const name = randomUsername();
      const next = { email: `${name}@blacknook.com`, name };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setDemoUser(user: DemoUser) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearDemoUser() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem('bn_demo_role');
  window.dispatchEvent(new Event(AUTH_EVENT));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('bn-vendor-change'));
  }
}

export function loginDemo(email: string, displayName?: string) {
  const trimmed = email.trim().toLowerCase();
  const local = trimmed.split('@')[0] || '';
  const looksGeneric =
    !local ||
    local === 'google.user' ||
    local === 'github.user' ||
    local.startsWith('google.') ||
    local.startsWith('github.');
  const name = displayName || (looksGeneric ? randomUsername() : local);
  setDemoUser({ email: trimmed, name });
}
