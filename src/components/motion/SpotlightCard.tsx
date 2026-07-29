'use client';

import { useMotionTemplate, useMotionValue, m } from 'framer-motion';
import type { MouseEvent, ReactNode } from 'react';

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  radius?: number;
};

/** useMotionValue + useMotionTemplate — re-render önleme (framer-motion). */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255,255,255,0.1)',
  radius = 220,
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 65%)`;

  return (
    <div className={className} onMouseMove={onMouseMove}>
      <m.div
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background }}
      />
      {children}
    </div>
  );
}
