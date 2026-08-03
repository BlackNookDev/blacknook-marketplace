'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

const SELL_LINKS = [
  { href: '/select', label: 'Blacknook Select' },
  { href: '/sell', label: 'Partner programı' },
  { href: '/partners/overview', label: 'Partner Portal' },
  { href: '/partners/self-submission', label: 'Ürününü listele' },
  { href: '/partners/status', label: 'Başvuru durumu' },
] as const;

export default function FooterSellColumn() {
  const { status } = useSession();
  const loggedIn = status === 'authenticated';

  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-white">Satış</p>
      <nav aria-label="Satış ve partner sayfaları">
        <ul className="space-y-3">
          {SELL_LINKS.map((link) => {
            const href = loggedIn
              ? link.href
              : `/login?callbackUrl=${encodeURIComponent(link.href)}`;
            return (
              <li key={link.href}>
                <Link
                  href={href}
                  className="text-sm text-zinc-400 transition-colors duration-premium ease-premium hover:text-zinc-100"
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
