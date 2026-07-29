'use client';

import { m, type Variants } from 'framer-motion';
import { revealSpring } from './springs';

type StaggerWordsProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  as?: 'p' | 'h1' | 'h2' | 'h3';
  onMount?: boolean;
};

const container: Variants = {
  staggerHidden: {},
  staggerVisible: (custom: { delay?: number; stagger?: number } = {}) => ({
    transition: {
      staggerChildren: custom.stagger ?? 0.035,
      delayChildren: custom.delay ?? 0,
    },
  }),
};

const word: Variants = {
  staggerHidden: { y: '100%' },
  staggerVisible: {
    y: '0%',
    transition: revealSpring,
  },
};

const tagMap = {
  p: m.p,
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
} as const;

export default function StaggerWords({
  text,
  className,
  wordClassName = '',
  delay = 0,
  stagger = 0.035,
  once = true,
  as: Tag = 'p',
  onMount = false,
}: StaggerWordsProps) {
  const MotionTag = tagMap[Tag];
  const lines = text.split('\n');

  return (
    <MotionTag
      className={className}
      variants={container}
      custom={{ delay, stagger }}
      initial="staggerHidden"
      {...(onMount
        ? { animate: 'staggerVisible' as const }
        : {
            whileInView: 'staggerVisible' as const,
            viewport: { once, amount: 0.5 },
          })}
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(' ').filter(Boolean);
        return (
          <span key={`line-${lineIndex}`} className="block">
            {words.map((w, i) => (
              <span
                key={`${w}-${lineIndex}-${i}`}
                className="inline-block overflow-hidden align-bottom py-[0.06em] -my-[0.06em] mr-[0.28em] last:mr-0"
              >
                <m.span
                  className={['inline-block will-change-transform', wordClassName]
                    .filter(Boolean)
                    .join(' ')}
                  variants={word}
                >
                  {w}
                </m.span>
              </span>
            ))}
          </span>
        );
      })}
    </MotionTag>
  );
}
