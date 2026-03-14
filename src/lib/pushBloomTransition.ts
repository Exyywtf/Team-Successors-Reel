import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from '@remotion/transitions';

interface PushBloomProps {
  [key: string]: unknown;
  perspective?: number;
  perspectiveOrigin?: string;
  exitTranslateX?: number;
  exitTranslateY?: number;
  exitTranslateZ?: number;
  exitRotateX?: number;
  exitRotateY?: number;
  exitRotateZ?: number;
  exitScale?: number;
  enterTranslateX?: number;
  enterTranslateY?: number;
  enterTranslateZ?: number;
  enterRotateX?: number;
  enterRotateY?: number;
  enterRotateZ?: number;
  enterScale?: number;
  bloomColor?: string;
  bloomPeak?: number;
  veilColor?: string;
  blurMax?: number;
  bloomRadius?: string;
  edgeLightOpacity?: number;
  overscanPx?: number;
  supportFillColor?: string;
  exitOpacityStops?: [number, number, number];
  enterOpacityStops?: [number, number, number, number];
}

const clampRange = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const buildTransform = ({
  x = 0,
  y = 0,
  z = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  z?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
}) =>
  [
    `translate3d(${x}px, ${y}px, ${z}px)`,
    `rotateX(${rotateX}deg)`,
    `rotateY(${rotateY}deg)`,
    `rotateZ(${rotateZ}deg)`,
    `scale(${scale})`,
  ].join(' ');

const centeredOverscanPlaneStyle = (
  overscanPx: number,
): React.CSSProperties => ({
  position: 'absolute',
  left: '50%',
  top: '50%',
  width: `calc(100% + ${overscanPx * 2}px)`,
  height: `calc(100% + ${overscanPx * 2}px)`,
  transform: 'translate(-50%, -50%)',
  transformOrigin: 'center center',
});

const PushBloomPresentation: React.FC<
  TransitionPresentationComponentProps<PushBloomProps>
