'use client';

import { useEffect, useState } from 'react';
import { getActiveDeveloperCount } from '../../../lib/developerPresence';

type Props = {
  className?: string;
};

/** Navbar Eşleş yanındaki mini presence */
export default function MatchPresenceBadge({ className = '' }: Props) {
  const [active, setActive] = useState(2);

  useEffect(() => {
    const tick = () => setActive(getActiveDeveloperCount());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full bg-black/25 px-1 py-px text-[9px] font-bold tabular-nums text-black/80 ${className}`}
      aria-hidden
    >
      <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-700" />
      {active}
    </span>
  );
}
