'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, PlusCircle, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type Item = { href: string; label: string; icon: typeof LayoutDashboard };

const VENDOR_NAV: Item[] = [
  { href: '/partners/overview', label: 'Kontrol Paneli', icon: LayoutDashboard },
  { href: '/partners/listings', label: 'Listeler', icon: Package },
  { href: '/partners/self-submission', label: 'Yeni ürün', icon: PlusCircle },
];

const ADMIN_NAV: Item[] = [
  { href: '/admin/developers', label: 'Partner başvuruları', icon: Users },
  { href: '/admin/products', label: 'Ürün moderasyonu', icon: Shield },
];

type Props = {
  variant: 'vendor' | 'admin';
};

export default function PanelNav({ variant }: Props) {
  const pathname = usePathname();
  const items = variant === 'vendor' ? VENDOR_NAV : ADMIN_NAV;

  return (
    <nav
      aria-label={variant === 'vendor' ? 'Partner paneli' : 'Admin paneli'}
      className="mb-8 flex flex-wrap gap-1 border-b border-white/[0.08] pb-3"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === '/partners/overview'
            ? pathname === '/partners/overview'
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
              active
                ? 'bg-white/[0.08] font-semibold text-white'
                : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
