'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/apiUrl';
import { normalizeEmail } from '@/lib/authUrl';

const fieldClass =
  'h-12 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-50';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const res = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizeEmail(email) }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
      };

      if (!res.ok) {
        setError(data.error || 'İstek gönderilemedi.');
        return;
      }

      setMessage(
        data.message ||
          'E-posta adresiniz sistemde kayıtlıysa sıfırlama bağlantısı gönderildi.'
      );
    } catch {
      setError('İstek gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div
        className="pointer-events-none absolute -inset-x-10 -top-16 h-40 rounded-full bg-gradient-to-r from-teal-500/15 via-cyan-400/10 to-transparent blur-3xl"
        aria-hidden
      />

      <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">Hesap</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-[2.75rem]">
        Şifre sıfırlama
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        Şifrenizi mi unuttunuz? E-postanızı girin; size güvenli bir sıfırlama bağlantısı
        gönderelim.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        {error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </p>
        ) : null}

        <input
          id="forgot-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          aria-label="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading || Boolean(message)}
          className={fieldClass}
          placeholder="E-posta"
        />

        <button
          type="submit"
          disabled={isLoading || Boolean(message)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-black transition-[opacity,transform] duration-premium ease-premium hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              Gönderiliyor…
            </>
          ) : (
            'Şifremi sıfırla'
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-500">
        <Link href="/login" className="font-medium text-sky-400 transition-colors hover:text-sky-300">
          Girişe dön
        </Link>
      </p>
      <p className="mt-6 text-center text-xs leading-relaxed text-zinc-600">
        Sorun yaşarsanız{' '}
        <a
          href="mailto:contact@blacknook.com"
          className="text-zinc-400 underline-offset-2 hover:text-zinc-300 hover:underline"
        >
          contact@blacknook.com
        </a>
      </p>
    </div>
  );
}
