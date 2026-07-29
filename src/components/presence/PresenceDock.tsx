'use client';

import { useEffect, useState } from 'react';
import { getActiveDeveloperCount } from '../../../lib/developerPresence';
import DeveloperAvatars from '@/components/presence/DeveloperAvatars';

/** Sağ alt — ambient presence chip */
export default function PresenceDock() {
  const [active, setActive] = useState(10);

  useEffect(() => {
    const tick = () => setActive(getActiveDeveloperCount());
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('bn-open-match'))}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-black/70 py-1.5 pl-1.5 pr-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-[border-color,transform] hover:scale-[1.02] hover:border-emerald-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/50 active:scale-[0.98]"
      aria-label={`${active} mühendis çevrimiçi — eşleş`}
    >
      <DeveloperAvatars count={3} size="sm" />
      <span className="flex flex-col items-start leading-tight">
        <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-200">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          {active} aktif
        </span>
        <span className="text-[10px] text-zinc-500">eşleşmeye hazır</span>
      </span>
    </button>
  );
}
