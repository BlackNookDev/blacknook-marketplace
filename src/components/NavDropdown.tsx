'use client';

import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { CATEGORIES_NAV } from '../../lib/navMenus';

export default function NavDropdown() {
  return (
    <div className="group relative hidden md:block">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-zinc-400 transition-colors duration-premium ease-premium hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 group-hover:text-white"
        aria-haspopup="menu"
        aria-expanded="false"
      >
        {CATEGORIES_NAV.label}
        <ChevronDown
          className="h-3.5 w-3.5 opacity-60 transition-transform duration-premium ease-premium group-hover:rotate-180"
          aria-hidden
        />
      </button>

      <div
        className="invisible absolute left-1/2 top-full z-50 w-[15.5rem] -translate-x-1/2 pt-3 opacity-0 transition-all duration-premium ease-premium group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        role="menu"
        aria-label={CATEGORIES_NAV.label}
      >
        <div className="rounded-xl border border-white/10 bg-zinc-950/95 px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-100">
            Kategoriler
          </p>
          <div className="mt-3 h-px bg-white/10" aria-hidden />

          <ul className="mt-4 space-y-3.5">
            {CATEGORIES_NAV.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  role="menuitem"
                  className="block text-[15px] text-zinc-300 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-5 border-t border-white/10 pt-4">
            <Link
              href={CATEGORIES_NAV.href}
              role="menuitem"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-zinc-100 transition-colors hover:text-white"
            >
              Tümünü gör
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
