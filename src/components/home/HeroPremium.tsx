'use client';

import { m, useReducedMotion } from 'framer-motion';
import { fadeUp, staggerContainer } from '@/components/motion/tokens';
import MaskedText from '@/components/motion/MaskedText';

export default function HeroPremium() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-32 text-center sm:px-10 md:pb-20 md:pt-40">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-[45%] h-[45vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.06)_0%,transparent_68%)] blur-2xl" />
      </div>

      <m.div
        className="relative z-10 flex max-w-5xl flex-col items-center"
        variants={reduce ? undefined : staggerContainer}
        initial={reduce ? false : 'hidden'}
        animate="visible"
      >
        <m.div variants={reduce ? undefined : fadeUp}>
          <MaskedText
            as="h1"
            onMount
            delay={reduce ? 0 : 0.12}
            className="font-display text-[clamp(1.75rem,4.5vw,3.25rem)] font-semibold leading-snug tracking-[-0.02em] text-zinc-100"
            lines={['Ekosisteminizi beraber inşa edin']}
          />
        </m.div>
      </m.div>
    </section>
  );
}
