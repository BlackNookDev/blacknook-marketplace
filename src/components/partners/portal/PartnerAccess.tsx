'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Clock, Lock, ShieldX } from 'lucide-react';
import { AUTH_IDENTITY_EVENT, getAuthIdentity } from '@/lib/authIdentity';
import {
  getDemoRole,
  getMyApplication,
  type DemoRole,
  type DevApplication,
  VENDOR_EVENT,
} from '@/lib/demoVendor';

export type PartnerAccessState = {
  ready: boolean;
  role: DemoRole;
  application: DevApplication | null;
  /** Satış / liste / fatura tam erişim */
  canManage: boolean;
};

export function usePartnerAccess(): PartnerAccessState {
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<DemoRole>('user');
  const [application, setApplication] = useState<DevApplication | null>(null);

  useEffect(() => {
    const tick = () => {
      if (!getAuthIdentity()) {
        setReady(false);
        return;
      }
      setRole(getDemoRole());
      setApplication(getMyApplication());
      setReady(true);
    };
    tick();
    window.addEventListener(AUTH_IDENTITY_EVENT, tick);
    window.addEventListener(VENDOR_EVENT, tick);
    return () => {
      window.removeEventListener(AUTH_IDENTITY_EVENT, tick);
      window.removeEventListener(VENDOR_EVENT, tick);
    };
  }, []);

  const canManage =
    role === 'vendor' || role === 'admin' || application?.status === 'approved';

  return { ready, role, application, canManage };
}

type LockedProps = {
  title: string;
  children: ReactNode;
};

/** Onaylı partner değilse kilitli bilgilendirme; onaylıysa children */
export function PartnerFeatureGate({ title, children }: LockedProps) {
  const { ready, canManage, application, role } = usePartnerAccess();

  if (!ready) {
    return <p className="text-sm text-zinc-500">Yükleniyor…</p>;
  }

  if (canManage) {
    return <>{children}</>;
  }

  const pending = role === 'pending' || application?.status === 'pending';
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
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
            Başvurunuz reddedildi. {application?.rejectReason || 'Güncelleyip yeniden gönderebilirsiniz.'}
          </p>
          <Link
            href="/partners/self-submission"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
          >
            Başvuruyu güncelle
          </Link>
        </>
      ) : pending ? (
        <>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
            Başvurunuz incelemede. Onaylandıktan sonra {title.toLowerCase()} burada açılacak. Portal
            menüsünü şimdiden keşfedebilirsiniz.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/partners/status"
              className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
            >
              Başvuru durumu
            </Link>
            <Link
              href="/partners/support"
              className="inline-flex h-11 items-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
            >
              Destek
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
            Bu bölüm partner onayından sonra açılır. Ürün başvurusu oluşturarak incelemeye
            girebilirsiniz.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/partners/self-submission"
              className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
            >
              Ürün oluştur
            </Link>
            <Link
              href="/sell"
              className="inline-flex h-11 items-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
            >
              Partner programı
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
