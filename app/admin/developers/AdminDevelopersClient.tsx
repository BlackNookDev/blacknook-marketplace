'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { apiFetch } from '@/lib/apiUrl';
import {
  ANSWER_LABELS,
  APPLICANT_TYPE_LABEL,
  type ApplicantType,
} from '@/lib/developerApplicationLabels';

type ApplicationRow = {
  id: number;
  applicantType: ApplicantType;
  fullName: string;
  companyName: string;
  websiteUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  skills: string;
  about: string;
  answers: Record<string, string>;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason: string;
  createdAt: string;
  userEmail?: string;
  userName?: string;
};

export default function AdminDevelopersClient() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const isAdmin = session?.user?.role === 'admin';

  const load = useCallback(async () => {
    const res = await apiFetch('/api/developer-applications?scope=admin', {
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    const list: ApplicationRow[] = Array.isArray(data.applications)
      ? data.applications
      : [];
    setApplications(list);
    const firstPending = list.find((a) => a.status === 'pending');
    setOpenId(firstPending?.id ?? list[0]?.id ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    void load();
  }, [isAdmin, load]);

  const setStatus = async (
    id: number,
    status: 'approved' | 'rejected',
    rejectReason?: string
  ) => {
    await apiFetch(`/api/developer-applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectReason }),
    });
    void load();
  };

  if (!isAdmin) {
    return (
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-sm text-zinc-400">
          Bu sayfa yalnızca admin hesabı ile açılır. Mevcut rol:{' '}
          <span className="text-zinc-200">{session?.user?.role || 'user'}</span>
        </p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Yükleniyor…</p>;
  }

  if (applications.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Henüz başvuru yok. Adaylar{' '}
        <Link href="/developers/apply" className="text-sky-400 hover:text-sky-300">
          /developers/apply
        </Link>{' '}
        üzerinden yazılımcı veya girişimci olarak başvurur.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {applications.map((app) => {
        const open = openId === app.id;
        const typeLabel =
          APPLICANT_TYPE_LABEL[app.applicantType] || app.applicantType || 'Yazılımcı';
        return (
          <li
            key={app.id}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => setOpenId(open ? null : app.id)}
              >
                <p className="font-display text-lg font-semibold text-white">
                  {app.fullName}{' '}
                  <span className="text-sm font-medium text-zinc-500">· {typeLabel}</span>
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {app.userEmail || app.userName}
                  {app.companyName ? ` · ${app.companyName}` : ''}
                </p>
                <p className="mt-2 text-xs uppercase tracking-wide text-zinc-600">
                  {app.status === 'pending'
                    ? 'Bekliyor'
                    : app.status === 'approved'
                      ? 'Onaylı'
                      : 'Reddedildi'}
                  {app.createdAt
                    ? ` · ${new Date(app.createdAt).toLocaleString('tr-TR')}`
                    : ''}
                </p>
              </button>
              {app.status === 'pending' ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void setStatus(app.id, 'approved')}
                    className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-black hover:brightness-110"
                  >
                    Onayla
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const reason = window.prompt('Red gerekçesi (opsiyonel):') || undefined;
                      void setStatus(app.id, 'rejected', reason);
                    }}
                    className="rounded-lg border border-rose-400/30 px-3 py-1.5 text-sm font-semibold text-rose-200 hover:bg-rose-500/10"
                  >
                    Reddet
                  </button>
                </div>
              ) : null}
            </div>

            {open ? (
              <div className="mt-5 space-y-4 border-t border-white/[0.06] pt-5">
                {app.skills ? (
                  <p className="text-sm text-zinc-400">
                    <span className="text-zinc-500">Yığın:</span> {app.skills}
                  </p>
                ) : null}
                <p className="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                  {app.about}
                </p>
                <dl className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(app.answers || {})
                    .filter(([, v]) => String(v || '').trim())
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="rounded-xl border border-white/[0.06] bg-zinc-950/50 px-3 py-2.5"
                      >
                        <dt className="text-[11px] uppercase tracking-wide text-zinc-600">
                          {ANSWER_LABELS[key] || key}
                        </dt>
                        <dd className="mt-1 text-sm text-zinc-300 whitespace-pre-wrap">
                          {value}
                        </dd>
                      </div>
                    ))}
                </dl>
                <div className="flex flex-wrap gap-3 text-xs">
                  {app.websiteUrl ? (
                    <a
                      href={app.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400"
                    >
                      Site
                    </a>
                  ) : null}
                  {app.githubUrl ? (
                    <a
                      href={app.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400"
                    >
                      GitHub
                    </a>
                  ) : null}
                  {app.portfolioUrl ? (
                    <a
                      href={app.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sky-400"
                    >
                      Portföy
                    </a>
                  ) : null}
                </div>
                {app.status === 'rejected' && app.rejectReason ? (
                  <p className="text-sm text-rose-300/90">{app.rejectReason}</p>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
