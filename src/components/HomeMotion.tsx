'use client';

import HeroMailCollector from '@/components/home/HeroMailCollector';
import ScrollStorytelling from '@/components/ScrollStorytelling';
import ServiceGrid from '@/components/ServiceGrid';

export default function HomeMotion() {
  return (
    <main className="relative bg-transparent">
      <HeroMailCollector />
      <ServiceGrid />
      <ScrollStorytelling />
    </main>
  );
}
