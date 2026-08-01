'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/apiUrl';
import { loginDemo } from '@/lib/demoAuth';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 2.9.7 3.6 1.4l2.4-2.4C16.7 3.7 14.6 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12S6.9 21.3 12 21.3c5.1 0 8.5-3.6 8.5-8.6 0-.6 0-1-.1-1.5H12z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.8c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .26.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

export default function RegisterEarlyAccessForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');
  const callbackUrl =
    searchParams.get('callbackUrl') || (next === 'match' ? '/?match=1' : '/');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuth = (provider: 'google' | 'github') => {
    if (isLoading) return;
    setError('');
    setIsLoading(true);
    void signIn(provider, { callbackUrl });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);

    try {
      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error || 'Kayıt sırasında bir hata oluştu.');
        return;
      }

      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Hesap oluşturuldu ancak otomatik giriş başarısız. Lütfen giriş yapın.');
        router.push('/login');
        return;
      }

      await getSession();
      loginDemo(email, name || undefined);
      router.push(callbackUrl || '/account');
      router.refresh();
    } catch {
      setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-[2.75rem]">
        Kayıt ol
      </h1>
      <p className="mt-3 text-sm text-zinc-400">
        {next === 'match' ? (
          <>Geliştirici eşleşmesi için önce bir hesap oluşturun.</>
        ) : (
          <>
            Zaten hesabınız var mı?{' '}
            <Link
              href="/login"
              className="font-medium text-sky-400 transition-colors hover:text-sky-300"
            >
              Log in
            </Link>
          </>
        )}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleOAuth('google')}
          className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/[0.08] disabled:opacity-50"
        >
          <GoogleIcon />
          Google ile devam edin
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => handleOAuth('github')}
          className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white disabled:opacity-50"
        >
          <GitHubIcon />
          Continue with GitHub
        </button>
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-black px-3 text-zinc-500">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error ? (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <div>
          <label htmlFor="register-name" className="mb-2 block text-sm font-medium text-zinc-300">
            Ad
          </label>
          <input
            id="register-name"
            type="text"
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="h-12 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-50"
            placeholder="Adınız Soyadınız"
          />
        </div>

        <div>
          <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="h-12 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-50"
            placeholder="ornek@email.com"
          />
        </div>

        <div>
          <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-zinc-300">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            name="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="h-12 w-full rounded-xl border border-white/15 bg-transparent px-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-50"
            placeholder="••••••••"
          />
        </div>

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
            'Kayıt ol'
          )}
        </button>
      </form>
    </div>
  );
}
