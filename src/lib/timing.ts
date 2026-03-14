import {PAGE_SCROLL_SCENE_TIMINGS} from './sitePageScrollTiming';
import {
  URL_INTRO_SCENE_DURATION,
  URL_INTRO_TRANSITION_DURATION,
} from './urlIntroTiming';

export const FPS = 30;

export const SCENE_DURATIONS = {
  S01: URL_INTRO_SCENE_DURATION,
  S02: PAGE_SCROLL_SCENE_TIMINGS.homepage.sceneTotal,
  S03: 156,
  S04: 72,
  S05: PAGE_SCROLL_SCENE_TIMINGS.enterprise.sceneTotal,
  S06: 97,
  S07: PAGE_SCROLL_SCENE_TIMINGS.engineering.sceneTotal,
  S08: 180,
  S09: 108,
} as const;

export const TRANSITION_DURATIONS = {
  T01: URL_INTRO_TRANSITION_DURATION,
  T02: 26,
  T03: 14,
  T04: 24,
  T05: 16,
  T06: 24,
  T07: 24,
  T08: 16,
} as const;

export const TOTAL_FRAMES =
  Object.values(SCENE_DURATIONS).reduce((sum, duration) => sum + duration, 0) -
  Object.values(TRANSITION_DURATIONS).reduce(
    (sum, duration) => sum + duration,
    0,
  );

export const dur = (scene: keyof typeof SCENE_DURATIONS) =>
  SCENE_DURATIONS[scene];
