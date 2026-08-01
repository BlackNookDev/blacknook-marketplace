'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/demo/StatusBadge';
import {
  getDemoRole,
  getMyApplication,
  type DevApplication,
  VENDOR_EVENT,
} from '@/lib/demoVendor';

export default function StatusView() {
  const [app, setApp] = useState<DevApplication | null>(null);
  const [role, setRole] = useState(getDemoRole());

  useEffect(() => {
    const tick = () => {
      setApp(getMyApplication());
      setRole(getDemoRole());
    };
    tick();
    window.addEventListener(VENDOR_EVENT, tick);
    return () => window.removeEventListener(VENDOR_EVENT, tick);
  }, []);

  if (!app && role !== 'vendor' && role !== 'admin') {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-sm text-zinc-400">Henüz bir ürün başvurunuz yok.</p>
        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="/sell" className="text-sm font-medium text-sky-400 hover:text-sky-300">
            Partner programı →
          </Link>
          <Link
            href="/partners/overview"
            className="text-sm font-medium text-sky-400 hover:text-sky-300"
          >
            Partner Portal →
          </Link>
          <Link
            href="/partners/self-submission"
            className="text-sm font-medium text-sky-400 hover:text-sky-300"
          >
            Ürün oluştur →
          </Link>
        </div>
      </div>
    );
  }

  if (role === 'vendor' || role === 'admin' || app?.status === 'approved') {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/[0.06] p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status="approved" />
          <p className="text-sm font-medium text-emerald-200">Partner hesabınız aktif.</p>
        </div>
        <p className="mt-3 text-sm text-zinc-500">
          Yeni ürün eklemek için ürün formunu kullanın; mevcut ürünlerinizi panelden yönetin.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/partners/overview"
            className="inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90"
          >
            Partner Portal
          </Link>
          <Link
            href="/partners/self-submission"
            className="inline-flex rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-zinc-100 hover:bg-white/[0.04]"
          >
            Yeni ürün
          </Link>
        </div>
      </div>
    );
  }

  if (app?.status === 'rejected') {
    return (
      <div className="rounded-2xl border border-rose-400/20 bg-rose-500/[0.06] p-6">
        <StatusBadge status="rejected" />
        <p className="mt-3 text-sm text-zinc-300">{app.rejectReason}</p>
        <Link
          href="/partners/self-submission"
          className="mt-5 inline-flex text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          Ürünü güncelleyip yeniden gönder →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-400/20 bg-amber-500/[0.06] p-6">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status="pending" />
        <p className="text-sm font-medium text-amber-200">Ürününüz inceleniyor</p>
      </div>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Ad</dt>
          <dd className="text-zinc-200">{app?.name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Odak</dt>
          <dd className="text-zinc-200">{app?.productFocus}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-zinc-500">Gönderildi</dt>
          <dd className="text-zinc-200">
            {app ? new Date(app.submittedAt).toLocaleString('tr-TR') : '—'}
          </dd>
        </div>
      </dl>
      <p className="mt-6 text-xs text-zinc-600">
        İnceleme tamamlanınca bu sayfa güncellenir. Bu sırada{' '}
        <Link href="/partners/overview" className="text-sky-400 hover:text-sky-300">
          Partner Portal
        </Link>
        ’ı gezebilirsiniz. Program özeti:{' '}
        <Link href="/sell" className="text-sky-400 hover:text-sky-300">
          /sell
        </Link>
      </p>
    </div>
  );
}
