'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { emitAuthIdentity, setAuthIdentity } from '@/lib/authIdentity';

/** SessionProvider altında: gerçek oturumu authIdentity’ye yansıtır. */
export default function SessionSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session?.user?.email) {
      setAuthIdentity({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || session.user.email.split('@')[0],
        role: session.user.role,
      });
    } else {
      setAuthIdentity(null);
    }
    emitAuthIdentity();
  }, [session, status]);

  return null;
}
