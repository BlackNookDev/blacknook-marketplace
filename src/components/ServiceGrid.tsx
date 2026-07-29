'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { m, useReducedMotion, type Variants } from 'framer-motion';
import ServiceDealCard from '@/components/ServiceDealCard';
import { staggerFast } from '@/components/motion/tokens';
import { getFeaturedServices } from '../../lib/data';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

const FEATURED = getFeaturedServices(12);

export default function ServiceGrid() {
  const reduce = useReducedMotion();

  return (
    <section
      id="service-grid"
      className="relative w-full pb-20 pt-8 md:pb-28 md:pt-12"
      aria-labelledby="service-grid-heading"
    >
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <h2
            id="service-grid-heading"
            className="font-display text-2xl font-bold tracking-tight text-zinc-50 md:text-3xl"
          >
            Servisler
          </h2>
          <Link
            href="/services"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-zinc-200 transition-colors duration-premium ease-premium hover:border-white/25 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
          >
            Daha fazla
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <m.div
          className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={reduce ? undefined : staggerFast}
          initial={reduce ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.04 }}
        >
          {FEATURED.map((service, index) => (
            <m.div key={service.slug} variants={reduce ? undefined : cardVariants}>
              <ServiceDealCard service={service} index={index} />
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
