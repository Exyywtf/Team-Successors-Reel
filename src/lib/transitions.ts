import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from '@remotion/transitions';

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

const TransitionOverlay: React.FC<{
  supportFillColor: string;
  supportFillOpacity: number;
  bloomColor: string;
  bloomOpacity: number;
  veilColor: string;
  veilOpacity: number;
}> = ({
  supportFillColor,
  supportFillOpacity,
  bloomColor,
  bloomOpacity,
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
        background: `radial-gradient(ellipse 62% 46% at 50% 50%, ${bloomColor}, transparent 72%)`,
        opacity: bloomOpacity,
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
  );
};

interface DriftDissolveProps {
  [key: string]: unknown;
  driftDirection?: 'left' | 'right';
  driftDistance?: number;
  driftLift?: number;
  scaleOut?: number;
  scaleIn?: number;
  blurMax?: number;
  veilColor?: string;
  bloomColor?: string;
  rotateZ?: number;
  overscanPx?: number;
  supportFillColor?: string;
}

const DriftDissolvePresentation: React.FC<
  TransitionPresentationComponentProps<DriftDissolveProps>
> = ({children, presentationDirection, presentationProgress, passedProps}) => {
  const {
    driftDirection = 'left',
    driftDistance = 64,
    driftLift = 14,
    scaleOut = 1.028,
    scaleIn = 0.985,
    blurMax = 5,
    veilColor = 'rgba(8,8,12,0.12)',
    bloomColor = 'rgba(131,56,236,0.05)',
    rotateZ = 0.5,
    overscanPx = 96,
    supportFillColor = 'rgba(8,8,12,0.05)',
  } = passedProps;

  const p = presentationProgress;
  const dir = driftDirection === 'left' ? -1 : 1;
  const isExiting = presentationDirection === 'exiting';
  const bloomOpacity = interpolate(
    p,
    [0, 0.3, 0.76, 1],
    [0, 0.02, 0.05, 0],
    clampRange,
  );
  const veilOpacity = interpolate(
    p,
    [0, 0.32, 0.8, 1],
    [0, 0.02, 0.05, 0],
    clampRange,
  );
  const supportFillOpacity = interpolate(
    p,
    [0, 0.32, 0.8, 1],
    [0, 0.02, 0.05, 0],
    clampRange,
  );

  if (isExiting) {
    const opacity = interpolate(p, [0, 0.82, 1], [1, 0.82, 0], clampRange);
    const blur = interpolate(
      p,
      [0, 0.6, 1],
      [0, blurMax * 0.24, blurMax],
      clampRange,
    );
    const transform = buildTransform({
      x: driftDistance * p * dir,
      y: -driftLift * p,
      rotateZ: rotateZ * p * dir,
      scale: 1 + (scaleOut - 1) * p,
    });

    return React.createElement(
      AbsoluteFill,
      {style: {overflow: 'hidden'}},
      React.createElement(TransitionOverlay, {
        supportFillColor,
        supportFillOpacity,
        bloomColor,
        bloomOpacity,
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
              filter: `blur(${blur}px) brightness(${interpolate(p, [0, 1], [1, 0.92], clampRange)})`,
            },
          },
          children,
        ),
      ),
    );
  }

  const opacity = interpolate(p, [0, 0.22, 0.64, 1], [0, 0.34, 0.76, 1], clampRange);
  const blur = interpolate(
    p,
    [0, 0.48, 1],
    [blurMax * 0.68, blurMax * 0.16, 0],
    clampRange,
  );
  const transform = buildTransform({
    x: driftDistance * (1 - p) * dir * -0.32,
    y: driftLift * (1 - p) * 0.55,
    rotateZ: rotateZ * (1 - p) * dir * -0.28,
    scale: 1 + (scaleIn - 1) * (1 - p),
  });

  return React.createElement(
    AbsoluteFill,
    {style: {overflow: 'hidden'}},
    React.createElement(TransitionOverlay, {
      supportFillColor,
      supportFillOpacity,
      bloomColor,
      bloomOpacity: bloomOpacity * 0.8,
      veilColor,
      veilOpacity: veilOpacity * 0.72,
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
            filter: `blur(${blur}px) brightness(${interpolate(p, [0, 1], [0.95, 1], clampRange)})`,
          },
        },
        children,
      ),
    ),
  );
};

