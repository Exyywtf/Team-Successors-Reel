import type { Transition, Variants } from "framer-motion";

/* ─── Motion DNA ─── */

/** 
 * Primary easing (Cubic): Used for standard UI transitions.
 * Provides a "expensive" feel with smooth deceleration.
 */
export const easeOutCubic: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

/** 
 * Secondary easing (Quint): More elastic and confident.
 * Good for entering elements that need to pop.
 */
export const easeOutQuint: [number, number, number, number] = [
  0.33, 1, 0.68, 1,
];

/** 
 * Snappy easing (Expo): Fast attack, smooth settle.
 * Ideal for critical interactions (modals, dropdowns) where responsiveness is key.
 */
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── Duration Scale ─── */

export const duration = {
  fast: 0.2,
  medium: 0.45,
  slow: 0.65,
  pageTransition: 0.4,
} as const;

/* ─── Stagger Scale ─── */

export const stagger = {
  tight: 0.04,
  normal: 0.08,
  loose: 0.14,
} as const;

/* --- Section header timing (title stays unchanged; subtitle derives from title) --- */

export const SECTION_TITLE_WORD_STAGGER = 0.06;
export const SECTION_TITLE_WORD_DURATION = 0.8;
export const SUBTITLE_SPEED_FACTOR = 0.45;
export const SUBTITLE_DELAY_AFTER_TITLE = 0.06;
export const SECTION_SUBTITLE_WORD_DURATION =
  SECTION_TITLE_WORD_DURATION * SUBTITLE_SPEED_FACTOR;
export const CARD_DELAY_AFTER_HEADER = SUBTITLE_DELAY_AFTER_TITLE;

/* ─── Spring Presets ─── */

export const springNav: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.65,
};

export const springSnap: Transition = {
  type: "spring",
  stiffness: 350,
  damping: 30,
  mass: 0.8,
};

/* ─── Reveal Variant Types ─── */

export type RevealVariant =
  | "fadeUp"
  | "fadeIn"
  | "scaleIn"
  | "stagger"
  | "slideLeft"
  | "slideRight";

export type SectionType = "default" | "dense" | "showcase" | "hero";

/* ─── Reveal Variants Factory ─── */

const sectionTypeConfig: Record<
  SectionType,
  { y: number; scale: number; blur: number; duration: number }
> = {
  hero: { y: 0, scale: 0.96, blur: 6, duration: duration.slow },
  showcase: { y: 28, scale: 1, blur: 0, duration: 0.55 },
  default: { y: 20, scale: 1, blur: 0, duration: duration.medium },
  dense: { y: 14, scale: 1, blur: 0, duration: 0.38 },
};

export function getRevealVariants({
  variant,
  delay = 0,
  staggerChildren = stagger.normal,
  sectionType = "default",
}: {
  variant: RevealVariant;
  delay?: number;
  staggerChildren?: number;
  sectionType?: SectionType;
}): Variants {
  const config = sectionTypeConfig[sectionType];

  switch (variant) {
    case "fadeIn":
      return {
        hidden: {
          opacity: 0,
          filter: config.blur ? `blur(${config.blur}px)` : undefined,
        },
        visible: {
          opacity: 1,
          filter: config.blur ? "blur(0px)" : undefined,
          transition: { duration: config.duration, ease: easeOutExpo, delay },
        },
      };

    case "scaleIn":
      return {
        hidden: {
          opacity: 0,
          scale: config.scale,
          filter: config.blur ? `blur(${config.blur}px)` : undefined,
        },
        visible: {
          opacity: 1,
          scale: 1,
          filter: config.blur ? "blur(0px)" : undefined,
          transition: { duration: config.duration, ease: easeOutQuint, delay },
        },
      };

    case "stagger":
      return {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            duration: 0.35,
            ease: easeOutCubic,
            delay,
            staggerChildren,
          },
        },
      };

    case "slideLeft":
      return {
        hidden: { opacity: 0, x: 30 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: config.duration, ease: easeOutExpo, delay },
        },
      };

    case "slideRight":
      return {
        hidden: { opacity: 0, x: -30 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: config.duration, ease: easeOutExpo, delay },
        },
      };

    case "fadeUp":
    default:
      return {
        hidden: { opacity: 0, y: config.y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: config.duration, ease: easeOutExpo, delay },
        },
      };
  }
}

/* ─── Stagger Item Variants ─── */

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: easeOutCubic },
  },
};

/* ─── Card Variant Families ─── */

export type CardType = "feature" | "pricing" | "info";

export const cardHoverConfig: Record<
  CardType,
  { y: number; scale: number; shadow: string }
> = {
  feature: { y: -6, scale: 1.008, shadow: "var(--glow-purple-focus)" },
  pricing: { y: -4, scale: 1.004, shadow: "var(--glow-gold-focus)" },
  info: { y: -3, scale: 1, shadow: "var(--glow-purple-soft)" },
};

/* ─── Page Transition Variants ─── */

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.pageTransition,
      ease: easeOutCubic,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.3,
      ease: easeOutCubic,
    },
  },
};

/* ─── Headline Variants ─── */

export const headlineHero: Variants = {
  hidden: { opacity: 0, scale: 0.96, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: duration.slow, ease: easeOutQuint, delay: 0.1 },
  },
};

export const headlineSection: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.medium, ease: easeOutCubic },
  },
};

/* ─── Backward compat re-exports ─── */

export { springNav as navIndicatorTransition };
