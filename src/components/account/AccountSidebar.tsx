'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CreditCard,
  Gift,
  Grid2X2,
  LogOut,
  MessageSquare,
  Plus,
  User,
  Users,
  Coins,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { ACCOUNT_NAV, type AccountNavIcon } from '@/components/account/accountNav';
import { cn } from '@/lib/utils';

const ICONS: Record<AccountNavIcon, typeof User> = {
  user: User,
  requests: MessageSquare,
  grid: Grid2X2,
  card: CreditCard,
  coins: Coins,
  gift: Gift,
  plus: Plus,
  users: Users,
};

export default function AccountSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/account' ? pathname === '/account' : pathname.startsWith(href);

  const handleLogout = () => {
    void signOut({ callbackUrl: '/' });
  };

  return (
    <aside className="w-full shrink-0 md:w-56 lg:w-60">
      <nav aria-label="Hesap menüsü" className="flex flex-col gap-0.5">
        {ACCOUNT_NAV.map((item) => {
          const Icon = ICONS[item.icon];
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors',
                active
                  ? 'bg-emerald-500/15 font-semibold text-emerald-300'
                  : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              {item.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 inline-flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-100"
        >
          <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
          Çıkış yap
        </button>
      </nav>
    </aside>
  );
}
