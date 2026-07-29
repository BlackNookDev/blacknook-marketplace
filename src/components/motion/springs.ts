import { easePremium, duration } from './tokens';

/** Premium reveals — tween, no overshoot (motion-design Premium). */
export const revealSpring = {
  type: 'tween' as const,
  duration: duration.slow,
  ease: easePremium,
};

/** Micro interactions — still no bounce for Premium personality. */
export const microSpring = {
  type: 'tween' as const,
  duration: duration.fast,
  ease: easePremium,
};
