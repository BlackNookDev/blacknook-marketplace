'use client';

import { DEVELOPERS, type DevPresence } from '../../../lib/developerPresence';

type Props = {
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
  pulse?: boolean;
  highlightIndex?: number;
};

const SIZE = {
  sm: 'h-6 w-6 text-[9px]',
  md: 'h-9 w-9 text-[11px]',
} as const;

export default function DeveloperAvatars({
  count = 5,
  size = 'sm',
  className = '',
  pulse = false,
  highlightIndex = -1,
}: Props) {
  const list: DevPresence[] = DEVELOPERS.slice(0, count);

  return (
    <ul className={`flex items-center ${className}`} aria-hidden>
      {list.map((dev, i) => (
        <li
          key={dev.id}
          className={`relative flex shrink-0 items-center justify-center rounded-full border-2 border-[var(--bn-bg,#050505)] font-semibold text-black ${SIZE[size]} ${
            i > 0 ? '-ml-2' : ''
          } ${pulse && highlightIndex === i ? 'z-10 scale-110 ring-2 ring-emerald-400/80' : ''} ${
            pulse ? 'transition-transform duration-300' : ''
          }`}
          style={{ backgroundColor: dev.color, zIndex: list.length - i }}
          title={dev.role}
        >
          {dev.initials}
        </li>
      ))}
    </ul>
  );
}
