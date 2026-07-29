'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { Check, Search, Terminal } from 'lucide-react';
import { duration, easePremium } from '@/components/motion/tokens';

type StepId = 0 | 1 | 2;

const STEPS: {
  id: StepId;
  label: string;
  title: string;
  description: string;
}[] = [
  {
    id: 0,
    label: '01 — Keşfet',
    title: 'Ekosistemi tarayın',
    description:
      'İhtiyacınıza uygun yapay zeka araçlarını, geliştirici paketlerini ve UI kitlerini tek platformda bulun.',
  },
  {
    id: 1,
    label: '02 — Lisansla',
    title: 'Tek adımda erişin',
    description: 'Güvenli ödeme altyapısıyla lisansınızı alın; anında kullanıma hazır.',
  },
  {
    id: 2,
    label: '03 — Ship edin',
    title: 'Daha hızlı çıkın',
    description:
      'Premium araçlarla geliştirme sürenizi haftalardan saatlere indirin.',
  },
];

function StepCard({
  step,
  isActive,
  registerRef,
}: {
  step: (typeof STEPS)[number];
  isActive: boolean;
  registerRef: (id: StepId, el: HTMLDivElement | null) => void;
}) {
  return (
    <div className="pb-[45vh] last:pb-20">
      <div
        ref={(el) => registerRef(step.id, el)}
        data-step={step.id}
        className={[
          'transition-[opacity,filter] duration-premium ease-premium will-change-[opacity,filter]',
          isActive ? 'opacity-100 blur-0' : 'opacity-35 blur-[1.5px]',
        ].join(' ')}
      >
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500">
          {step.label}
        </p>
        <h3 className="mb-4 font-display text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">
          {step.title}
        </h3>
        <p className="max-w-md text-base leading-relaxed text-zinc-500 md:text-lg">
          {step.description}
        </p>
      </div>
    </div>
  );
}

function DiscoverVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div
        className="pointer-events-none absolute inset-[-15%] opacity-90"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 40% 40%, rgba(255,255,255,0.08) 0%, transparent 55%), radial-gradient(ellipse 45% 45% at 70% 65%, rgba(63,63,70,0.35) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(12,12,14,0.95) 0%, #050505 100%)',
        }}
        aria-hidden
      />
      <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
        <Search className="h-9 w-9 text-white/75" strokeWidth={1.25} aria-hidden />
      </div>
    </div>
  );
}

function PaymentVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-bn-surface">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 55%)',
        }}
        aria-hidden
      />
      <div className="relative z-10 w-[min(280px,78%)] rounded-2xl border border-white/10 bg-bn-elevated/90 p-6 backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15">
          <Check className="h-6 w-6 text-white" strokeWidth={2} aria-hidden />
        </div>
        <p className="text-center text-sm font-semibold tracking-wide text-zinc-100">
          Ödeme başarılı
        </p>
        <p className="mt-1.5 text-center text-xs text-zinc-500">Lisansınız hazır</p>
        <div className="mt-5 space-y-2 rounded-xl border border-white/5 bg-black/40 px-3.5 py-3">
          <div className="flex justify-between text-[11px] text-zinc-500">
            <span>BlackNOOK License</span>
            <span className="text-zinc-300">$49.00</span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex justify-between text-[11px]">
            <span className="text-zinc-500">Durum</span>
            <span className="font-medium text-zinc-200">Aktif</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShipVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-bn-surface">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 55% 45%, rgba(255,255,255,0.05) 0%, transparent 55%)',
        }}
        aria-hidden
      />
      <div className="relative z-10 w-[min(340px,86%)] overflow-hidden rounded-2xl border border-white/10 bg-bn-elevated/80 backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-zinc-600" />
          <span className="h-2 w-2 rounded-full bg-zinc-600" />
          <span className="h-2 w-2 rounded-full bg-zinc-600" />
          <span className="ml-2 flex items-center gap-1.5 text-[10px] tracking-wide text-zinc-500">
            <Terminal className="h-3 w-3" aria-hidden />
            ship.sh
          </span>
        </div>
        <pre className="overflow-x-auto px-4 py-4 font-mono text-[12px] leading-relaxed text-zinc-400">
          <code>
            <span className="text-zinc-200">$</span> npx blacknook deploy{'\n'}
            <span className="text-zinc-600">→</span> resolving license…{' '}
            <span className="text-zinc-200">ok</span>
            {'\n'}
            <span className="text-zinc-600">→</span> bundling assets…{' '}
            <span className="text-zinc-200">done</span>
            {'\n'}
            <span className="text-white">✓</span> shipped in{' '}
            <span className="text-white">2.4s</span>
          </code>
        </pre>
      </div>
    </div>
  );
}

const VISUALS: Record<StepId, ReactNode> = {
  0: <DiscoverVisual />,
  1: <PaymentVisual />,
  2: <ShipVisual />,
};

export default function ScrollStorytelling() {
  const [activeStep, setActiveStep] = useState<StepId>(0);
  const stepRefs = useRef<Partial<Record<StepId, HTMLDivElement | null>>>({});
  const reduce = useReducedMotion();

  const registerRef = useCallback((id: StepId, el: HTMLDivElement | null) => {
    stepRefs.current[id] = el;
  }, []);

  useEffect(() => {
    let ticking = false;

    const updateActive = () => {
      ticking = false;
      const viewportCenter = window.innerHeight * 0.42;
      let bestId: StepId = 0;
      let bestDist = Number.POSITIVE_INFINITY;

      for (const step of STEPS) {
        const el = stepRefs.current[step.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestId = step.id;
        }
      }

      setActiveStep((prev) => (prev === bestId ? prev : bestId));
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  return (
    <section
      className="relative w-full"
      aria-labelledby="scroll-storytelling-heading"
    >
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-12 px-6 py-28 md:flex-row md:gap-16 md:py-36">
        <div className="order-2 w-full md:order-1 md:w-1/2">
          <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-zinc-500">
            Nasıl çalışır
          </p>
          <h2
            id="scroll-storytelling-heading"
            className="mb-14 max-w-md font-display text-3xl font-bold tracking-tight text-zinc-50 md:text-[2.5rem] md:leading-tight"
          >
            Üç adımda premium araçlara erişin
          </h2>

          {STEPS.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              isActive={activeStep === step.id}
              registerRef={registerRef}
            />
          ))}
        </div>

        <div className="order-1 sticky top-28 h-[260px] w-full shrink-0 md:order-2 md:top-32 md:h-[480px] md:w-1/2">
          <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-white/[0.02]">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
              aria-hidden
            />
            <AnimatePresence mode="wait">
              <m.div
                key={activeStep}
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: duration.base, ease: easePremium }}
              >
                {VISUALS[activeStep]}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
