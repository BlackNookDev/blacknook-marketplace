'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Clock, Lock, ShieldCheck, ShieldX } from 'lucide-react';
import { apiFetch } from '@/lib/apiUrl';

type AppStatus = 'pending' | 'approved' | 'rejected';

export type DeveloperAccessState = {
  ready: boolean;
  role: string;
  canAccess: boolean;
  application: {
    status: AppStatus;
    rejectReason?: string;
    fullName?: string;
  } | null;
};

export function useDeveloperAccess(): DeveloperAccessState {
  const { data: session, status } = useSession();
  const [ready, setReady] = useState(false);
  const [canAccess, setCanAccess] = useState(false);
  const [application, setApplication] = useState<DeveloperAccessState['application']>(null);

  useEffect(() => {
    if (status === 'loading') {
      setReady(false);
      return;
    }
    if (status !== 'authenticated') {
      setCanAccess(false);
      setApplication(null);
      setReady(true);
      return;
    }

    const role = session?.user?.role || 'user';
    if (role === 'admin' || role === 'vendor') {
      setCanAccess(true);
      setApplication({ status: 'approved' });
      setReady(true);
      return;
    }

    let cancelled = false;
    void apiFetch('/api/developer-applications', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        const app = data?.application;
        setApplication(
          app
            ? {
                status: app.status,
                rejectReason: app.rejectReason,
                fullName: app.fullName,
              }
            : null
        );
        setCanAccess(Boolean(data?.canAccessPortal) || app?.status === 'approved');
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setCanAccess(false);
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [status, session?.user?.role]);

  return {
    ready,
    role: session?.user?.role || 'user',
    canAccess,
    application,
  };
}

/** Ürün ekleme / portal — yalnızca onaylı geliştirici (vendor) veya admin */
export function DeveloperPortalGate({
  title = 'Geliştirici onayı gerekli',
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const { ready, canAccess, application } = useDeveloperAccess();

  if (!ready) {
    return <p className="text-sm text-zinc-500">Yükleniyor…</p>;
  }

  if (canAccess) {
    return <>{children}</>;
  }

  const pending = application?.status === 'pending';
  const rejected = application?.status === 'rejected';

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-14 text-center sm:px-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-zinc-950 text-zinc-400">
        {rejected ? (
          <ShieldX className="h-5 w-5" aria-hidden />
        ) : pending ? (
          <Clock className="h-5 w-5 text-amber-300" aria-hidden />
        ) : (
          <Lock className="h-5 w-5" aria-hidden />
        )}
      </div>
      <h2 className="mt-5 font-display text-xl font-semibold text-white">{title}</h2>
      {rejected ? (
        <>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500">
            {application?.rejectReason || 'Başvuru reddedildi.'}
          </p>
          <Link
            href="/developers/apply"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
          >
            Yeniden başvur
          </Link>
        </>
      ) : pending ? (
        <>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500">İncelemede.</p>
          <Link
            href="/developers/status"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
          >
            Durum
          </Link>
        </>
      ) : (
        <>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500">Önce başvuru gerekli.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/developers/apply"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Başvur
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
