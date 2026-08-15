'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Clock, Lock, ShieldX } from 'lucide-react';
import { useMineProducts, type MineProduct } from '@/components/partners/useMineProducts';

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
  const { data: session, status } = useSession();
  const { products, loading } = useMineProducts();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === 'loading' || loading) {
      setReady(false);
      return;
    }
    setReady(true);
  }, [status, loading]);

  const role = session?.user?.role || 'user';
  const hasListing = products.length > 0;
  const hasApproved = products.some((p) => p.status === 'approved');
  const hasPending = products.some((p) => p.status === 'pending');
  const latest = products[0];

  const application = hasListing
    ? {
        status: (hasApproved
          ? 'approved'
          : hasPending
            ? 'pending'
            : 'rejected') as 'pending' | 'approved' | 'rejected',
        rejectReason: products.find((p) => p.status === 'rejected')?.rejectReason,
        submittedAt: latest?.createdAt,
      }
    : null;

  const canManage = role === 'admin' || role === 'vendor' || hasListing;

  return { ready, role, products, application, canManage };
}

type LockedProps = {
  title: string;
  children: ReactNode;
};

export function PartnerFeatureGate({ title, children }: LockedProps) {
  const { ready, canManage, application, role } = usePartnerAccess();

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
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
            Son listeniz reddedildi.{' '}
            {application?.rejectReason || 'Güncelleyip yeniden gönderebilirsiniz.'}
          </p>
          <Link
            href="/partners/self-submission"
            className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
          >
            Yeni ürün gönder
          </Link>
        </>
      ) : pending ? (
        <>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
            Listeniz incelemede. Onaylandıktan sonra {title.toLowerCase()} burada açılacak.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/partners/status"
              className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-bold text-black hover:opacity-90"
            >
              Liste durumu
            </Link>
            <Link
              href="/partners/listings"
              className="inline-flex h-11 items-center rounded-xl border border-white/15 px-5 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
            >
              Listeler
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-500">
            {role === 'user'
              ? 'Bu bölüm, ürün gönderdikten sonra açılır. Listeniz veritabanına kaydedilir ve admin onayına düşer.'
              : 'Bu bölüm partner onayından sonra açılır.'}
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
