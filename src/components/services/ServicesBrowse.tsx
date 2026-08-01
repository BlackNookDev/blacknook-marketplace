'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Filter, Search, X } from 'lucide-react';
import BrowseProductCard from '@/components/services/BrowseProductCard';
import {
  BROWSE_CATEGORIES,
  NAV_MENUS,
  getBrowseCategory,
  getNavMenuServices,
  getServicesForBrowseCategory,
} from '../../../lib/navMenus';
import { SERVICES, type ServiceCatalogEntry } from '../../../lib/data';
import {
  BEST_FOR_OPTIONS,
  INTEGRATION_OPTIONS,
  browseHeading,
  countByBestFor,
  countByIntegration,
  countBySubcategory,
  getBrowseBadge,
  getServiceBestFor,
  getServiceIntegrations,
  type BestForId,
  type IntegrationId,
} from '../../../lib/browseMeta';
import { cn } from '@/lib/utils';

type SortKey = 'recommended' | 'name-asc' | 'name-desc' | 'category';

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'recommended', label: 'Önerilen' },
  { id: 'name-asc', label: 'İsim A–Z' },
  { id: 'name-desc', label: 'İsim Z–A' },
  { id: 'category', label: 'Kategori' },
];

function sortList(list: ServiceCatalogEntry[], sort: SortKey) {
  const next = [...list];
  if (sort === 'name-asc') next.sort((a, b) => a.name.localeCompare(b.name, 'tr'));
  else if (sort === 'name-desc') next.sort((a, b) => b.name.localeCompare(a.name, 'tr'));
  else if (sort === 'category')
    next.sort(
      (a, b) =>
        a.category.localeCompare(b.category, 'tr') || a.name.localeCompare(b.name, 'tr')
    );
  return next;
}

