'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'framer-motion';
import { Loader2, Sparkles, X } from 'lucide-react';
import DeveloperAvatars from '@/components/presence/DeveloperAvatars';
import { duration, easePremium } from '@/components/motion/tokens';
import { DEVELOPERS, getActiveDeveloperCount } from '../../lib/developerPresence';

type Phase = 'ask' | 'typing' | 'matching' | 'done';

type Props = {
  open: boolean;
  onClose: () => void;
};

const AI_PROMPT = 'Neye ihtiyacınız var?';

export default function MatchDeveloperModal({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('ask');
  const [typed, setTyped] = useState('');
  const [need, setNeed] = useState('');
  const [scanIndex, setScanIndex] = useState(0);
  const [scanned, setScanned] = useState(0);
  const [activeCount, setActiveCount] = useState(2);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setActiveCount(getActiveDeveloperCount());
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPhase('ask');
      setTyped('');
      setNeed('');
      setScanIndex(0);
      setScanned(0);
      return;
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let i = 0;
    setTyped('');
    setPhase('typing');
    const timer = window.setInterval(() => {
      i += 1;
      setTyped(AI_PROMPT.slice(0, i));
      if (i >= AI_PROMPT.length) {
        window.clearInterval(timer);
        setPhase('ask');
      }
    }, 38);

    return () => {
      document.body.style.overflow = prev;
      window.clearInterval(timer);
    };
  }, [open]);

  useEffect(() => {
    if (phase !== 'matching') return;
    setScanIndex(0);
    setScanned(0);
    const pulse = window.setInterval(() => {
      setScanIndex((i) => (i + 1) % Math.min(6, DEVELOPERS.length));
      setScanned((n) => n + 1);
    }, 420);
    return () => window.clearInterval(pulse);
  }, [phase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!need.trim() || phase === 'matching' || phase === 'done') return;
    setPhase('matching');
    window.setTimeout(() => setPhase('done'), 3200);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[220] flex flex-col bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease: easePremium }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="match-ai-title"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute left-1/2 top-1/3 h-[50vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent_65%)] blur-2xl" />
          </div>

          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-8">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <Sparkles className="h-4 w-4 text-zinc-200" aria-hidden />
              BlackNOOK Match
              <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                {activeCount} çevrimiçi
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8">
            <div className="w-full max-w-xl">
              <p id="match-ai-title" className="sr-only">
                Geliştirici eşleştirme
              </p>

              <div className="mb-8 min-h-[2.5rem]">
                <p className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {typed}
                  {phase === 'typing' && (
                    <span className="ml-0.5 inline-block h-6 w-0.5 animate-pulse bg-white align-middle" />
                  )}
                </p>
              </div>

              {phase !== 'matching' && phase !== 'done' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea
                    value={need}
                    onChange={(e) => setNeed(e.target.value)}
                    rows={4}
                    placeholder="Örn. SaaS için auth + billing kurulumuna ihtiyacım var…"
                    disabled={phase === 'typing'}
                    className="w-full resize-none rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={phase === 'typing' || !need.trim()}
                    className="h-12 w-full rounded-xl bg-white text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Geliştirici bul
                  </button>
                </form>
              )}

              {(phase === 'matching' || phase === 'done') && (
                <m.div
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: duration.base, ease: easePremium }}
                >
                  {phase === 'matching' ? (
                    <>
                      <div className="flex justify-center">
                        <DeveloperAvatars
                          count={6}
                          size="md"
                          pulse
                          highlightIndex={scanIndex}
                        />
                      </div>
                      <Loader2 className="mx-auto mt-5 h-5 w-5 animate-spin text-zinc-400" aria-hidden />
                      <p className="mt-4 font-display text-lg font-semibold text-white">
                        Geliştiriciyle iletişime geçiliyor…
                      </p>
                      <p className="mt-2 text-sm text-zinc-500">
                        {Math.min(scanned + 3, activeCount)} / {activeCount} profil taranıyor
                      </p>
                      <div className="mx-auto mt-6 h-1 max-w-xs overflow-hidden rounded-full bg-white/10">
                        <m.div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 3, ease: easePremium }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 flex justify-center">
                        <DeveloperAvatars count={3} size="md" />
                      </div>
                      <p className="font-display text-lg font-semibold text-white">
                        Eşleşme talebi alındı
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                        “{need}” için uygun geliştiriciye iletildi. En kısa sürede dönüş
                        yapılacak.
                      </p>
                      <button
                        type="button"
                        onClick={onClose}
                        className="mt-6 h-11 rounded-xl border border-white/15 px-6 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/5"
                      >
                        Kapat
                      </button>
                    </>
                  )}
                </m.div>
              )}
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
