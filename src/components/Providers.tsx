'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import MotionProvider from '@/components/motion/MotionProvider';
import SessionSync from '@/components/auth/SessionSync';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync />
      <MotionProvider>{children}</MotionProvider>
    </SessionProvider>
  );
}
