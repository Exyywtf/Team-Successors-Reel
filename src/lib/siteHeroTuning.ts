import type { CSSProperties } from 'react';

const SITE_HERO_STAGE_BASE = {
  minPx: 850,
  midVh: 100,
  maxPx: 1175,
} as const;

export const HOMEPAGE_PREVIEW_HERO_HEIGHT_REDUCTION = 0.25;

export const HERO_REVEAL_BACKGROUND = {
  heroHeightScale: 1.55,
  fadeStartFrame: 140,
  fadeEndOpacity: 0.72,
} as const;

type HeroStagePreviewStyle = CSSProperties &
  Record<'--hero-stage-min' | '--hero-stage-mid' | '--hero-stage-max' | '--hero-stage-height', string>;

const formatPx = (value: number) => `${Number(value.toFixed(1))}px`;
const formatVh = (value: number) => `${Number(value.toFixed(1))}vh`;

export const buildHeroStagePreviewStyle = (heightScale: number): HeroStagePreviewStyle => {
  const minPx = SITE_HERO_STAGE_BASE.minPx * heightScale;
  const midVh = SITE_HERO_STAGE_BASE.midVh * heightScale;
  const maxPx = SITE_HERO_STAGE_BASE.maxPx * heightScale;

  return {
    '--hero-stage-min': formatPx(minPx),
    '--hero-stage-mid': formatVh(midVh),
    '--hero-stage-max': formatPx(maxPx),
    '--hero-stage-height': `clamp(${formatPx(minPx)}, ${formatVh(midVh)}, ${formatPx(maxPx)})`,
  };
};
