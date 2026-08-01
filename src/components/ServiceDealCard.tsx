'use client';

import Link from 'next/link';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import type { ServiceCatalogEntry } from '../../lib/data';
import { cn } from '@/lib/utils';

type Props = {
  service: ServiceCatalogEntry;
  index: number;
  className?: string;
};

export default function ServiceDealCard({ service, className }: Props) {
  return (
    <Link
      href={`/service/${service.slug}`}
      aria-label={`${service.name} servis detayı`}
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
      </div>

      <div className="relative z-10 min-w-0 flex-1 pt-0.5">
        <h3 className="truncate text-[15px] font-bold text-zinc-50 group-hover:text-white">
          {service.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-snug text-zinc-500">
          {service.description}
        </p>

        <p className="mt-2 text-sm text-zinc-300">
          <span className="font-bold text-white">Ücretsiz</span>
        </p>
      </div>
    </Link>
  );
}
