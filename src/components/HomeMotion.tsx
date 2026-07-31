'use client';

import HeroMailCollector from '@/components/home/HeroMailCollector';
import WelcomePopup from '@/components/home/WelcomePopup';
import ServiceGrid from '@/components/ServiceGrid';

export default function HomeMotion() {
  return (
    <main className="relative bg-transparent">
      <HeroMailCollector />
      <ServiceGrid />
      <WelcomePopup />
    </main>
  );
}
