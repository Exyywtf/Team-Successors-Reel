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
      driftXAmp={6.1}
      driftYAmp={3.4}
      driftXDiv={52}
      driftYDiv={70}
      tiltXStart={13}
      tiltXEnd={4.8}
      tiltYStart={-8}
      tiltYEnd={-1.4}
      scaleStart={0.82}
      scaleEnd={1.012}
      entryXOffset={-96}
      entryYOffset={72}
      entryRotateZStart={-1}
      entryRotateZEnd={-0.25}
      screenOffsetX={-4}
      screenOffsetY={2}
      glowOpacityBase={0.84}
      perspectiveDistance={1180}
      perspectiveOrigin="49% 49.5%"
      backlightWidth={1160}
      backlightHeight={748}
      backlightOffsetX={-20}
      backlightOffsetY={14}
      backlightBlur={104}
      shadowWidth={920}
      shadowHeight={264}
      shadowOffsetY={150}
      pushEndOverride={72}
      previewStyle={HOMEPAGE_PREVIEW_STYLE}
    />
  );
};
