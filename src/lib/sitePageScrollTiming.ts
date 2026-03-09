export const PAGE_SCROLL_BASELINE = {
  fadeInEnd: 14,
  pushEnd: 30,
  scrollStart: 24,
  scrollEndPadding: 16,
  fadeOutPadding: 12,
} as const;

export const getPageScrollTiming = (sceneTotal: number) => ({
  fadeInEnd: PAGE_SCROLL_BASELINE.fadeInEnd,
  pushEnd: PAGE_SCROLL_BASELINE.pushEnd,
  scrollStart: PAGE_SCROLL_BASELINE.scrollStart,
  scrollEnd: sceneTotal - PAGE_SCROLL_BASELINE.scrollEndPadding,
  fadeOutStart: sceneTotal - PAGE_SCROLL_BASELINE.fadeOutPadding,
});
