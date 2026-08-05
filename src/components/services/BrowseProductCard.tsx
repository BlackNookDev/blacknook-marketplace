'use client';

import Link from 'next/link';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import type { ServiceCatalogEntry } from '../../../lib/data';
import { cn } from '@/lib/utils';

type Props = {
  service: ServiceCatalogEntry;
  className?: string;
};

/** Servis kartı: logo · isim · kategori · kısa açıklama */
export default function BrowseProductCard({ service, className }: Props) {
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

      <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3.5">
        <h3 className="truncate font-display text-[15px] font-bold leading-tight tracking-tight text-zinc-50 group-hover:text-white">
          {service.name}
        </h3>
        <p className="mt-0.5 text-[12px] text-zinc-500">{service.category}</p>

        <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-snug text-zinc-400">
          {service.description}
        </p>

        <p className="mt-3 text-[12px] font-medium text-sky-400/90">Kurulum talep et →</p>
      </div>
    </Link>
  );
}
