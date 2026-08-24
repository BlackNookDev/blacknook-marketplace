'use client';

import Image from 'next/image';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import { accentFromBrand, promoImageFor } from '@/lib/servicePromo';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  slug: string;
  description?: string;
  category: string;
  brandColor: string;
  icon: string;
  features?: string[];
  className?: string;
  eyebrow?: string;
  badge?: React.ReactNode;
  /** Partner cover URL — varsa tema görseli yerine kullanılır */
  coverSrc?: string | null;
  coverAlt?: string;
};

/** Servis detay hero — öğren rehberi gibi full-bleed arkaplan + alt metin */
export default function ServicePromoVisual({
  name,
  slug,
  description,
  category,
  brandColor,
  icon,
  className,
  eyebrow,
  badge,
  coverSrc,
  coverAlt,
}: Props) {
  const src = coverSrc || promoImageFor(slug, category);
  const accent = accentFromBrand(brandColor || '#71717a');
  const tag = eyebrow || `Blacknook · ${category}`;
  const remoteOrData =
    Boolean(coverSrc) &&
    (coverSrc!.startsWith('http') ||
      coverSrc!.startsWith('data:') ||
      coverSrc!.startsWith('blob:') ||
      coverSrc!.startsWith('/uploads'));

  return (
    <section
      className={cn('relative min-h-[48svh] overflow-hidden sm:min-h-[64svh]', className)}
      aria-label={`${name} tanıtımı`}
    >
      <Image
        src={src}
        alt={coverAlt || ''}
        fill
        priority
        unoptimized={remoteOrData}
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bn-bg,#161618)] via-black/65 to-black/40" />
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background: `radial-gradient(ellipse 55% 40% at 75% 25%, ${accent.glow} 0%, transparent 65%)`,
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[48svh] max-w-6xl flex-col justify-end px-6 pb-10 pt-28 sm:min-h-[64svh] sm:pb-14 sm:pt-32">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black/40 ring-1 ring-white/15 backdrop-blur-md sm:h-20 sm:w-20">
            <ServiceCatalogLogo icon={icon} brandColor={brandColor} name={name} size="lg" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-300">
              {tag}
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-[clamp(1.75rem,5vw,3.25rem)] font-bold leading-[1.15] tracking-tight text-white">
                {name}
              </h1>
              {badge}
            </div>
            {description ? (
              <p className="mt-3 max-w-2xl text-base font-medium leading-snug text-zinc-300 sm:mt-4 sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
