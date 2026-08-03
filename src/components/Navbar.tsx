'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Bell, ShoppingCart, User, Users } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import BrandLogo from '@/components/BrandLogo';
import MatchDeveloperModal from '@/components/MatchDeveloperModal';
import NavDropdown from '@/components/NavDropdown';
import MatchPresenceBadge from '@/components/presence/MatchPresenceBadge';
import PresenceDock from '@/components/presence/PresenceDock';
import { duration, easePremium } from '@/components/motion/tokens';
import { signOut, useSession } from 'next-auth/react';
import { ACCOUNT_NAV } from '@/components/account/accountNav';
import { isPartnerPortalPath } from '@/lib/partnerPortal';

const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Yeni araç eklendi',
    body: 'Ekosistemde keşfedebileceğin yeni bir ürün yayında.',
    href: '/services',
  },
  {
    id: 'n2',
    title: 'Partner programı',
    body: 'Ürününüzü Blacknook’ta yayınlamak için başvurabilirsiniz.',
    href: '/sell',
  },
];

export default function Navbar() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [matchOpen, setMatchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [cartCount] = useState(1);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const openMatch = () => {
    if (status === 'loading') return;
    if (status !== 'authenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent('/?match=1')}`);
      return;
    }
    setMatchOpen(true);
  };
  const hideChrome = isPartnerPortalPath(pathname);
  const user = status === 'authenticated' ? session?.user : null;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (hideChrome) return;
    if (searchParams.get('match') !== '1') return;
    if (status === 'loading') return;
    if (status !== 'authenticated') {
      router.replace(`/login?callbackUrl=${encodeURIComponent('/?match=1')}`);
      return;
    }
    setMatchOpen(true);
    router.replace('/', { scroll: false });
  }, [searchParams, hideChrome, status, router]);

  useEffect(() => {
    if (hideChrome) return;
    const onOpen = () => openMatch();
    window.addEventListener('bn-open-match', onOpen);
    return () => window.removeEventListener('bn-open-match', onOpen);
    // openMatch depends on status/router
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideChrome, status]);

  useEffect(() => {
    if (!menuOpen && !notifOpen) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuOpen && menuRef.current && !menuRef.current.contains(t)) setMenuOpen(false);
      if (notifOpen && notifRef.current && !notifRef.current.contains(t)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen, notifOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    void signOut({ callbackUrl: '/' });
  };

  if (hideChrome) {
    return null;
  }

  const iconBtn =
    'relative inline-flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40';

  return (
    <>
      <m.div
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: easePremium, delay: 0.05 }}
      >
        <nav className="relative w-full max-w-5xl" aria-label="Ana navigasyon">
          <div className="relative flex h-12 items-center justify-between gap-2 rounded-full border border-white/[0.1] bg-zinc-900/55 pl-3 pr-2 shadow-[0_8px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl backdrop-saturate-150 sm:pl-4">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <BrandLogo />
              <button
                type="button"
                onClick={openMatch}
                className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-2 text-[11px] font-semibold text-black shadow-[0_0_12px_rgba(45,212,191,0.28)] transition-[filter,transform] duration-premium ease-premium hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 active:scale-[0.98]"
                aria-label="Geliştiriciler ile eşleş"
                title="Şu an eşleşmeye hazır geliştiriciler"
              >
                <Users className="h-3 w-3" aria-hidden />
                <span className="hidden sm:inline">Eşleş</span>
                <MatchPresenceBadge />
              </button>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <div className="hidden md:block">
                <NavDropdown />
              </div>
              <Link
                href="/services"
                className="rounded-full px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-white md:hidden"
              >
                Ekosistem
              </Link>

              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen((v) => !v);
                    setMenuOpen(false);
                  }}
                  className={iconBtn}
                  aria-label="Bildirimler"
                  aria-expanded={notifOpen}
                >
                  <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-zinc-900/80" />
                </button>

                {notifOpen ? (
                  <div
                    role="dialog"
                    aria-label="Bildirimler"
                    className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="border-b border-white/[0.06] px-4 py-3">
                      <p className="font-display text-sm font-semibold text-white">Bildirimler</p>
                    </div>
                    <ul className="max-h-72 overflow-y-auto py-1">
                      {NOTIFICATIONS.map((n) => (
                        <li key={n.id}>
                          <Link
                            href={n.href}
                            onClick={() => setNotifOpen(false)}
                            className="block px-4 py-3 transition-colors hover:bg-white/[0.04]"
                          >
                            <p className="text-sm font-medium text-zinc-100">{n.title}</p>
                            <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">{n.body}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <Link
                href="/account/products"
                className={iconBtn}
                aria-label={`Yazılım sepeti${cartCount ? `, ${cartCount} öğe` : ''}`}
                title="Yazılım sepeti"
              >
                <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                {cartCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                ) : null}
              </Link>

              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen((v) => !v);
                      setNotifOpen(false);
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-zinc-200 transition-colors hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                    aria-expanded={menuOpen}
                    aria-haspopup="menu"
                    aria-label="Hesap menüsü"
                  >
                    <User className="h-4 w-4" aria-hidden />
                  </button>

                  {menuOpen ? (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/95 py-1 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="border-b border-white/[0.06] px-3 py-2 text-right">
                        <p className="truncate text-xs text-zinc-500">{user.email}</p>
                      </div>
                      {ACCOUNT_NAV.slice(0, 4).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-2 text-right text-sm text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                      {isAdmin ? (
                        <Link
                          href="/admin/developers"
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-2 text-right text-sm text-emerald-300 transition-colors hover:bg-white/[0.05]"
                        >
                          Admin
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="block w-full border-t border-white/[0.06] px-3 py-2 text-right text-sm text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white"
                      >
                        Çıkış yap
                      </button>
                    </div>
                  ) : null}
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
