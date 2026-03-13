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

const TransitionSupportLayers: React.FC<{
  supportFillColor: string;
  supportFillOpacity: number;
  bloomColor: string;
  bloomOpacity: number;
  bloomRadius: string;
  edgeLightOpacity: number;
  veilColor: string;
  veilOpacity: number;
}> = ({
  supportFillColor,
  supportFillOpacity,
  bloomColor,
  bloomOpacity,
  bloomRadius,
  edgeLightOpacity,
  veilColor,
  veilOpacity,
}) => {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(AbsoluteFill, {
      style: {
        background: supportFillColor,
        opacity: supportFillOpacity,
        pointerEvents: 'none',
      },
    }),
    React.createElement(AbsoluteFill, {
      style: {
        background: `radial-gradient(${bloomRadius} at 50% 48%, ${bloomColor}, transparent 72%)`,
        opacity: bloomOpacity,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      },
    }),
    React.createElement(AbsoluteFill, {
      style: {
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.05) 18%, rgba(255,255,255,0.0) 42%)',
        opacity: edgeLightOpacity,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      },
    }),
    React.createElement(AbsoluteFill, {
      style: {
        background: `radial-gradient(ellipse 80% 66% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 52%, ${veilColor} 100%)`,
        opacity: veilOpacity,
        pointerEvents: 'none',
      },
    }),
  );
};

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
    bloomColor = 'rgba(131,56,236,0.12)',
    bloomPeak = 0.1,
    veilColor = 'rgba(8,8,12,0.12)',
    blurMax = 6,
    bloomRadius = 'ellipse 58% 46%',
    edgeLightOpacity = 0.08,
    overscanPx = 180,
    supportFillColor = 'rgba(8,8,12,0.08)',
    exitOpacityStops = [1, 0.82, 0],
    enterOpacityStops = [0, 0.38, 0.78, 1],
  } = passedProps;

  const p = presentationProgress;
  const isExiting = presentationDirection === 'exiting';
  const bloomOpacity = interpolate(
    p,
    [0, 0.26, 0.62, 1],
    [0, bloomPeak * 0.35, bloomPeak, 0],
    clampRange,
  );
  const veilOpacity = interpolate(
    p,
    [0, 0.26, 0.72, 1],
    [0, 0.01, 0.06, 0],
    clampRange,
  );
  const supportFillOpacity = interpolate(
    p,
    [0, 0.3, 0.72, 1],
    [0, 0.02, 0.07, 0],
    clampRange,
  );

  if (isExiting) {
    const opacity = interpolate(p, [0, 0.84, 1], exitOpacityStops, clampRange);
    const blur = interpolate(
      p,
      [0, 0.54, 1],
      [0, blurMax * 0.28, blurMax],
      clampRange,
    );
    const brightness = interpolate(p, [0, 1], [1, 0.92], clampRange);
    const saturate = interpolate(p, [0, 1], [1, 0.96], clampRange);
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
      React.createElement(TransitionSupportLayers, {
        supportFillColor,
        supportFillOpacity,
        bloomColor,
        bloomOpacity: bloomOpacity * 0.8,
        bloomRadius,
        edgeLightOpacity: edgeLightOpacity * 0.85,
        veilColor,
        veilOpacity,
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
              filter: `blur(${blur}px) saturate(${saturate}) brightness(${brightness})`,
              backfaceVisibility: 'hidden',
            },
          },
          children,
        ),
      ),
      React.createElement(AbsoluteFill, {
        style: {
          background: `radial-gradient(${bloomRadius} at 50% 48%, ${bloomColor}, transparent 72%)`,
          opacity: bloomOpacity,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        },
      }),
    );
  }

  const opacity = interpolate(p, [0, 0.18, 0.54, 1], enterOpacityStops, clampRange);
  const blur = interpolate(
    p,
    [0, 0.42, 1],
    [blurMax * 0.72, blurMax * 0.18, 0],
    clampRange,
  );
  const brightness = interpolate(p, [0, 1], [0.96, 1], clampRange);
  const saturate = interpolate(p, [0, 1], [0.98, 1], clampRange);
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
    React.createElement(TransitionSupportLayers, {
      supportFillColor,
      supportFillOpacity,
      bloomColor,
      bloomOpacity: bloomOpacity * 0.6,
      bloomRadius,
      edgeLightOpacity: edgeLightOpacity * 0.72,
      veilColor,
      veilOpacity: veilOpacity * 0.75,
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
            filter: `blur(${blur}px) saturate(${saturate}) brightness(${brightness})`,
            backfaceVisibility: 'hidden',
          },
        },
        children,
      ),
    ),
    React.createElement(AbsoluteFill, {
      style: {
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.0) 44%)',
        opacity: edgeLightOpacity * 0.7,
        mixBlendMode: 'screen',
        pointerEvents: 'none',
      },
    }),
  );
};

export const pushBloom = (
  props: PushBloomProps = {},
): TransitionPresentation<PushBloomProps> => ({
  component: PushBloomPresentation,
  props,
});
