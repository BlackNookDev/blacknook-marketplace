'use client';

import { useMatchPool } from '@/components/presence/useMatchPool';

type Props = {
  className?: string;
};

export default function MatchPresenceBadge({ className = '' }: Props) {
  const { count, loaded } = useMatchPool();
  if (!loaded) return null;

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full bg-black/25 px-1 py-px text-[9px] font-bold tabular-nums text-black/80 ${className}`}
      aria-hidden
    >
      <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-700" />
      {count}
    </span>
  );
}
