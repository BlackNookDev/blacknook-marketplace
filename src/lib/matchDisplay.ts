import { DEVELOPERS } from '../../lib/developerPresence';

const STAFF_NAMES = new Set([
  'admin',
  'administrator',
  'root',
  'support',
  'blacknook',
  'blacknook admin',
]);

export function isStaffDisplayName(name: string) {
  return STAFF_NAMES.has(name.trim().toLowerCase());
}

export function publicMatchName(name: string) {
  const trimmed = name.trim();
  if (!trimmed || isStaffDisplayName(trimmed)) return 'Bir geliştirici';
  return trimmed;
}

export function matchSuccessTitle(name: string) {
  const publicName = publicMatchName(name);
  if (publicName === 'Bir geliştirici') return 'Bir geliştiriciyle eşleştiniz';
  return `${publicName} ile eşleştiniz`;
}

export function publicSenderName(name: string) {
  return isStaffDisplayName(name) ? 'Geliştirici' : name.trim() || 'Geliştirici';
}

export function staffPersona(seed: number) {
  const i = Math.abs(seed) % DEVELOPERS.length;
  return DEVELOPERS[i];
}
