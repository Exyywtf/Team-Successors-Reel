import React from 'react';
import { RealSitePageViewport } from '../components/RealSitePageViewport';
import {
  HOMEPAGE_PREVIEW_HERO_HEIGHT_REDUCTION,
  buildHeroStagePreviewStyle,
} from '../lib/siteHeroTuning';
import { PAGE_SCROLL_SCENE_TIMINGS } from '../lib/sitePageScrollTiming';

const {
  sceneTotal: SCENE_TOTAL,
  fadeInEnd: FADE_IN_END,
  pushEnd: PUSH_END,
  scrollStart: SCROLL_START,
  scrollEnd: SCROLL_END,
  fadeOutStart: FADE_OUT_START,
  maxScrollProgress: MAX_SCROLL_PROGRESS,
} = PAGE_SCROLL_SCENE_TIMINGS.homepage;
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
      maxScrollProgress={MAX_SCROLL_PROGRESS}
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
