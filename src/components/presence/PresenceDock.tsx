'use client';

import { useMatchPool } from '@/components/presence/useMatchPool';
import DeveloperAvatars from '@/components/presence/DeveloperAvatars';

export default function PresenceDock() {
  const { count, people } = useMatchPool();
  const label =
    count > 0
      ? `${count} kişi eşleşmeye açık`
      : 'Eşleşme talebi gönder';

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('bn-open-match'))}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex max-w-[calc(100vw-2.5rem)] items-center gap-2 rounded-full border border-white/10 bg-zinc-900/75 py-1.5 pl-1.5 pr-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.32)] backdrop-blur-xl transition-[border-color,transform] hover:scale-[1.02] hover:border-emerald-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400/50 active:scale-[0.98] sm:pr-3"
      aria-label={label}
    >
      <DeveloperAvatars people={people} count={Math.min(5, people.length || 0)} size="sm" />
      <span className="flex min-w-0 flex-col items-start leading-tight">
        <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-200">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          {count > 0 ? `${count} açık` : 'Eşleş'}
        </span>
        <span className="hidden text-[10px] text-zinc-500 sm:inline">
          {count > 0 ? 'eşleşmeye hazır' : 'ekip yanıtlar'}
        </span>
      </span>
    </button>
  );
}
