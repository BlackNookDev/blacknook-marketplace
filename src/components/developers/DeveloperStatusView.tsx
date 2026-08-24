'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/demo/StatusBadge';
import { apiFetch } from '@/lib/apiUrl';

type Application = {
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  fullName?: string;
  createdAt?: string;
};

export default function DeveloperStatusView() {
  const [application, setApplication] = useState<Application | null | undefined>(undefined);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    void apiFetch('/api/developer-applications', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setApplication(data?.application ?? null);
        setCanAccess(Boolean(data?.canAccessPortal));
      })
      .catch(() => {
        setApplication(null);
        setCanAccess(false);
      });
  }, []);

  if (application === undefined) {
    return <p className="text-sm text-zinc-500">Yükleniyor…</p>;
  }

  if (canAccess || application?.status === 'approved') {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status="approved" />
          <p className="text-sm font-medium text-emerald-200">Onaylandı.</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/partners/overview"
            className="inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90"
          >
            Portal
          </Link>
          <Link
            href="/partners/self-submission"
            className="inline-flex rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-zinc-100 hover:bg-white/[0.04]"
          >
            Ürün ekle
          </Link>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-sm text-zinc-400">Başvuru yok.</p>
        <Link
          href="/developers/apply"
          className="mt-4 inline-flex text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          Başvur →
        </Link>
      </div>
    );
  }

  if (application.status === 'rejected') {
    return (
      <div className="rounded-2xl border border-rose-400/20 bg-rose-500/[0.06] p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status="rejected" />
          <p className="text-sm font-medium text-rose-200">Başvuru reddedildi</p>
        </div>
        <p className="mt-3 text-sm text-zinc-500">
        {application.rejectReason || 'Reddedildi.'}
      </p>
        <Link
          href="/developers/apply"
          className="mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90"
        >
          Yeniden başvur
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-400/20 bg-amber-500/[0.06] p-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status="pending" />
        <p className="text-sm font-medium text-amber-100">İncelemede</p>
      </div>
      <p className="mt-3 text-sm text-zinc-500">Yanıt bekleniyor.</p>
      <Link
        href="/sell"
        className="mt-5 inline-flex text-sm font-medium text-sky-400 hover:text-sky-300"
      >
        Program →
      </Link>
    </div>
  );
}
