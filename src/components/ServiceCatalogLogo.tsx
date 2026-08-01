'use client';

import { useState } from 'react';
import { resolveServiceLogo } from '@/lib/serviceIconMap';

type ServiceCatalogLogoProps = {
  icon: string;
  brandColor: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const SIZE = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
} as const;

const MONO_SIZE = {
  sm: 'text-[10px]',
  md: 'text-xs',
  lg: 'text-sm',
} as const;

function monogram(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function ServiceCatalogLogo({
  icon,
  brandColor,
  name,
  size = 'sm',
  className = '',
}: ServiceCatalogLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const dim = SIZE[size];
  const resolved = resolveServiceLogo(icon, brandColor);

  if (resolved.kind === 'icon') {
    const { Icon, color } = resolved;
    return <Icon className={`${dim} ${className}`} color={color} aria-hidden />;
  }

  if (imgFailed) {
    return (
      <span
        className={`${dim} ${MONO_SIZE[size]} inline-flex items-center justify-center font-bold text-zinc-300 ${className}`}
        aria-hidden
      >
        {monogram(name)}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved.src}
      alt={`${name} logosu`}
      className={`${dim} object-contain ${className}`}
      loading="lazy"
      decoding="async"
      onError={() => setImgFailed(true)}
    />
  );
}
