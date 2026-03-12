import React from 'react';
import { RealSitePageViewport } from '../components/RealSitePageViewport';
import { PAGE_SCROLL_SCENE_TIMINGS } from '../lib/sitePageScrollTiming';

const {
  sceneTotal: SCENE_TOTAL,
  fadeInEnd: FADE_IN_END,
  pushEnd: PUSH_END,
  scrollStart: SCROLL_START,
  scrollEnd: SCROLL_END,
  fadeOutStart: FADE_OUT_START,
  maxScrollProgress: MAX_SCROLL_PROGRESS,
} = PAGE_SCROLL_SCENE_TIMINGS.engineering;

export const SEngineering2D5: React.FC = () => {
  return (
    <RealSitePageViewport
      path="/engineering"
      urlLabel="successorsf1.com/engineering"
      sceneTotal={SCENE_TOTAL}
      fadeInEnd={FADE_IN_END}
      pushEnd={PUSH_END}
      scrollStart={SCROLL_START}
      scrollEnd={SCROLL_END}
      fadeOutStart={FADE_OUT_START}
      maxScrollProgress={MAX_SCROLL_PROGRESS}
      driftXAmp={4.6}
      driftYAmp={2.8}
      driftXDiv={42}
      driftYDiv={58}
      tiltXStart={10}
      tiltXEnd={3}
      tiltYStart={-4.5}
      tiltYEnd={1}
      scaleStart={0.85}
      scaleEnd={1.005}
      entryYOffset={60}
      glowOpacityBase={0.86}
    />
  );
};
