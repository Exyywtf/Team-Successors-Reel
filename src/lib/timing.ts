export const FPS = 30;
export const TOTAL_FRAMES = 660; // 22 seconds

/**
 * 7-scene order (final build pass):
 *
 * S01  URL Intro           0–72    2.4s
 * S02  Desktop Showcase    72–162  3.0s
 * S03  Hero Reveal         152–302 5.0s  (10f overlap with S02)
 * S04  Timeline            302–368 2.2s
 * S05  Metrics             368–428 2.0s
 * S06  Engineering         428–588 5.3s
 * S07  CTA End Frame       588–660 2.4s
 */
export const SCENES = {
  S01: { start: 0,   end: 72  }, // 2.4s — URL Intro
  S02: { start: 72,  end: 162 }, // 3.0s — Desktop Website Showcase
  S03: { start: 152, end: 302 }, // 5.0s — Hero Reveal (10f overlap with S02)
  S04: { start: 302, end: 368 }, // 2.2s — Timeline
  S05: { start: 368, end: 428 }, // 2.0s — Metrics
  S06: { start: 428, end: 588 }, // 5.3s — Engineering
  S07: { start: 588, end: 660 }, // 2.4s — CTA End Frame
} as const;

/** Duration helpers */
export const dur = (s: keyof typeof SCENES) =>
  SCENES[s].end - SCENES[s].start;
