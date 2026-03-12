import { PAGE_SCROLL_SCENE_TIMINGS } from './sitePageScrollTiming';

export const FPS = 30;

/**
 * 9-scene reel with 2 new 2.5D page scrolls (Enterprise + Engineering).
 *
 * Scene order:
 *   S01  URL Intro
 *   S02  Desktop Homepage Quick-Glance
 *   S03  Hero Reveal
 *   S04  Timeline
 *   S05  Enterprise 2.5D Page Scroll    (new)
 *   S06  Metrics
 *   S07  Engineering 2.5D Page Scroll   (new)
 *   S08  Engineering Deep-Dive
 *   S09  CTA End Frame
 */
export const SCENE_DURATIONS = {
  S01: 104,   // URL intro
  S02: PAGE_SCROLL_SCENE_TIMINGS.homepage.sceneTotal,  // Desktop quick-glance
  S03: 156,  // Hero reveal
  S04: 72,   // Timeline
  S05: PAGE_SCROLL_SCENE_TIMINGS.enterprise.sceneTotal,  // Enterprise 2.5D
  S06: 84,   // Metrics
  S07: PAGE_SCROLL_SCENE_TIMINGS.engineering.sceneTotal,  // Engineering 2.5D
  S08: 180,  // Engineering deep-dive
  S09: 108,  // CTA
} as const;

export const TRANSITION_DURATIONS = {
  T01: 32,   // S01 → S02
  T02: 20,   // S02 → S03
  T03: 12,   // S03 → S04
  T04: 12,   // S04 → S05
  T05: 12,   // S05 → S06
  T06: 12,   // S06 → S07
  T07: 18,   // S07 → S08
  T08: 14,   // S08 → S09
} as const;

export const TOTAL_FRAMES =
  Object.values(SCENE_DURATIONS).reduce((sum, duration) => sum + duration, 0) -
  Object.values(TRANSITION_DURATIONS).reduce(
    (sum, duration) => sum + duration,
    0,
  );

export const dur = (scene: keyof typeof SCENE_DURATIONS) =>
  SCENE_DURATIONS[scene];
