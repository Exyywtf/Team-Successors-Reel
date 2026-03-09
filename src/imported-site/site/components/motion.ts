/**
 * Re-exports from the centralized motion library.
 * This file exists for backward compatibility — all existing imports
 * from "@/components/motion" continue to work.
 */
export {
  easeOutCubic,
  easeOutQuint,
  easeOutExpo,
  duration,
  stagger,
  SECTION_TITLE_WORD_STAGGER,
  SECTION_TITLE_WORD_DURATION,
  SUBTITLE_SPEED_FACTOR,
  SUBTITLE_DELAY_AFTER_TITLE,
  SECTION_SUBTITLE_WORD_DURATION,
  CARD_DELAY_AFTER_HEADER,
  springNav,
  springSnap,
  navIndicatorTransition,
  getRevealVariants,
  staggerItemVariants,
  cardHoverConfig,
  pageTransitionVariants,
  headlineHero,
  headlineSection,
} from "@/lib/motion";

export type { RevealVariant, SectionType, CardType } from "@/lib/motion";
