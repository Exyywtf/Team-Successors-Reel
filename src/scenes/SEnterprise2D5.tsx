import React from 'react';
import { SCENE_DURATIONS } from '../lib/timing';
import { RealSitePageViewport } from '../components/RealSitePageViewport';
import { getPageScrollTiming } from '../lib/sitePageScrollTiming';

const SCENE_TOTAL = SCENE_DURATIONS.S05;
const { fadeInEnd: FADE_IN_END, pushEnd: PUSH_END, scrollStart: SCROLL_START, scrollEnd: SCROLL_END, fadeOutStart: FADE_OUT_START } =
  getPageScrollTiming(SCENE_TOTAL);

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
      maxScrollProgress={0.88}
      driftXAmp={4.3}
      driftYAmp={2.6}
      driftXDiv={44}
      driftYDiv={60}
      tiltXStart={10}
      tiltXEnd={3.2}
      tiltYStart={-4.5}
      tiltYEnd={1}
      scaleStart={0.85}
      scaleEnd={1.005}
      entryYOffset={60}
      glowOpacityBase={0.86}
    />
  );
};
