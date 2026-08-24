'use client';

import { useEffect } from 'react';
import { getStoredLocale } from '@/lib/locale';

/** Kaydedilmiş dil tercihini html[lang] ile senkronize eder */
export default function LocaleBootstrap() {
  useEffect(() => {
    document.documentElement.lang = getStoredLocale();
  }, []);
  return null;
}
