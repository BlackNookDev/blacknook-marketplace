'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/apiUrl';

const fieldClass =
  'h-12 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-50';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token')?.trim() || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');

    if (!token) {
      setError('Geçersiz veya eksik bağlantı. Lütfen e-postadaki bağlantıyı kullanın.');
      return;
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.');
      return;
    }
    if (password !== confirm) {
      setError('Şifreler eşleşmiyor.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error || 'Şifre güncellenemedi.');
        return;
      }

      setDone(true);
      setTimeout(() => router.push('/login'), 1600);
    } catch {
      setError('Şifre güncellenemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div
        className="pointer-events-none absolute -inset-x-10 -top-16 h-40 rounded-full bg-gradient-to-r from-emerald-500/12 via-sky-400/10 to-transparent blur-3xl"
        aria-hidden
      />

      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">Hesap</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-[2.75rem]">
        Yeni şifre
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        Hesabınız için yeni bir şifre belirleyin. Ardından giriş yapabilirsiniz.
      </p>

      {!token ? (
        <div className="mt-10 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Bağlantı geçersiz.{' '}
          <Link href="/forgot-password" className="font-medium text-sky-400 hover:text-sky-300">
            Yeni sıfırlama isteği
          </Link>{' '}
          oluşturun.
        </div>
      ) : done ? (
        <p className="mt-10 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Şifreniz güncellendi. Giriş sayfasına yönlendiriliyorsunuz…
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {error ? (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <input
            id="reset-password"
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            aria-label="Yeni şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className={fieldClass}
            placeholder="Yeni şifre"
          />

          <input
            id="reset-password-confirm"
            type="password"
            name="confirm"
            required
            minLength={6}
            autoComplete="new-password"
            aria-label="Şifre tekrar"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={isLoading}
            className={fieldClass}
            placeholder="Şifre tekrar"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-black transition-[opacity,transform] duration-premium ease-premium hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                Kaydediliyor…
              </>
            ) : (
              'Şifreyi güncelle'
            )}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-zinc-500">
        <Link href="/login" className="font-medium text-sky-400 transition-colors hover:text-sky-300">
          Girişe dön
        </Link>
      </p>
    </div>
  );
}