export const driftDissolve = (
  props: DriftDissolveProps = {},
): TransitionPresentation<DriftDissolveProps> => ({
  component: DriftDissolvePresentation,
  props,
});

interface DepthWeldProps {
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
  blurMax?: number;
  veilColor?: string;
  bloomColor?: string;
  bloomPeak?: number;
  overscanPx?: number;
  supportFillColor?: string;
}

const DepthWeldPresentation: React.FC<
  TransitionPresentationComponentProps<DepthWeldProps>
> = ({children, presentationDirection, presentationProgress, passedProps}) => {
  const {
    perspective = 1500,
    perspectiveOrigin = '50% 52%',
    exitTranslateX = -46,
    exitTranslateY = -20,
    exitTranslateZ = -140,
    exitRotateX = 3.5,
    exitRotateY = 6,
    exitRotateZ = -1.1,
    exitScale = 0.972,
    enterTranslateX = 24,
    enterTranslateY = 20,
    enterTranslateZ = 140,
    enterRotateX = -3.5,
    enterRotateY = -5,
    enterRotateZ = 0.8,
    enterScale = 1.03,
    blurMax = 6,
    veilColor = 'rgba(8,8,12,0.14)',
    bloomColor = 'rgba(131,56,236,0.08)',
    bloomPeak = 0.06,
    overscanPx = 144,
    supportFillColor = 'rgba(8,8,12,0.07)',
  } = passedProps;

  const p = presentationProgress;
  const isExiting = presentationDirection === 'exiting';
  const bloomOpacity = interpolate(
    p,
    [0, 0.24, 0.56, 1],
    [0, bloomPeak * 0.28, bloomPeak, 0],
    clampRange,
  );
  const veilOpacity = interpolate(
    p,
    [0, 0.26, 0.76, 1],
    [0, 0.02, 0.06, 0],
    clampRange,
  );
  const supportFillOpacity = interpolate(
    p,
    [0, 0.28, 0.78, 1],
    [0, 0.02, 0.06, 0],
    clampRange,
  );

  if (isExiting) {
    const opacity = interpolate(p, [0, 0.84, 1], [1, 0.8, 0], clampRange);
    const blur = interpolate(
      p,
      [0, 0.56, 1],
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
      React.createElement(TransitionOverlay, {
        supportFillColor,
        supportFillOpacity,
        bloomColor,
        bloomOpacity: bloomOpacity * 0.8,
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
              filter: `blur(${blur}px) brightness(${interpolate(p, [0, 1], [1, 0.93], clampRange)})`,
            },
          },
          children,
        ),
      ),
    );
  }

  const opacity = interpolate(p, [0, 0.18, 0.58, 1], [0, 0.32, 0.78, 1], clampRange);
  const blur = interpolate(
    p,
    [0, 0.46, 1],
    [blurMax * 0.7, blurMax * 0.18, 0],
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
    React.createElement(TransitionOverlay, {
      supportFillColor,
      supportFillOpacity,
      bloomColor,
      bloomOpacity: bloomOpacity * 0.68,
      veilColor,
      veilOpacity: veilOpacity * 0.72,
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
            filter: `blur(${blur}px) brightness(${interpolate(p, [0, 1], [0.95, 1], clampRange)})`,
          },
        },
        children,
      ),
    ),
  );
};

export const depthWeld = (
  props: DepthWeldProps = {},
): TransitionPresentation<DepthWeldProps> => ({
  component: DepthWeldPresentation,
  props,
});
