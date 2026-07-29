'use client';

import { m, type Variants } from 'framer-motion';
import { revealSpring } from './springs';

type MaskedTextProps = {
  as?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
  lines: string[];
  lineClassNames?: (string | undefined)[];
  delay?: number;
  once?: boolean;
  onMount?: boolean;
};

const lineVariants: Variants = {
  hidden: { y: '100%' },
  visible: { y: '0%' },
};

export default function MaskedText({
  as: Tag = 'h2',
  className,
  lines,
  lineClassNames,
  delay = 0,
  once = true,
  onMount = false,
}: MaskedTextProps) {
  const motionProps = onMount
    ? { initial: 'hidden' as const, animate: 'visible' as const }
    : {
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once, amount: 0.4 },
      };

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className="block overflow-hidden py-[0.04em] -my-[0.04em]">
          <m.span
            className={['block will-change-transform', lineClassNames?.[i]].filter(Boolean).join(' ')}
            variants={lineVariants}
            {...motionProps}
            transition={{ ...revealSpring, delay: delay + i * 0.08 }}
          >
            {line}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}
