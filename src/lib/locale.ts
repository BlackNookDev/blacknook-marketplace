export const LOCALE_STORAGE_KEY = 'bn-locale';

export type AppLocale = 'tr' | 'en' | 'de' | 'fr' | 'es' | 'pt';

export const APP_LOCALES: {
  code: AppLocale;
  label: string;
  nativeLabel: string;
}[] = [
  { code: 'tr', label: 'Türkçe', nativeLabel: 'Türkçe' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'de', label: 'Deutsch', nativeLabel: 'Deutsch' },
  { code: 'fr', label: 'Français', nativeLabel: 'Français' },
  { code: 'es', label: 'Español', nativeLabel: 'Español' },
  { code: 'pt', label: 'Português', nativeLabel: 'Português' },
];

export function isAppLocale(value: string): value is AppLocale {
  return APP_LOCALES.some((l) => l.code === value);
}

export function getStoredLocale(): AppLocale {
  if (typeof window === 'undefined') return 'tr';
  try {
    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw && isAppLocale(raw)) return raw;
  } catch {
    /* ignore */
  }
  return 'tr';
}

export function setStoredLocale(locale: AppLocale) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  } catch {
    /* ignore */
  }
}
