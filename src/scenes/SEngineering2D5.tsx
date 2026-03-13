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
      driftXAmp={4.2}
      driftYAmp={2.5}
      driftXDiv={41}
      driftYDiv={56}
      tiltXStart={11.8}
      tiltXEnd={3.8}
      tiltYStart={-3.2}
      tiltYEnd={-0.4}
      scaleStart={0.79}
      scaleEnd={0.992}
      entryXOffset={-80}
      entryYOffset={68}
      entryRotateZStart={-0.45}
      entryRotateZEnd={0.02}
      screenOffsetX={0}
      screenOffsetY={2}
      glowOpacityBase={0.86}
      perspectiveDistance={1220}
      perspectiveOrigin="50.5% 52.2%"
      backlightWidth={980}
      backlightHeight={680}
      backlightOffsetX={6}
      backlightOffsetY={12}
      backlightBlur={92}
      shadowWidth={820}
      shadowHeight={226}
      shadowOffsetY={136}
      pushEndOverride={42}
    />
  );
};
