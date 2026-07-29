'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Loader2, Shield, Sparkles } from 'lucide-react';
import { m, useReducedMotion } from 'framer-motion';
import ServiceCatalogLogo from '@/components/ServiceCatalogLogo';
import { duration, easePremium } from '@/components/motion/tokens';
import { getFeaturedServices } from '../../../lib/data';

const FLOATING = getFeaturedServices(8).map((s, i) => ({
  ...s,
  // yüzde konum + hafif rotasyon
  style: [
    { top: '8%', left: '6%', rotate: -12, size: 'lg' as const },
    { top: '12%', right: '8%', rotate: 10, size: 'md' as const },
    { top: '38%', left: '3%', rotate: 8, size: 'md' as const },
    { top: '42%', right: '4%', rotate: -8, size: 'lg' as const },
    { bottom: '22%', left: '10%', rotate: -6, size: 'md' as const },
    { bottom: '18%', right: '9%', rotate: 14, size: 'md' as const },
    { top: '58%', left: '18%', rotate: 4, size: 'sm' as const },
    { top: '62%', right: '16%', rotate: -4, size: 'sm' as const },
  ][i],
  delay: i * 0.35,
}));

const TRUST = [
  { icon: Sparkles, label: 'Seçilmiş premium servisler' },
  { icon: Shield, label: 'Doğrulanmış sağlayıcılar' },
  { icon: Check, label: '50+ araç tek pazaryerinde' },
];

export default function HeroMailCollector() {
  const reduce = useReducedMotion();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading' || !email.trim()) return;
    setStatus('loading');
    window.setTimeout(() => {
      setStatus('done');
      setEmail('');
      window.setTimeout(() => setStatus('idle'), 3500);
    }, 1100);
  };

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-28">
      {/* Atmosfer */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="absolute left-1/2 top-[28%] h-[55vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,transparent_68%)] blur-2xl" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bn-bg,#050505)] to-transparent" />
      </div>

      {/* Yüzen logo’lar */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        {FLOATING.map((item) => (
          <m.div
            key={item.slug}
            className="absolute"
            style={{
              top: item.style.top,
              left: item.style.left,
              right: item.style.right,
              bottom: item.style.bottom,
              rotate: `${item.style.rotate}deg`,
            }}
            animate={
              reduce
                ? undefined
                : {
                    y: [0, -10, 0],
                    rotate: [
                      item.style.rotate,
                      item.style.rotate + 3,
                      item.style.rotate,
                    ],
                  }
            }
            transition={{
              duration: 5 + item.delay,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: item.delay,
            }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md lg:h-16 lg:w-16">
              <ServiceCatalogLogo
                icon={item.icon}
                brandColor={item.brandColor}
                name={item.name}
                size={item.style.size === 'lg' ? 'md' : 'sm'}
              />
            </div>
          </m.div>
        ))}
      </div>

      {/* Merkez kart */}
      <m.div
        className="relative z-10 w-full max-w-lg"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.scene, ease: easePremium }}
      >
        <div className="relative rounded-3xl border border-white/10 bg-zinc-950/80 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-zinc-900 shadow-lg">
              <Image
                src="/bn-mark.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 object-contain brightness-0 invert"
                priority
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <h1 className="font-display text-[1.65rem] font-bold leading-tight tracking-tight text-white sm:text-3xl">
              İşiniz için premium yazılım.
              <span className="mt-1 block text-zinc-400">Tek seferlik lisanslarla.</span>
            </h1>
            <p className="mt-4 text-sm text-zinc-500 sm:text-base">
              Deal uyarıları alın + ilk satın alımda %10 indirim
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <label htmlFor="hero-email" className="sr-only">
              Email
            </label>
            <input
              id="hero-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'done'}
              placeholder="Email"
              className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-500 focus:border-white/30 focus:ring-2 focus:ring-white/10 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'done'}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-bold text-black transition-[opacity,transform] duration-premium ease-premium hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Kaydediliyor…
                </>
              ) : status === 'done' ? (
                <>
                  <Check className="h-4 w-4" aria-hidden />
                  Listeye eklendiniz
                </>
              ) : (
                '%10 indirim al'
              )}
            </button>
          </form>
        </div>
      </m.div>

      {/* Trust bar */}
      <m.ul
        className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: duration.base, ease: easePremium }}
      >
        {TRUST.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2 text-sm text-zinc-400">
            <Icon className="h-4 w-4 text-zinc-300" strokeWidth={1.75} aria-hidden />
            {label}
          </li>
        ))}
      </m.ul>
    </section>
  );
}
