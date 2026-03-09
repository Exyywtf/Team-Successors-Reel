export const FPS = 30;

/**
 * Premium Cohesion Pass v2
 * Scene runtime is intentionally retimed for stronger continuity.
 */
export const SCENE_DURATIONS = {
  S01: 66,  // URL intro
  S02: 120, // Desktop quick-glance
  S03: 156, // Hero reveal
  S04: 72,  // Timeline
  S05: 84,  // Metrics
  S06: 180, // Engineering
  S07: 96,  // CTA
} as const;

export const TRANSITION_DURATIONS = {
  T01: 14,
  T02: 20,
  T03: 12,
  T04: 12,
  T05: 18,
  T06: 14,
} as const;

/**
 * Scene starts/ends account for transition overlap.
 */
export const SCENES = {
  S01: { start: 0, end: 66 },
  S02: { start: 52, end: 172 },
  S03: { start: 152, end: 308 },
  S04: { start: 296, end: 368 },
  S05: { start: 356, end: 440 },
  S06: { start: 422, end: 602 },
  S07: { start: 588, end: 684 },
} as const;

export const CUT_FRAMES = {
  S01_TO_S02: SCENES.S02.start,
  S02_TO_S03: SCENES.S03.start,
  S03_TO_S04: SCENES.S04.start,
  S04_TO_S05: SCENES.S05.start,
  S05_TO_S06: SCENES.S06.start,
  S06_TO_S07: SCENES.S07.start,
} as const;

export const TOTAL_FRAMES = SCENES.S07.end;

export const dur = (scene: keyof typeof SCENE_DURATIONS) =>
  SCENE_DURATIONS[scene];
