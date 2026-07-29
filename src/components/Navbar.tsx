'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import BrandLogo from '@/components/BrandLogo';
import NavDropdown from '@/components/NavDropdown';
import { duration, easePremium } from '@/components/motion/tokens';

export default function Navbar() {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState('');

  return (
    <m.div
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      initial={reduce ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.base, ease: easePremium, delay: 0.05 }}
    >
      <nav className="relative w-full max-w-5xl" aria-label="Ana navigasyon">
        <div className="relative flex h-12 items-center justify-between gap-3 rounded-full border border-white/[0.08] bg-black/50 pl-4 pr-2 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl backdrop-saturate-150">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <BrandLogo />
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 sm:flex">
              <Search className="h-3.5 w-3.5 text-zinc-500" strokeWidth={1.5} aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ara…"
                className="w-28 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500 lg:w-40"
                aria-label="Servis ara"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden md:block">
              <NavDropdown />
            </div>
            <Link
              href="/services"
              className="rounded-full px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:text-white md:hidden"
            >
              Kategoriler
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-[opacity,transform] duration-premium ease-premium hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.98]"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
    </m.div>
  );
}
