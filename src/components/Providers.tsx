'use client';

import type { ReactNode } from 'react';
import MotionProvider from '@/components/motion/MotionProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return <MotionProvider>{children}</MotionProvider>;
}
