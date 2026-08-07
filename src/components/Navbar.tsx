'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Bell, Menu, ShoppingCart, User, Users } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import BrandLogo from '@/components/BrandLogo';
import MatchDeveloperModal from '@/components/MatchDeveloperModal';
import MobileNavPanel from '@/components/MobileNavPanel';
import NavDropdown from '@/components/NavDropdown';
import MatchPresenceBadge from '@/components/presence/MatchPresenceBadge';
import PresenceDock from '@/components/presence/PresenceDock';
import { duration, easePremium } from '@/components/motion/tokens';
import { signOut, useSession } from 'next-auth/react';
import { ACCOUNT_NAV } from '@/components/account/accountNav';
import { isPartnerPortalPath } from '@/lib/partnerPortal';

type NavNotification = {
  id: number;
  title: string;
  body: string;
  href: string;
  isRead: boolean;
};

export default function Navbar() {
  const reduce = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [matchOpen, setMatchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [notifications, setNotifications] = useState<NavNotification[]>([]);
  const [unread, setUnread] = useState(0);
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

  const refreshNavData = useCallback(async () => {
    if (status !== 'authenticated') {
      setCartCount(0);
      setNotifications([]);
      setUnread(0);
      return;
    }
    try {
      const [cartRes, notifRes] = await Promise.all([
        fetch('/api/cart', { cache: 'no-store' }),
        fetch('/api/notifications', { cache: 'no-store' }),
      ]);
      if (cartRes.ok) {
        const cart = await cartRes.json();
        setCartCount(Number(cart.count) || 0);
      }
      if (notifRes.ok) {
        const data = await notifRes.json();
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        setUnread(Number(data.unread) || 0);
      }
    } catch {
      setCartCount(0);
      setNotifications([]);
      setUnread(0);
    }
  }, [status]);

  useEffect(() => {
    void refreshNavData();
  }, [refreshNavData]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideChrome, status]);

  useEffect(() => {
    setMobileNavOpen(false);
    setMenuOpen(false);
    setNotifOpen(false);
  }, [pathname]);

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
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
        initial={reduce ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: easePremium, delay: 0.05 }}
      >
        <nav className="relative w-full max-w-5xl" aria-label="Ana navigasyon">
          <div className="relative flex h-12 items-center justify-between gap-2 rounded-full border border-white/[0.1] bg-zinc-900/55 pl-3 pr-2 shadow-[0_8px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl backdrop-saturate-150 sm:pl-4">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                className={`${iconBtn} -ml-1 md:hidden`}
                aria-label="Menüyü aç"
                aria-expanded={mobileNavOpen}
                onClick={() => {
                  setMobileNavOpen(true);
                  setMenuOpen(false);
                  setNotifOpen(false);
                }}
              >
                <Menu className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
              </button>
              <BrandLogo textClassName="hidden sm:inline" />
              <button
                type="button"
                onClick={openMatch}
                className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-2 text-[11px] font-semibold text-black shadow-[0_0_12px_rgba(45,212,191,0.28)] transition-[filter,transform] duration-premium ease-premium hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 active:scale-[0.98]"
                aria-label="Geliştiricilerle eşleş"
                title="Şu an eşleşmeye hazır geliştiriciler"
              >
                <Users className="h-3 w-3" aria-hidden />
                <span className="hidden sm:inline">Eşleş</span>
                <MatchPresenceBadge />
              </button>
              <div className="hidden md:block">
                <NavDropdown />
              </div>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1">
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => {
                    const opening = !notifOpen;
                    setNotifOpen(opening);
                    setMenuOpen(false);
                    setMobileNavOpen(false);
                    if (opening) {
                      void refreshNavData();
                      if (status === 'authenticated') {
                        void fetch('/api/notifications', { method: 'PATCH' }).then(() => {
                          setUnread(0);
                          setNotifications((prev) =>
                            prev.map((n) => ({ ...n, isRead: true }))
                          );
                        });
                      }
                    }
                  }}
                  className={iconBtn}
                  aria-label="Bildirimler"
                  aria-expanded={notifOpen}
                >
                  <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
                  {unread > 0 ? (
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-zinc-900/80" />
                  ) : null}
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
                    {status !== 'authenticated' ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-sm text-zinc-500">Bildirimleri görmek için giriş yapın.</p>
                        <Link
                          href="/login"
                          onClick={() => setNotifOpen(false)}
                          className="mt-3 inline-block text-sm font-medium text-sky-400 hover:text-sky-300"
                        >
                          Giriş Yap
                        </Link>
                      </div>
                    ) : notifications.length === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-zinc-500">
                        Şu an bildirim yok
                      </p>
                    ) : (
                      <ul className="max-h-72 overflow-y-auto py-1">
                        {notifications.map((n) => (
                          <li key={n.id}>
                            <Link
                              href={n.href}
                              onClick={() => setNotifOpen(false)}
                              className="block px-4 py-3 transition-colors hover:bg-white/[0.04]"
                            >
                              <p className="text-sm font-medium text-zinc-100">{n.title}</p>
                              {n.body ? (
                                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                                  {n.body}
                                </p>
                              ) : null}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}
              </div>

              <Link
                href={
                  status === 'authenticated'
                    ? '/account/products'
                    : '/login?callbackUrl=%2Faccount%2Fproducts'
                }
                className={iconBtn}
                aria-label={`Yazılım sepeti${cartCount ? `, ${cartCount} öğe` : ''}`}
                title="Yazılım sepeti"
                onClick={() => void refreshNavData()}
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
                      setMobileNavOpen(false);
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
                      <div className="border-b border-white/[0.06] px-3 py-2 text-left">
                        <p className="truncate text-xs text-zinc-500">{user.email}</p>
                      </div>
                      {ACCOUNT_NAV.slice(0, 4).map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-2 text-left text-sm text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                      {isAdmin ? (
                        <Link
                          href="/admin/developers"
                          role="menuitem"
                          onClick={() => setMenuOpen(false)}
                          className="block px-3 py-2 text-left text-sm text-emerald-300 transition-colors hover:bg-white/[0.05]"
                        >
                          Admin
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleLogout}
                        className="block w-full border-t border-white/[0.06] px-3 py-2 text-left text-sm text-zinc-400 transition-colors hover:bg-white/[0.05] hover:text-white"
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

      <MobileNavPanel open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <PresenceDock />
      <MatchDeveloperModal
        open={matchOpen}
        onClose={() => {
          setMatchOpen(false);
          void refreshNavData();
        }}
      />
    </>
  );
}
