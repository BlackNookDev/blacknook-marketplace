'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

const DEVELOPER_LINKS = [
  { href: '/developers/apply', label: 'Geliştirici ol' },
  { href: '/partners/self-submission', label: 'Ürün ekle' },
  { href: '/sell', label: 'Satış yap' },
  { href: '/partners/overview', label: 'Geliştirici paneli' },
  { href: '/select', label: 'Select programı' },
] as const;

export default function FooterSellColumn() {
  const { status } = useSession();
  const loggedIn = status === 'authenticated';

  return (
    <div>
      <p className="mb-4 text-sm font-semibold text-white">Geliştirici</p>
      <nav aria-label="Geliştirici ve satış sayfaları">
        <ul className="space-y-3">
          {DEVELOPER_LINKS.map((link) => {
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
