'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowRight, X } from 'lucide-react';
import { ECOSYSTEM_NAV } from '../../lib/navMenus';

const SITE_LINKS = [
  { href: '/partners/self-submission', label: 'Ürününü listele', gated: true },
  { href: '/sell', label: 'Satışa başla', gated: true },
  { href: '/select', label: 'Blacknook Select', gated: true },
  { href: '/partners/overview', label: 'Partner Portal', gated: true },
  { href: '/learn/online-isletme', label: 'Online işletme rehberi', gated: false },
  { href: '/learn/creator-economy', label: 'Creator economy', gated: false },
  { href: '/about', label: 'Hakkımızda', gated: false },
  { href: '/help', label: 'Yardım merkezi', gated: false },
  { href: '/careers', label: 'Kariyer', gated: false },
] as const;

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileNavPanel({ open, onClose }: Props) {
  const { status } = useSession();
  const loggedIn = status === 'authenticated';

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const hrefFor = (href: string, gated: boolean) =>
    gated && !loggedIn ? `/login?callbackUrl=${encodeURIComponent(href)}` : href;

  return (
    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal aria-label="Menü">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Menüyü kapat"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col border-r border-white/10 bg-[var(--bn-bg,#161618)] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] shadow-2xl">
        <div className="flex items-center justify-between px-4 pb-3 pt-3">
          <p className="font-display text-lg font-semibold text-white">Menü</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
          <section>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Ekosistem
            </p>
            <ul className="space-y-0.5">
              {ECOSYSTEM_NAV.categories.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-white/[0.05]"
                  >
                    <span>{item.label}</span>
                    {'badge' in item && item.badge ? (
                      <span className="shrink-0 rounded bg-sky-500/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-sky-300">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={ECOSYSTEM_NAV.href}
              onClick={onClose}
              className="mt-2 inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white"
            >
              {ECOSYSTEM_NAV.browseAllLabel}
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
            </Link>
          </section>

          <section>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Trend
            </p>
            <ul className="space-y-0.5">
              {ECOSYSTEM_NAV.trending.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.05]"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-zinc-100">
                      {item.title}
                      {'badge' in item && item.badge ? (
                        <span className="rounded bg-emerald-500 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-500">{item.description}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
              Keşfet
            </p>
            <ul className="space-y-0.5">
              {SITE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={hrefFor(item.href, item.gated)}
                    onClick={onClose}
                    className="block rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
