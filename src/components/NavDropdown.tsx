'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import { getFeaturedServices } from '../../lib/data';
import { ECOSYSTEM_NAV } from '../../lib/navMenus';

const FEATURED_LOGOS = getFeaturedServices(6);

export default function NavDropdown() {
  const [activeCat, setActiveCat] = useState(ECOSYSTEM_NAV.categories[1]?.href ?? '');

  return (
    <div className="group relative hidden md:block">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-zinc-400 transition-colors duration-premium ease-premium hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 group-hover:text-white"
        aria-haspopup="menu"
        aria-expanded="false"
      >
        {ECOSYSTEM_NAV.label}
        <ChevronDown
          className="h-3.5 w-3.5 opacity-60 transition-transform duration-premium ease-premium group-hover:rotate-180"
          aria-hidden
        />
      </button>

      <div
        className="invisible absolute right-0 top-[calc(100%+0.4rem)] z-50 w-[min(42rem,calc(100vw-2rem))] origin-top-right scale-[0.98] opacity-0 transition-all duration-premium ease-premium group-hover:visible group-hover:scale-100 group-hover:opacity-100 group-focus-within:visible group-focus-within:scale-100 group-focus-within:opacity-100 xl:w-[46rem]"
        role="menu"
        aria-label={ECOSYSTEM_NAV.label}
      >
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/95 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150">
          <div className="grid grid-cols-3 divide-x divide-white/[0.06]">
            <div className="flex flex-col p-4 sm:p-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                Kategoriler
              </p>
              <ul className="flex-1 space-y-0.5">
                {ECOSYSTEM_NAV.categories.map((item) => {
                  const active = activeCat === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        role="menuitem"
                        onMouseEnter={() => setActiveCat(item.href)}
                        className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                          active
                            ? 'bg-sky-500/15 font-medium text-sky-100'
                            : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                        }`}
                      >
                        <span>{item.label}</span>
                        {'badge' in item && item.badge ? (
                          <span className="shrink-0 rounded bg-sky-500/20 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-sky-300">
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href={ECOSYSTEM_NAV.href}
                role="menuitem"
                className="mt-4 inline-flex items-center gap-1.5 px-3 pt-3 text-sm font-semibold text-zinc-100 transition-colors hover:text-white"
              >
                {ECOSYSTEM_NAV.browseAllLabel}
                <ArrowRight className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
              </Link>
            </div>

            <div className="p-4 sm:p-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                Trend
              </p>
              <ul className="space-y-3.5">
                {ECOSYSTEM_NAV.trending.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      role="menuitem"
                      className="group/item block rounded-lg transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-zinc-100 group-hover/item:text-white">
                        {item.title}
                        {'badge' in item && item.badge ? (
                          <span className="rounded bg-emerald-500 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-white">
                            {item.badge}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-zinc-500">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 sm:p-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                Öne çıkan
              </p>
              <Link
                href={ECOSYSTEM_NAV.featured.href}
                role="menuitem"
                className="group/card block overflow-hidden rounded-xl border border-white/10 transition-[border-color] hover:border-white/20"
              >
                <div className="relative grid h-28 grid-cols-3 gap-1.5 bg-zinc-900 p-3">
                  {FEATURED_LOGOS.map((s) => (
                    <div
                      key={s.slug}
                      className="flex items-center justify-center rounded-lg bg-white/[0.06]"
                    >
                      <ServiceCatalogLogo
                        icon={s.icon}
                        brandColor={s.brandColor}
                        name={s.name}
                        size="sm"
                      />
                    </div>
                  ))}
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.18),transparent_55%)]"
                    aria-hidden
                  />
                </div>
                <div className="bg-sky-500/10 px-3.5 py-3.5">
                  <p className="text-sm font-bold text-white">{ECOSYSTEM_NAV.featured.title}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {ECOSYSTEM_NAV.featured.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-zinc-950 transition-opacity group-hover/card:opacity-90">
                    {ECOSYSTEM_NAV.featured.cta}
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
