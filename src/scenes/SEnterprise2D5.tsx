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
} = PAGE_SCROLL_SCENE_TIMINGS.enterprise;

export const SEnterprise2D5: React.FC = () => {
  return (
    <RealSitePageViewport
      path="/enterprise"
      urlLabel="successorsf1.com/enterprise"
      sceneTotal={SCENE_TOTAL}
      fadeInEnd={FADE_IN_END}
      pushEnd={PUSH_END}
      scrollStart={SCROLL_START}
      scrollEnd={SCROLL_END}
      fadeOutStart={FADE_OUT_START}
      maxScrollProgress={MAX_SCROLL_PROGRESS}
      driftXAmp={3.6}
      driftYAmp={1.9}
      driftXDiv={50}
      driftYDiv={68}
      tiltXStart={6.2}
      tiltXEnd={1.7}
      tiltYStart={8.6}
      tiltYEnd={1.6}
      scaleStart={0.845}
      scaleEnd={1.006}
      entryXOffset={134}
      entryYOffset={42}
      entryRotateZStart={1.35}
      entryRotateZEnd={0.15}
      screenOffsetX={2}
      screenOffsetY={-1}
      glowOpacityBase={0.76}
      perspectiveDistance={1500}
      perspectiveOrigin="52% 49.5%"
      backlightWidth={960}
      backlightHeight={648}
      backlightOffsetX={18}
      backlightOffsetY={-8}
      backlightBlur={86}
      shadowWidth={790}
      shadowHeight={216}
      shadowOffsetY={122}
      pushEndOverride={46}
    />
  );
};
