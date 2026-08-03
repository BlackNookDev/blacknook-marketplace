'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type Props = {
  children: ReactNode;
  /** Boşsa yalnızca giriş yeterli */
  allowRoles?: string[];
  fallbackHref?: string;
  loadingLabel?: string;
};

export default function AuthGate({
  children,
  allowRoles,
  fallbackHref = '/account',
  loadingLabel = 'Yükleniyor…',
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (status !== 'authenticated' || !session?.user?.email) {
      const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname || '/')}`;
      router.replace(loginUrl);
      setAllowed(false);
      return;
    }

    if (allowRoles?.length) {
      const role = session.user.role || 'user';
      if (!allowRoles.includes(role)) {
        router.replace(fallbackHref);
        setAllowed(false);
        return;
      }
    }

    setAllowed(true);
  }, [status, session, router, allowRoles, fallbackHref, pathname]);

  if (status === 'loading' || !allowed) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 pt-28">
        <p className="text-sm text-zinc-500">{loadingLabel}</p>
      </div>
    );
  }

  return <>{children}</>;
}