> = ({children, presentationDirection, presentationProgress, passedProps}) => {
  const {
    perspective = 1500,
    perspectiveOrigin = '50% 50%',
    exitTranslateX = -74,
    exitTranslateY = -28,
    exitTranslateZ = 120,
    exitRotateX = 4.5,
    exitRotateY = -8,
    exitRotateZ = -1.2,
    exitScale = 1.045,
    enterTranslateX = -128,
    enterTranslateY = 76,
    enterTranslateZ = -260,
    enterRotateX = 11,
    enterRotateY = -16,
    enterRotateZ = -2.8,
    enterScale = 0.9,
    bloomColor = 'rgba(131,56,236,0.08)',
    bloomPeak = 0.06,
    veilColor = 'rgba(8,8,12,0.14)',
    blurMax = 6,
    bloomRadius = 'ellipse 62% 46%',
    overscanPx = 180,
    supportFillColor = 'rgba(8,8,12,0.07)',
    exitOpacityStops = [1, 0.82, 0],
    enterOpacityStops = [0, 0.38, 0.78, 1],
  } = passedProps;

  const p = presentationProgress;
  const isExiting = presentationDirection === 'exiting';

  // Subtle overlay opacities — acts as transition glue, not a visible effect
  const bloomOpacity = interpolate(
    p,
    [0, 0.24, 0.56, 1],
    [0, bloomPeak * 0.24, bloomPeak * 0.85, 0],
    clampRange,
  );
  const veilOpacity = interpolate(
    p,
    [0, 0.26, 0.76, 1],
    [0, 0.015, 0.045, 0],
    clampRange,
  );
  const supportFillOpacity = interpolate(
    p,
    [0, 0.28, 0.78, 1],
    [0, 0.015, 0.045, 0],
    clampRange,
  );

  if (isExiting) {
    // Softer exit: start fading earlier, more gradual drop
    const opacity = interpolate(p, [0, 0.72, 1], exitOpacityStops, clampRange);
    const blur = interpolate(
      p,
      [0, 0.48, 1],
      [0, blurMax * 0.22, blurMax],
      clampRange,
    );
    const transform = buildTransform({
      x: exitTranslateX * p,
      y: exitTranslateY * p,
      z: exitTranslateZ * p,
      rotateX: exitRotateX * p,
      rotateY: exitRotateY * p,
      rotateZ: exitRotateZ * p,
      scale: 1 + (exitScale - 1) * p,
    });

    return React.createElement(
      AbsoluteFill,
      {
        style: {
          perspective: `${perspective}px`,
          perspectiveOrigin,
          transformStyle: 'preserve-3d',
          overflow: 'hidden',
        },
      },
      // Subtle overlay layers — support fill, bloom, veil
      React.createElement(AbsoluteFill, {
        style: {
          background: supportFillColor,
          opacity: supportFillOpacity,
          pointerEvents: 'none',
        },
      }),
      React.createElement(AbsoluteFill, {
        style: {
          background: `radial-gradient(${bloomRadius} at 50% 50%, ${bloomColor}, transparent 72%)`,
          opacity: bloomOpacity * 0.7,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        },
      }),
      React.createElement(AbsoluteFill, {
        style: {
          background: `radial-gradient(ellipse 80% 66% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 54%, ${veilColor} 100%)`,
          opacity: veilOpacity,
          pointerEvents: 'none',
        },
      }),
      React.createElement(
        'div',
        {style: centeredOverscanPlaneStyle(overscanPx)},
        React.createElement(
          AbsoluteFill,
          {
            style: {
              opacity,
              transform,
              transformOrigin: 'center center',
              transformStyle: 'preserve-3d',
              filter: `blur(${blur}px)`,
              backfaceVisibility: 'hidden',
            },
          },
          children,
        ),
      ),
    );
  }

  // Smoother enter: earlier fade-in onset, gentler blur ramp
  const opacity = interpolate(p, [0, 0.12, 0.48, 1], enterOpacityStops, clampRange);
  const blur = interpolate(
    p,
    [0, 0.38, 1],
    [blurMax * 0.5, blurMax * 0.12, 0],
    clampRange,
  );
  const transform = buildTransform({
    x: enterTranslateX * (1 - p),
    y: enterTranslateY * (1 - p),
    z: enterTranslateZ * (1 - p),
    rotateX: enterRotateX * (1 - p),
    rotateY: enterRotateY * (1 - p),
    rotateZ: enterRotateZ * (1 - p),
    scale: 1 + (enterScale - 1) * (1 - p),
  });

  return React.createElement(
    AbsoluteFill,
      {
        style: {
          perspective: `${perspective}px`,
          perspectiveOrigin,
          transformStyle: 'preserve-3d',
          overflow: 'hidden',
        },
      },
    // Subtle overlay layers — support fill, bloom, veil
    React.createElement(AbsoluteFill, {
      style: {
        background: supportFillColor,
        opacity: supportFillOpacity,
        pointerEvents: 'none',
      },
    }),
    React.createElement(AbsoluteFill, {
      style: {
        background: `radial-gradient(${bloomRadius} at 50% 50%, ${bloomColor}, transparent 72%)`,
        opacity: bloomOpacity * 0.6,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      },
    }),
    React.createElement(AbsoluteFill, {
      style: {
        background: `radial-gradient(ellipse 80% 66% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 54%, ${veilColor} 100%)`,
        opacity: veilOpacity * 0.65,
        pointerEvents: 'none',
      },
    }),
    React.createElement(
      'div',
      {style: centeredOverscanPlaneStyle(overscanPx)},
      React.createElement(
        AbsoluteFill,
        {
          style: {
            opacity,
            transform,
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d',
            filter: `blur(${blur}px)`,
            backfaceVisibility: 'hidden',
          },
        },
        children,
      ),
    ),
  );
};

export const pushBloom = (
  props: PushBloomProps = {},
): TransitionPresentation<PushBloomProps> => ({
  component: PushBloomPresentation,
  props,
});
