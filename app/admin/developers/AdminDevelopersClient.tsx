'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '@/components/demo/StatusBadge';
import { getDemoUser } from '@/lib/demoAuth';
import {
  approveApplication,
  getApplications,
  getDemoRole,
  rejectApplication,
  seedDemoAdminData,
  setDemoRole,
  type DevApplication,
  VENDOR_EVENT,
} from '@/lib/demoVendor';

export default function AdminDevelopersClient() {
  const [apps, setApps] = useState<DevApplication[]>([]);
  const [role, setRole] = useState<string>('user');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    seedDemoAdminData();
    const tick = () => {
      setApps(getApplications());
      const r = getDemoRole();
      setRole(r);
      setIsAdmin(r === 'admin');
    };
    tick();
    window.addEventListener(VENDOR_EVENT, tick);
    return () => window.removeEventListener(VENDOR_EVENT, tick);
  }, []);

  const enableAdmin = () => {
    setDemoRole('admin');
    const user = getDemoUser();
    if (user) {
      try {
        const map = JSON.parse(
          window.localStorage.getItem('bn_demo_role_by_email') || '{}'
        ) as Record<string, string>;
        map[user.email] = 'admin';
        window.localStorage.setItem('bn_demo_role_by_email', JSON.stringify(map));
      } catch {
        /* ignore */
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-sm text-zinc-400">
          Admin görünümü için demo yetkisi gerekir. Mevcut rol:{' '}
          <span className="text-zinc-200">{role}</span>
        </p>
        <button
          type="button"
          onClick={enableAdmin}
          className="mt-4 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black hover:opacity-90"
        >
          Demo: Admin olarak devam et
        </button>
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
              <p className="text-sm text-zinc-500">{app.email}</p>
              <p className="mt-2 text-sm text-zinc-400">{app.bio}</p>
              <p className="mt-2 text-xs text-zinc-600">
                {app.productFocus}
                {app.github ? ` · ${app.github}` : ''}
                {app.portfolioUrl ? ` · ${app.portfolioUrl}` : ''}
              </p>
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
                className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/[0.04]"
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
