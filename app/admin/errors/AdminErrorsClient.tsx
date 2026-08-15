'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { apiFetch } from '@/lib/apiUrl';

type SchemaCheck = { ok: boolean; missing: string[] };

type ErrorRow = {
  id: number;
  source: string;
  message: string;
  stack?: string | null;
  detail?: Record<string, unknown> | string | null;
  method?: string | null;
  path?: string | null;
  userId?: number | null;
  createdAt: string;
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function detailCode(detail: ErrorRow['detail']) {
  if (detail && typeof detail === 'object' && typeof detail.code === 'string') {
    return detail.code;
  }
  return '';
}

export default function AdminErrorsClient() {
  const { data: session } = useSession();
  const [schema, setSchema] = useState<SchemaCheck | null>(null);
  const [errors, setErrors] = useState<ErrorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);
  const isAdmin = session?.user?.role === 'admin';

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await apiFetch('/api/admin/errors', { cache: 'no-store' });
      const data = (await res.json().catch(() => ({}))) as {
        schema?: SchemaCheck;
        errors?: ErrorRow[];
        error?: string;
      };
      if (!res.ok) {
        setLoadError(data.error || 'Yüklenemedi.');
        setErrors([]);
        return;
      }
      setSchema(data.schema || null);
      setErrors(Array.isArray(data.errors) ? data.errors : []);
    } catch {
      setLoadError('Yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    void load();
  }, [isAdmin, load]);

  if (!isAdmin) {
    return (
      <p className="text-sm text-zinc-400">
        Bu sayfa yalnızca admin hesabı ile açılır.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {schema ? (
          <p
            className={`text-sm ${schema.ok ? 'text-emerald-300' : 'text-amber-300'}`}
          >
            {schema.ok
              ? 'Gerekli tablolar ve kolonlar tamam.'
              : `Eksik şema: ${schema.missing.join(', ')}`}
          </p>
        ) : (
          <p className="text-sm text-zinc-500">Şema kontrolü bekleniyor…</p>
        )}
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-200 hover:bg-white/[0.05]"
        >
          Yenile
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Yükleniyor…</p>
      ) : loadError ? (
        <p className="text-sm text-rose-300">{loadError}</p>
      ) : errors.length === 0 ? (
        <p className="text-sm text-zinc-500">Kayıtlı sunucu hatası yok.</p>
      ) : (
        <ul className="space-y-3">
          {errors.map((row) => {
            const code = detailCode(row.detail);
            const open = openId === row.id;
            return (
              <li
                key={row.id}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      #{row.id} · {row.source}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {row.method || '—'} {row.path || ''}
                      {code ? ` · ${code}` : ''}
                    </p>
                  </div>
                  <time className="text-xs text-zinc-500" dateTime={row.createdAt}>
                    {formatDate(row.createdAt)}
                  </time>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{row.message}</p>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : row.id)}
                  className="mt-3 text-xs font-medium text-sky-400 hover:text-sky-300"
                >
                  {open ? 'Detayı gizle' : 'Detayı göster'}
                </button>
                {open ? (
                  <pre className="mt-3 overflow-x-auto rounded-xl bg-zinc-950/80 p-3 text-[11px] leading-relaxed text-zinc-400">
                    {JSON.stringify(
                      { detail: row.detail, stack: row.stack, userId: row.userId },
                      null,
                      2
                    )}
                  </pre>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
