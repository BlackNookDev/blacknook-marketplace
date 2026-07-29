'use client';

import { useRef } from 'react';
import { Check, ChevronLeft, ChevronRight, Shield, X } from 'lucide-react';
import type { PricingCell, ServicePricingPlan } from '../../lib/pricingTiers';

type Props = {
  serviceName: string;
  plan: ServicePricingPlan;
};

function CellValue({ value }: { value: PricingCell }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white"
        aria-label="Dahil"
      >
        <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
      </span>
    ) : (
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/90 text-white"
        aria-label="Dahil değil"
      >
        <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
      </span>
    );
  }

  return <span className="text-sm font-medium text-zinc-200">{value}</span>;
}

export default function ServicePricingTable({ serviceName, plan }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(280, el.clientWidth * 0.7), behavior: 'smooth' });
  };

  return (
    <section className="mt-20 border-t border-white/[0.08] pt-16" aria-labelledby="pricing-heading">
      <div className="mb-10 text-center">
        <h2
          id="pricing-heading"
          className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
        >
          Size en uygun planı seçin
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-base">
          BlackNOOK&apos;un 60 günlük para iade garantisi ile {serviceName} lisansını güvenle
          satın alın.
        </p>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="absolute -left-2 top-[7.5rem] z-20 hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-950/90 text-zinc-300 shadow-lg backdrop-blur md:flex lg:-left-4"
          aria-label="Önceki planlar"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="absolute -right-2 top-[7.5rem] z-20 hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-950/90 text-zinc-300 shadow-lg backdrop-blur md:flex lg:-right-4"
          aria-label="Sonraki planlar"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>

        <div
          ref={scrollerRef}
          className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <table className="w-full min-w-[52rem] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-44 min-w-[11rem] bg-[var(--bn-bg,#050505)] p-3 text-left align-bottom sm:w-52">
                  <span className="sr-only">Özellik</span>
                </th>
                {plan.tiers.map((tier) => (
                  <th
                    key={tier.id}
                    className={`relative min-w-[10.5rem] px-3 pb-4 pt-6 text-center align-bottom ${
                      tier.recommended
                        ? 'rounded-t-2xl border-x border-t border-sky-400/50 bg-sky-500/[0.07]'
                        : ''
                    }`}
                  >
                    {tier.recommended && (
                      <span className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-sky-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Önerilen
                      </span>
                    )}
                    <p className="mt-3 text-sm font-semibold text-zinc-200">{tier.name}</p>
                    <p className="mt-2 flex items-baseline justify-center gap-2">
                      <span className="font-display text-3xl font-bold text-white">
                        ${tier.price}
                      </span>
                      <span className="text-sm text-zinc-500 line-through">
                        ${tier.originalPrice}
                      </span>
                    </p>
                    <button
                      type="button"
                      className="mt-4 w-full rounded-lg bg-amber-400 px-3 py-2.5 text-sm font-bold text-zinc-950 transition-[opacity,transform] duration-premium ease-premium hover:opacity-90 active:scale-[0.98]"
                    >
                      Şimdi satın al
                    </button>
                    <p className="mt-2 text-xs text-zinc-500">Ömür boyu erişim</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plan.features.map((row, rowIndex) => (
                <tr key={row.label}>
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 bg-[var(--bn-bg,#050505)] px-3 py-3.5 text-left text-sm font-medium text-zinc-400 ${
                      rowIndex === 0 ? 'border-t border-white/[0.08]' : ''
                    }`}
                  >
                    {row.label}
                  </th>
                  {row.values.map((value, colIndex) => {
                    const recommended = plan.tiers[colIndex]?.recommended;
                    const isLast = rowIndex === plan.features.length - 1;
                    return (
                      <td
                        key={`${row.label}-${colIndex}`}
                        className={`px-3 py-3.5 text-center ${
                          rowIndex === 0 ? 'border-t border-white/[0.08]' : ''
                        } ${
                          recommended
                            ? `border-x border-sky-400/50 bg-sky-500/[0.07] ${
                                isLast ? 'rounded-b-2xl border-b' : ''
                              }`
                            : ''
                        }`}
                      >
                        <div className="flex justify-center">
                          <CellValue value={value} />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-zinc-400">
        <p className="inline-flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400" aria-hidden />
          60 güne kadar iade edilebilir
        </p>
        <p className="inline-flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-400" aria-hidden />
          Garantimiz altındasınız
        </p>
      </div>
    </section>
  );
}
