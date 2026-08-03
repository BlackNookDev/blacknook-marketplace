'use client';

import type { ReactNode } from 'react';
import AuthGate from '@/components/auth/AuthGate';

export default function AccountGate({ children }: { children: ReactNode }) {
  return <AuthGate loadingLabel="Hesap yükleniyor…">{children}</AuthGate>;
}
