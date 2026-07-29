'use client';

import Link from 'next/link';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';
import { X } from 'lucide-react';
import { duration, easePremium } from '@/components/motion/tokens';

type Props = {
  open: boolean;
  onClose: () => void;
  mounted: boolean;
};

/** Giriş yapılmamış kullanıcılar için login / kayıt popup */
export default function AuthRequiredModal({ open, onClose, mounted }: Props) {
  const modal = (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: easePremium }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-required-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Kapat"
            onClick={onClose}
          />

          <m.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: duration.base, ease: easePremium }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-zinc-900/80 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>

            <h2
              id="auth-required-title"
              className="pr-10 font-display text-2xl font-bold tracking-tight text-white"
            >
              Üyelik gerekli
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Kurulum talebi göndermek için giriş yapın veya yeni bir hesap oluşturun.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={onClose}
                className="flex h-12 items-center justify-center rounded-xl bg-white text-sm font-bold text-black transition-opacity hover:opacity-90"
              >
                Giriş yap
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/[0.08]"
              >
                Kayıt ol
              </Link>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modal, document.body);
}
