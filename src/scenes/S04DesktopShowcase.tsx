import React from 'react';
import { SCENE_DURATIONS } from '../lib/timing';
import { RealSitePageViewport } from '../components/RealSitePageViewport';
import {
  HOMEPAGE_PREVIEW_HERO_HEIGHT_REDUCTION,
  buildHeroStagePreviewStyle,
} from '../lib/siteHeroTuning';
import { getPageScrollTiming } from '../lib/sitePageScrollTiming';

const SCENE_TOTAL = SCENE_DURATIONS.S02;
const { fadeInEnd: FADE_IN_END, pushEnd: PUSH_END, scrollStart: SCROLL_START, scrollEnd: SCROLL_END, fadeOutStart: FADE_OUT_START } =
  getPageScrollTiming(SCENE_TOTAL);
const HOMEPAGE_PREVIEW_HERO_HEIGHT_SCALE = 1 - HOMEPAGE_PREVIEW_HERO_HEIGHT_REDUCTION;
const HOMEPAGE_PREVIEW_STYLE = buildHeroStagePreviewStyle(HOMEPAGE_PREVIEW_HERO_HEIGHT_SCALE);

export const S04DesktopShowcase: React.FC = () => {
  return (
    <RealSitePageViewport
      path="/"
      urlLabel="successorsf1.com"
      sceneTotal={SCENE_TOTAL}
      fadeInEnd={FADE_IN_END}
      pushEnd={PUSH_END}
      scrollStart={SCROLL_START}
      scrollEnd={SCROLL_END}
      fadeOutStart={FADE_OUT_START}
      maxScrollProgress={1}
      driftXAmp={5.2}
      driftYAmp={3.1}
      driftXDiv={42}
      driftYDiv={58}
      tiltXStart={11}
      tiltXEnd={3.6}
      tiltYStart={-5}
      tiltYEnd={1.1}
      scaleStart={0.84}
      scaleEnd={1.01}
      entryYOffset={66}
      glowOpacityBase={0.84}
      previewStyle={HOMEPAGE_PREVIEW_STYLE}
    />
  );
};
