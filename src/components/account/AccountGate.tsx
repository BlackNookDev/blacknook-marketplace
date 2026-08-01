'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_EVENT, getDemoUser } from '@/lib/demoAuth';

export default function AccountGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = () => {
      if (!getDemoUser()) {
        router.replace('/login');
        return;
      }
      setReady(true);
    };
    check();
    window.addEventListener(AUTH_EVENT, check);
    return () => window.removeEventListener(AUTH_EVENT, check);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 pt-28">
        <p className="text-sm text-zinc-500">Hesap yükleniyor…</p>
      </div>
    );
  }

  return <>{children}</>;
}
