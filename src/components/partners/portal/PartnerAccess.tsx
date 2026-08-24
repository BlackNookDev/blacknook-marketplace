'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { Clock, Lock, ShieldX } from 'lucide-react';
import { useMineProducts, type MineProduct } from '@/components/partners/useMineProducts';
import {
  useDeveloperAccess,
} from '@/components/developers/DeveloperPortalGate';

export type PartnerAccessState = {
  ready: boolean;
  role: string;
  products: MineProduct[];
  application: {
    status: 'pending' | 'approved' | 'rejected';
    rejectReason?: string;
    submittedAt?: string;
  } | null;
  canManage: boolean;
};

export function usePartnerAccess(): PartnerAccessState {
  const { products, loading } = useMineProducts();
  const { ready: devReady, role, canAccess, application: devApp } = useDeveloperAccess();

  const ready = devReady && !loading;
  const canManage = canAccess;

  const application = devApp
    ? {
        status: devApp.status,
        rejectReason: devApp.rejectReason,
        submittedAt: undefined as string | undefined,
      }
    : null;

  return { ready, role, products, application, canManage };
}

type LockedProps = {
  title: string;
  children: ReactNode;
};

export function PartnerFeatureGate({ title, children }: LockedProps) {
  const { ready, canManage, application } = usePartnerAccess();

  if (!ready) {
    return <p className="text-sm text-zinc-500">Yükleniyor…</p>;
  }

  if (canManage) {
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
              className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
            >
              Başvur
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
