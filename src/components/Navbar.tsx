'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { Users } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import BrandLogo from '@/components/BrandLogo';
import MatchDeveloperModal from '@/components/MatchDeveloperModal';
import NavDropdown from '@/components/NavDropdown';
import MatchPresenceBadge from '@/components/presence/MatchPresenceBadge';
import PresenceDock from '@/components/presence/PresenceDock';
import { duration, easePremium } from '@/components/motion/tokens';

export default function Navbar() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [matchOpen, setMatchOpen] = useState(false);

  const canMatch = () => Boolean(session);

  const openMatch = () => setMatchOpen(true);

  const handleMatchClick = () => {
    if (status === 'loading') return;
    if (!canMatch()) {
      router.push('/register?next=match');
      return;
    }
    openMatch();
  };

  useEffect(() => {
    if (searchParams.get('match') !== '1') return;
    if (canMatch()) {
      openMatch();
    }
    router.replace('/', { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, session]);

  useEffect(() => {
    const onOpen = () => handleMatchClick();
    window.addEventListener('bn-open-match', onOpen);
    return () => window.removeEventListener('bn-open-match', onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status]);


  return (
    <>
      <m.div
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: easePremium, delay: 0.05 }}
      >
        <nav className="relative w-full max-w-5xl" aria-label="Ana navigasyon">
          <div className="relative flex h-12 items-center justify-between gap-2 rounded-full border border-white/[0.08] bg-black/50 pl-3 pr-2 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150 sm:pl-4">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <BrandLogo />
              <button
                type="button"
                onClick={handleMatchClick}
                className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-2 text-[11px] font-semibold text-black shadow-[0_0_12px_rgba(45,212,191,0.28)] transition-[filter,transform] duration-premium ease-premium hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 active:scale-[0.98]"
                aria-label="Geliştiriciler ile eşleş"
                title="Şu an eşleşmeye hazır geliştiriciler"
              >
                <Users className="h-3 w-3" aria-hidden />
                <span className="hidden sm:inline">Eşleş</span>
                <MatchPresenceBadge />
              </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden md:block">
                <NavDropdown />
              </div>
              <Link
                href="/services"
                className="rounded-full px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-white md:hidden"
              >
                Ekosistem
              </Link>
              {status === 'loading' ? (
                <span className="rounded-full px-3.5 py-1.5 text-sm text-zinc-500 sm:px-4">
                  …
                </span>
              ) : session ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span
                    className="hidden max-w-[8rem] truncate text-sm text-zinc-400 sm:inline"
                    title={session.user.email ?? undefined}
                  >
                    {session.user.name || session.user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="rounded-full px-3 py-1.5 text-sm text-red-400 transition-colors hover:text-red-300"
                  >
                    Çıkış
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-black transition-[opacity,transform] duration-premium ease-premium hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98] sm:px-4"
                >
                  Giriş yap
                </Link>
              )}
            </div>
          </div>
        </nav>
      </m.div>

      <PresenceDock />
      <MatchDeveloperModal open={matchOpen} onClose={() => setMatchOpen(false)} />
    </>
  );
}
