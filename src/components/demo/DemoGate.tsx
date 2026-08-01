'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_EVENT, getDemoUser } from '@/lib/demoAuth';
import {
  getDemoRole,
  seedDemoAdminData,
  syncRoleFromEmail,
  type DemoRole,
  VENDOR_EVENT,
} from '@/lib/demoVendor';

type Props = {
  children: ReactNode;
  /** Boşsa yalnızca giriş yeterli */
  allowRoles?: DemoRole[];
  fallbackHref?: string;
};

export default function DemoGate({ children, allowRoles, fallbackHref = '/account' }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const rolesKey = allowRoles?.join(',') ?? '';

  useEffect(() => {
    const allowed = rolesKey ? (rolesKey.split(',') as DemoRole[]) : undefined;
    const check = () => {
      seedDemoAdminData();
      if (!getDemoUser()) {
        router.replace('/login');
        return;
      }
      syncRoleFromEmail();
      if (allowed?.length) {
        const role = getDemoRole();
        if (!allowed.includes(role)) {
          router.replace(fallbackHref);
          return;
        }
      }
      setReady(true);
    };
    check();
    window.addEventListener(AUTH_EVENT, check);
    window.addEventListener(VENDOR_EVENT, check);
    return () => {
      window.removeEventListener(AUTH_EVENT, check);
      window.removeEventListener(VENDOR_EVENT, check);
    };
  }, [router, rolesKey, fallbackHref]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 pt-28">
        <p className="text-sm text-zinc-500">Yükleniyor…</p>
      </div>
    );
  }

  return <>{children}</>;
}
