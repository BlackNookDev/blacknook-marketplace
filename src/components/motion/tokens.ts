/**
 * Stagecraft + motion-design (Premium personality)
 * Duration 350–600ms · cubic-bezier(0.4, 0, 0.2, 1) · 0% overshoot
 */

export const easePremium = [0.4, 0, 0.2, 1] as const;

export const duration = {
  micro: 0.2,
  fast: 0.35,
  base: 0.45,
  slow: 0.55,
  scene: 0.6,
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easePremium },
  },
};

export const sceneEnter = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.scene, ease: easePremium },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.base, ease: easePremium },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

export const staggerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.06,
    },
  },
};

export const revealTween = {
  duration: duration.slow,
  ease: easePremium,
};

export const microTween = {
  duration: duration.fast,
  ease: easePremium,
};
