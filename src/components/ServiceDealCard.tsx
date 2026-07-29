'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import { getServiceDealMeta, type ServiceCatalogEntry } from '../../lib/data';
import { cn } from '@/lib/utils';

type Props = {
  service: ServiceCatalogEntry;
  index: number;
  className?: string;
};

export default function ServiceDealCard({ service, index, className }: Props) {
  const deal = getServiceDealMeta(service.slug, index);

  return (
    <Link
      href={`/service/${service.slug}`}
      className={cn(
        'group relative flex gap-4 rounded-xl p-3 text-left transition-colors duration-premium ease-premium',
        'hover:bg-white/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40',
        className
      )}
    >
      <div className="relative z-10 flex w-14 shrink-0 flex-col items-center gap-2 pt-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
          <ServiceCatalogLogo
            icon={service.icon}
            brandColor={service.brandColor}
            name={service.name}
            size="md"
          />
        </div>
        {deal.endsIn && (
          <span className="rounded px-1.5 py-0.5 text-center text-[9px] font-semibold leading-tight text-rose-300 bg-rose-500/15 ring-1 ring-rose-400/20">
            {deal.endsIn}
          </span>
        )}
      </div>

      <div className="relative z-10 min-w-0 flex-1 pt-0.5">
        <h3 className="truncate text-[15px] font-bold text-zinc-50 group-hover:text-white">
          {service.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-zinc-500">
          {service.description}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-0.5" aria-label="5 üzerinden 5 yıldız">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                aria-hidden
              />
            ))}
          </div>
          <span className="text-sm font-medium text-sky-400">{deal.reviews} reviews</span>
        </div>

        <p className="mt-2 text-sm text-zinc-300">
          <span className="font-bold text-white">${deal.price}</span>
          <span className="text-zinc-400"> /lifetime</span>
          <span className="ml-2 text-zinc-600 line-through">${deal.originalPrice}</span>
        </p>
      </div>
    </Link>
  );
}
