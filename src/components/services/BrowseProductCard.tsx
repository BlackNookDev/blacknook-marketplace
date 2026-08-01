'use client';

import Link from 'next/link';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import type { ServiceCatalogEntry } from '../../../lib/data';
import {
  getBrowseBadge,
  getBrowseReviewCount,
  type BrowseBadge,
} from '../../../lib/browseMeta';
import { cn } from '@/lib/utils';

type Props = {
  service: ServiceCatalogEntry;
  index: number;
  className?: string;
};

function BadgeLabel({ badge }: { badge: BrowseBadge }) {
  if (badge === 'select') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-400">
        <span aria-hidden>◆</span> Blacknook Select
      </span>
    );
  }
  if (badge === 'new') {
    return (
      <span className="inline-flex rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
        Yeni
      </span>
    );
  }
  return null;
}

/** Ekosistem ürün kartı: hero + rozet + kategori + açıklama + fiyat */
export default function BrowseProductCard({ service, index, className }: Props) {
  const badge = getBrowseBadge(service, index);
  const reviews = getBrowseReviewCount(service);

  return (
    <Link
      href={`/service/${service.slug}`}
      aria-label={`${service.name}, ${service.category}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#1c1c1e] transition-[border-color,transform,box-shadow] duration-premium ease-premium',
        'hover:-translate-y-0.5 hover:border-white/18 hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40',
        className
      )}
    >
      {/* Hero media plane */}
      <div
        className="relative aspect-[16/10] overflow-hidden"
        style={{
          background: `linear-gradient(145deg, ${service.brandColor}cc 0%, #0a0a0b 72%)`,
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08), transparent 40%)',
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden
        />

        {badge === 'new' ? (
          <div className="absolute inset-x-0 top-0 z-10 flex justify-center bg-emerald-500 py-1 text-[11px] font-bold text-white">
            Yeni!
          </div>
        ) : null}

        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black/35 shadow-lg ring-1 ring-white/20 backdrop-blur-sm transition-transform duration-premium group-hover:scale-105 sm:h-[4.5rem] sm:w-[4.5rem]">
            <ServiceCatalogLogo
              icon={service.icon}
              brandColor={service.brandColor}
              name={service.name}
              size="lg"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3">
        {badge === 'select' ? (
          <div className="mb-1.5">
            <BadgeLabel badge="select" />
          </div>
        ) : (
          <div className="mb-1.5 h-4" aria-hidden />
        )}

        <h3 className="truncate font-display text-[15px] font-bold leading-tight tracking-tight text-zinc-50 group-hover:text-white">
          {service.name}
        </h3>
        <p className="mt-0.5 text-[12px] text-zinc-500">
          <span className="text-zinc-600">kategori · </span>
          <span className="text-zinc-400">{service.category}</span>
        </p>

        <p className="mt-2 line-clamp-3 min-h-[3.75rem] text-[13px] leading-snug text-zinc-400">
          {service.description}
        </p>

        <p className="mt-3 text-[12px] text-zinc-500">
          <span className="font-medium text-sky-400/90">{reviews} inceleme</span>
        </p>

        <p className="mt-2 text-[15px] font-bold text-white">Ücretsiz</p>
      </div>
    </Link>
  );
}