function parseList(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

export default function ServicesBrowse() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [debouncedQ, setDebouncedQ] = useState(q);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showAllBestFor, setShowAllBestFor] = useState(false);
  const [showAllIntegrations, setShowAllIntegrations] = useState(false);

  const category = searchParams.get('category') ?? '';
  const type = searchParams.get('type') ?? '';
  const cat = searchParams.get('cat') ?? '';
  const sort = (searchParams.get('sort') as SortKey) || 'recommended';
  const badgeFilter = searchParams.get('badge') ?? ''; // select | new
  const bestFor = parseList(searchParams.get('best'));
  const integrations = parseList(searchParams.get('int'));
  const plan = searchParams.get('plan') ?? 'all';

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(q.trim()), 220);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setQ(searchParams.get('q') ?? '');
  }, [searchParams]);

  const pushParams = useCallback(
    (patch: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([key, value]) => {
        if (!value) params.delete(key);
        else params.set(key, value);
      });
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const current = searchParams.get('q') ?? '';
    if (debouncedQ === current) return;
    pushParams({ q: debouncedQ || null });
  }, [debouncedQ, pushParams, searchParams]);

  const basePool = useMemo(() => {
    const browse = category ? getBrowseCategory(category) : undefined;
    const menu = NAV_MENUS.find((m) => m.id === type);
    if (browse) return getServicesForBrowseCategory(browse.id);
    if (menu) return getNavMenuServices(menu);
    return SERVICES;
  }, [category, type]);

  const filtered = useMemo(() => {
    let list = basePool;
    if (cat) list = list.filter((s) => s.category === cat);

    if (debouncedQ) {
      const needle = debouncedQ.toLocaleLowerCase('tr');
      list = list.filter(
        (s) =>
          s.name.toLocaleLowerCase('tr').includes(needle) ||
          s.description.toLocaleLowerCase('tr').includes(needle) ||
          s.category.toLocaleLowerCase('tr').includes(needle) ||
          s.features.some((f) => f.toLocaleLowerCase('tr').includes(needle))
      );
    }

    if (badgeFilter === 'select' || badgeFilter === 'new') {
      list = list.filter((s) => getBrowseBadge(s) === badgeFilter);
    }

    if (bestFor.length) {
      list = list.filter((s) =>
        bestFor.some((id) => getServiceBestFor(s).includes(id as BestForId))
      );
    }

    if (integrations.length) {
      list = list.filter((s) =>
        integrations.some((id) => getServiceIntegrations(s).includes(id as IntegrationId))
      );
    }

    // plan: all | free — katalog şu an ücretsiz
    if (plan === 'lifetime' || plan === 'annual') {
      list = [];
    }

    return sortList(list, SORT_OPTIONS.some((o) => o.id === sort) ? sort : 'recommended');
  }, [basePool, cat, debouncedQ, badgeFilter, bestFor, integrations, plan, sort]);

  const subcats = useMemo(() => countBySubcategory(basePool), [basePool]);
  const bestCounts = useMemo(() => countByBestFor(basePool), [basePool]);
  const intCounts = useMemo(() => countByIntegration(basePool), [basePool]);

  const heading = category
    ? browseHeading(category)
    : type
      ? `${NAV_MENUS.find((m) => m.id === type)?.label ?? ''} keşfet`
      : 'Ürünleri keşfet';

  const hasActiveFilters = Boolean(
    category || type || cat || debouncedQ || badgeFilter || bestFor.length || integrations.length || plan !== 'all'
  );

  const toggleCsv = (key: string, current: string[], id: string) => {
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    pushParams({ [key]: next.length ? next.join(',') : null });
  };

  const clearAll = () => {
    setQ('');
    startTransition(() => router.replace(pathname, { scroll: false }));
    setFiltersOpen(false);
  };

  const visibleBestFor = showAllBestFor ? BEST_FOR_OPTIONS : BEST_FOR_OPTIONS.slice(0, 5);
  const visibleIntegrations = showAllIntegrations
    ? INTEGRATION_OPTIONS
    : INTEGRATION_OPTIONS.slice(0, 5);

  const FilterPanel = (
    <div className="space-y-7 text-sm">
      {/* Shop by */}
      <section>
        <h2 className="mb-3 font-display text-sm font-semibold tracking-tight text-zinc-100">
          Kategoriye göre
        </h2>
        <ul className="space-y-1">
          {category
            ? subcats.map((item) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => {
                      pushParams({ cat: cat === item.label ? null : item.label });
                      setFiltersOpen(false);
                    }}
                    className={cn(
                      'w-full rounded-md px-1 py-1.5 text-left text-sm transition-colors',
                      cat === item.label
                        ? 'font-semibold text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    )}
                  >
                    {item.label}
                    <span className="ml-1 text-zinc-600">({item.count})</span>
                  </button>
                </li>
              ))
            : BROWSE_CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      pushParams({ category: c.id, type: null, cat: null });
                      setFiltersOpen(false);
                    }}
                    className="w-full rounded-md px-1 py-1.5 text-left text-sm text-zinc-400 transition-colors hover:text-zinc-200"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
        </ul>
      </section>

      {/* Badges */}
      <section>
        <h2 className="mb-3 font-display text-sm font-semibold tracking-tight text-zinc-100">
          Öne çıkan
        </h2>
        <ul className="space-y-2">
          {(
            [
              { id: 'select', label: 'Blacknook Select' },
              { id: 'new', label: 'Yeni eklenenler' },
            ] as const
          ).map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-center gap-2.5 text-zinc-300">
                <input
                  type="checkbox"
                  checked={badgeFilter === item.id}
                  onChange={() =>
                    pushParams({ badge: badgeFilter === item.id ? null : item.id })
                  }
                  className="h-4 w-4 rounded border-white/20 bg-transparent"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* Best for */}
      <section>
        <h2 className="mb-3 font-display text-sm font-semibold tracking-tight text-zinc-100">
          Kimler için
        </h2>
        <ul className="space-y-2">
          {visibleBestFor.map((o) => (
            <li key={o.id}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={bestFor.includes(o.id)}
                  onChange={() => toggleCsv('best', bestFor, o.id)}
                  className="h-4 w-4 rounded border-white/20 bg-transparent"
                />
                <span>
                  {o.label}{' '}
                  <span className="text-zinc-600">({bestCounts[o.id]})</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        {BEST_FOR_OPTIONS.length > 5 ? (
          <button
            type="button"
            onClick={() => setShowAllBestFor((v) => !v)}
            className="mt-2 text-sm font-medium text-zinc-300 hover:text-white"
          >
            {showAllBestFor ? 'Daha az' : 'Tümünü göster'}
          </button>
        ) : null}
      </section>

      {/* Integrations */}
      <section>
        <h2 className="mb-3 font-display text-sm font-semibold tracking-tight text-zinc-100">
          Entegrasyonlar
        </h2>
        <ul className="space-y-2">
          {visibleIntegrations.map((o) => (
            <li key={o.id}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={integrations.includes(o.id)}
                  onChange={() => toggleCsv('int', integrations, o.id)}
                  className="h-4 w-4 rounded border-white/20 bg-transparent"
                />
                <span>
                  {o.label}{' '}
                  <span className="text-zinc-600">({intCounts[o.id]})</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setShowAllIntegrations((v) => !v)}
          className="mt-2 text-sm font-medium text-zinc-300 hover:text-white"
        >
          {showAllIntegrations ? 'Daha az' : 'Tümünü göster'}
        </button>
      </section>

      {/* Plan type */}
      <section>
        <h2 className="mb-3 font-display text-sm font-semibold tracking-tight text-zinc-100">
          Plan türü
        </h2>
        <ul className="space-y-2">
          {(
            [
              { id: 'all', label: 'Tümü' },
              { id: 'free', label: 'Ücretsiz' },
              { id: 'lifetime', label: 'Ömür boyu lisans' },
              { id: 'annual', label: 'Yıllık' },
            ] as const
          ).map((o) => (
            <li key={o.id}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-400">
                <input
                  type="radio"
                  name="plan"
                  checked={plan === o.id}
                  onChange={() => pushParams({ plan: o.id === 'all' ? null : o.id })}
                  className="h-4 w-4 border-white/20 bg-transparent"
                />
                <span>{o.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* Type */}
      <section>
        <h2 className="mb-3 font-display text-sm font-semibold tracking-tight text-zinc-100">
          Katalog türü
        </h2>
        <ul className="space-y-2">
          {NAV_MENUS.filter((m) => m.id !== 'services').map((t) => (
            <li key={t.id}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  checked={type === t.id}
                  onChange={() =>
                    pushParams({
                      type: type === t.id ? null : t.id,
                      category: null,
                      cat: null,
                    })
                  }
                  className="h-4 w-4 rounded border-white/20 bg-transparent"
                />
                <span>{t.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      {hasActiveFilters ? (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm font-medium text-zinc-300 hover:text-white"
        >
          Filtreleri temizle
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      {/* Top search strip */}
      <div className="mb-8">
        <label className="relative mx-auto block max-w-2xl">
          <span className="sr-only">Ürün ara</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Ürün ara (${SERVICES.length}+)`}
            className="h-12 w-full rounded-full border border-white/15 bg-white/[0.04] py-2 pl-11 pr-10 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10"
          />
          {q ? (
            <button
              type="button"
              onClick={() => setQ('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              aria-label="Temizle"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </label>
      </div>

      {(category || type || cat) && (
        <button
          type="button"
          onClick={clearAll}
          className="mb-4 text-[13px] font-medium text-sky-400 hover:text-sky-300"
        >
          ← Tüm sonuçlara dön
        </button>
      )}

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {heading}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">{filtered.length} ürün</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 px-3 text-sm font-semibold text-zinc-200 lg:hidden"
          >
            <Filter className="h-4 w-4" aria-hidden />
            Filtrele
          </button>
          <label className="inline-flex items-center gap-2 text-sm text-zinc-500">
            <span>Sırala:</span>
            <span className="relative">
              <select
                value={sort}
                onChange={(e) =>
                  pushParams({
                    sort: e.target.value === 'recommended' ? null : e.target.value,
                  })
                }
                className="h-10 appearance-none rounded-lg border border-white/15 bg-transparent py-1.5 pl-3 pr-8 text-sm font-medium text-zinc-200 outline-none focus:border-white/30"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id} className="bg-zinc-900">
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500"
                aria-hidden
              />
            </span>
          </label>
        </div>
      </header>

      <div className="flex gap-8 xl:gap-10">
        <aside
          className="hidden w-[220px] shrink-0 border-r border-white/[0.06] pr-6 lg:block"
          aria-label="Filtreler"
        >
          {FilterPanel}
        </aside>

        <div className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 px-6 py-20 text-center">
              <p className="text-sm text-zinc-400">Bu filtrelere uygun ürün yok.</p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-4 text-sm font-medium text-sky-400 hover:text-sky-300"
              >
                Filtreleri sıfırla
              </button>
            </div>
          ) : (
            <section aria-label={`${heading} listesi`}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filtered.map((service, index) => (
                  <BrowseProductCard key={service.slug} service={service} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal aria-label="Filtreler">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Kapat"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl border border-white/10 bg-[var(--bn-bg,#161618)] p-6 pb-12 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-lg font-semibold text-white">Filtreler</p>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/[0.06]"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      ) : null}
    </div>
  );
}
