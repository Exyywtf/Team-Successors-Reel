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
    blurMax = 6,
    overscanPx = 180,
    exitOpacityStops = [1, 0.82, 0],
    enterOpacityStops = [0, 0.38, 0.78, 1],
  } = passedProps;

  const p = presentationProgress;
  const isExiting = presentationDirection === 'exiting';

  if (isExiting) {
    const opacity = interpolate(p, [0, 0.84, 1], exitOpacityStops, clampRange);
    const blur = interpolate(
      p,
      [0, 0.54, 1],
      [0, blurMax * 0.28, blurMax],
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

  const opacity = interpolate(p, [0, 0.18, 0.54, 1], enterOpacityStops, clampRange);
  const blur = interpolate(
    p,
    [0, 0.42, 1],
    [blurMax * 0.72, blurMax * 0.18, 0],
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
