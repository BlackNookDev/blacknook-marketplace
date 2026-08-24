'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Lock, LogOut, Menu, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { signOut } from 'next-auth/react';
import { usePartnerAccess } from '@/components/partners/portal/PartnerAccess';
import { DeveloperPortalGate } from '@/components/developers/DeveloperPortalGate';
import { PARTNER_PORTAL_NAV } from '@/lib/partnerPortal';
import { cn } from '@/lib/utils';
import { PaytrTrustRow } from '@/components/PaytrLogo';

type Props = {
  title: string;
  children: ReactNode;
};

export default function PartnerPortalShell({ title, children }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { canManage } = usePartnerAccess();

  const logout = () => {
    void signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-[var(--bn-bg,#161618)]">
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-zinc-950/95 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href="/partners/overview"
            className="inline-flex shrink-0 items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            aria-label="Blacknook Geliştirici paneli"
          >
            <Image
              src="/bn-mark.png"
              alt=""
              width={22}
              height={22}
              className="h-5 w-5 object-contain brightness-0 invert"
            />
            <span className="font-display text-[13px] font-bold tracking-wide text-white sm:text-sm">
              BLACKNOOK
              <span className="mx-1.5 text-zinc-600">|</span>
              <span className="font-semibold text-zinc-400">GELİŞTİRİCİ PORTAL</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Geliştirici portal">
            {PARTNER_PORTAL_NAV.map((item) => {
              const active = pathname === item.href;
              const locked = item.requiresApproval && !canManage;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors',
                    active
                      ? 'font-semibold text-white'
                      : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100'
                  )}
                  title={locked ? 'Geliştirici onayından sonra açılır' : undefined}
                >
                  {item.label}
                  {locked ? <Lock className="h-3 w-3 opacity-60" aria-hidden /> : null}
                  {active ? (
                    <span
                      className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-teal-400"
                      aria-hidden
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={logout}
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white sm:inline-flex"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              Çıkış yap
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-300 hover:bg-white/[0.06] lg:hidden"
              aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="border-t border-white/[0.06] px-4 py-3 lg:hidden">
            <nav className="flex flex-col gap-0.5" aria-label="Geliştirici portal mobil">
              {PARTNER_PORTAL_NAV.map((item) => {
                const active = pathname === item.href;
                const locked = item.requiresApproval && !canManage;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'inline-flex items-center justify-between rounded-lg px-3 py-2.5 text-sm',
                      active
                        ? 'bg-white/[0.08] font-semibold text-white'
                        : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white'
                    )}
                  >
                    {item.label}
                    {locked ? <Lock className="h-3.5 w-3.5 opacity-60" aria-hidden /> : null}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={logout}
                className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-400 hover:bg-white/[0.04] hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                Çıkış yap
              </button>
            </nav>
          </div>
        ) : null}
      </header>

      <div className="border-b border-white/[0.06] bg-zinc-900/80">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          {!canManage ? (
            <p className="mt-2 text-sm text-zinc-500">Başvuru onayı gerekli.</p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <DeveloperPortalGate title="Onay gerekli">
          {children}
        </DeveloperPortalGate>
      </div>

      <div className="border-t border-white/[0.06] px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-6xl justify-center sm:justify-end">
          <PaytrTrustRow />
        </div>
      </div>
    </div>
  );
}
