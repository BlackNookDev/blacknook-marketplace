'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import MotionProvider from '@/components/motion/MotionProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <MotionProvider>{children}</MotionProvider>
    </SessionProvider>
  );
}
