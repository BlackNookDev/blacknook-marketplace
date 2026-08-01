'use client';

import HeroMailCollector from '@/components/home/HeroMailCollector';
import ServiceGrid from '@/components/ServiceGrid';

export default function HomeMotion() {
  return (
    <main className="relative bg-transparent">
      <HeroMailCollector />
      <ServiceGrid />
    </main>
  );
}
