'use client';

import type { ReactNode } from 'react';
import AuthGate from '@/components/auth/AuthGate';

type Props = {
  children: ReactNode;
  allowRoles?: string[];
  fallbackHref?: string;
};

/** @deprecated Prefer AuthGate — geriye dönük uyumluluk */
export default function DemoGate({ children, allowRoles, fallbackHref = '/account' }: Props) {
  return (
    <AuthGate allowRoles={allowRoles} fallbackHref={fallbackHref}>
      {children}
    </AuthGate>
  );
}
