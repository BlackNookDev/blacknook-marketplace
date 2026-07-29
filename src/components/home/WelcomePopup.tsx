'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { duration, easePremium } from '@/components/motion/tokens';

const AUTO_CLOSE_MS = 10_000;

/** Sağ panelden kısa süreli karşılama popup'ı */
export default function WelcomePopup() {
  const [open, setOpen] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), AUTO_CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <m.aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-4 z-[60] w-[min(100%-2rem,22rem)] sm:bottom-8 sm:right-6"
          initial={reduce ? false : { opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: 48 }}
          transition={{ duration: duration.base, ease: easePremium }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/90 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
              aria-hidden
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <p className="pr-8 font-display text-lg font-semibold leading-snug tracking-tight text-zinc-100">
              Ekosisteminizi beraber inşa edin
            </p>
            <div className="mt-4 h-0.5 overflow-hidden rounded-full bg-white/5" aria-hidden>
              <m.div
                className="h-full origin-left rounded-full bg-white/35"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: AUTO_CLOSE_MS / 1000, ease: 'linear' }}
              />
            </div>
          </div>
        </m.aside>
      )}
    </AnimatePresence>
  );
}
