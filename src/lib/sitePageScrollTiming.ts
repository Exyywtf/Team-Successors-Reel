export type PageScrollSceneId = 'homepage' | 'enterprise' | 'engineering';

export const PAGE_SCROLL_DURATION_MULTIPLIER = 0.65;
export const PAGE_SCROLL_SPEED_MULTIPLIER = 1.35;

// Measured max-scroll distances from the real imported page previews.
const PAGE_SCROLL_MAX_SCROLL_PX: Record<PageScrollSceneId, number> = {
  homepage: 4651,
  enterprise: 2885,
  engineering: 1710,
};

// The engineering page established the baseline feel in the previous pass.
const PAGE_SCROLL_BASELINE = {
  pixelsPerFrame: 19.2375,
  scrollStart: 24,
  scrollEndPadding: 16,
  fadeInEnd: 14,
  pushEnd: 30,
  fadeOutPadding: 12,
} as const;

const BASELINE_PADDING_TOTAL =
  PAGE_SCROLL_BASELINE.scrollStart + PAGE_SCROLL_BASELINE.scrollEndPadding;
const BASELINE_SCROLL_START_RATIO =
  PAGE_SCROLL_BASELINE.scrollStart / BASELINE_PADDING_TOTAL;
const BASELINE_PUSH_EXTRA_RATIO =
  (PAGE_SCROLL_BASELINE.pushEnd - PAGE_SCROLL_BASELINE.scrollStart) /
  BASELINE_PADDING_TOTAL;
const BASELINE_FADE_IN_RATIO =
  PAGE_SCROLL_BASELINE.fadeInEnd / PAGE_SCROLL_BASELINE.scrollStart;
const BASELINE_END_HOLD_RATIO =
  (PAGE_SCROLL_BASELINE.scrollEndPadding - PAGE_SCROLL_BASELINE.fadeOutPadding) /
  BASELINE_PADDING_TOTAL;

export interface PageScrollSceneTiming {
  sceneTotal: number;
  fadeInEnd: number;
  pushEnd: number;
  scrollStart: number;
  scrollEnd: number;
  fadeOutStart: number;
  maxScrollProgress: number;
  baselineSceneTotal: number;
  baselineScrollFrames: number;
  targetScrollFrames: number;
  maxScrollPx: number;
}

const buildPageScrollSceneTiming = (
  sceneId: PageScrollSceneId,
): PageScrollSceneTiming => {
  const maxScrollPx = PAGE_SCROLL_MAX_SCROLL_PX[sceneId];
  const baselineScrollFrames = Math.round(
    maxScrollPx / PAGE_SCROLL_BASELINE.pixelsPerFrame,
  );
  const baselineSceneTotal = baselineScrollFrames + BASELINE_PADDING_TOTAL;
  const targetScrollFrames = Math.max(
    1,
    Math.round(baselineScrollFrames / PAGE_SCROLL_SPEED_MULTIPLIER),
  );
  const sceneTotal = Math.max(
    targetScrollFrames + 6,
    Math.round(baselineSceneTotal * PAGE_SCROLL_DURATION_MULTIPLIER),
  );
  const paddingFrames = Math.max(6, sceneTotal - targetScrollFrames);
  const scrollStart = Math.max(
    4,
    Math.round(paddingFrames * BASELINE_SCROLL_START_RATIO),
  );
  const scrollEndPadding = Math.max(2, paddingFrames - scrollStart);
  const fadeInEnd = Math.max(
    3,
    Math.min(scrollStart, Math.round(scrollStart * BASELINE_FADE_IN_RATIO)),
  );
  const pushEnd = Math.max(
    fadeInEnd + 1,
    Math.min(
      sceneTotal - scrollEndPadding,
      scrollStart +
        Math.max(1, Math.round(paddingFrames * BASELINE_PUSH_EXTRA_RATIO)),
    ),
  );
  const endHoldFrames = Math.max(
    1,
    Math.round(paddingFrames * BASELINE_END_HOLD_RATIO),
  );
  const fadeOutPadding = Math.max(1, scrollEndPadding - endHoldFrames);

  return {
    sceneTotal,
    fadeInEnd,
    pushEnd,
    scrollStart,
    scrollEnd: sceneTotal - scrollEndPadding,
    fadeOutStart: sceneTotal - fadeOutPadding,
    maxScrollProgress: 1,
    baselineSceneTotal,
    baselineScrollFrames,
    targetScrollFrames,
    maxScrollPx,
  };
};

export const PAGE_SCROLL_SCENE_TIMINGS = {
  homepage: buildPageScrollSceneTiming('homepage'),
  enterprise: buildPageScrollSceneTiming('enterprise'),
  engineering: buildPageScrollSceneTiming('engineering'),
} as const satisfies Record<PageScrollSceneId, PageScrollSceneTiming>;
