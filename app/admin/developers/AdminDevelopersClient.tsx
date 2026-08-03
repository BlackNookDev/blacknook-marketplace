'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import StatusBadge from '@/components/demo/StatusBadge';
import {
  approveApplication,
  getApplications,
  rejectApplication,
  seedDemoAdminData,
  type DevApplication,
  VENDOR_EVENT,
} from '@/lib/demoVendor';

export default function AdminDevelopersClient() {
  const { data: session } = useSession();
  const [apps, setApps] = useState<DevApplication[]>([]);
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    seedDemoAdminData();
    const tick = () => setApps(getApplications());
    tick();
    window.addEventListener(VENDOR_EVENT, tick);
    return () => window.removeEventListener(VENDOR_EVENT, tick);
  }, []);

  if (!isAdmin) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-sm text-zinc-400">
          Bu sayfa yalnızca admin hesabı ile açılır. Mevcut rol:{' '}
          <span className="text-zinc-200">{session?.user?.role || 'user'}</span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          pgAdmin’de kendi e-postanız için{' '}
          <code className="text-zinc-300">UPDATE users SET role = &apos;admin&apos; WHERE email =
          &apos;...&apos;</code>{' '}
          çalıştırıp çıkış / tekrar giriş yapın.
        </p>
      </div>
    );
  }

  if (apps.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Önce{' '}
        <a href="/partners/self-submission" className="text-sky-400">
          /partners/self-submission
        </a>{' '}
        üzerinden ürün gönderin.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {apps.map((app) => (
        <li
          key={app.id}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-zinc-100">{app.name}</p>
              <p className="mt-1 text-sm text-zinc-500">{app.email}</p>
              {app.productFocus ? (
                <p className="mt-2 text-sm text-zinc-400">{app.productFocus}</p>
              ) : null}
            </div>
            <StatusBadge status={app.status} />
          </div>
          {app.status === 'pending' ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => approveApplication(app.id)}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Onayla
              </button>
              <button
                type="button"
                onClick={() => rejectApplication(app.id)}
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
              >
                Reddet
              </button>
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
