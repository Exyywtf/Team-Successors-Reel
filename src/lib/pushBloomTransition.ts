import React from 'react';
import { AbsoluteFill, interpolate, Easing } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';

/**
 * Push-bloom transition: outgoing scene scales up slightly + fades while
 * incoming scene pushes in from slight scale-down. A subtle bloom overlay
 * bridges the two for a cinematic handoff.
 */

interface PushBloomProps {
  [key: string]: unknown;
  direction?: 'forward' | 'backward';
  bloomColor?: string;
  bloomPeak?: number;
  scaleOut?: number;
  scaleIn?: number;
}

const PREMIUM_EASE = Easing.bezier(0.16, 0.72, 0.24, 1);

const PushBloomPresentation: React.FC<
  TransitionPresentationComponentProps<PushBloomProps>
> = ({ children, presentationDirection, presentationProgress, passedProps }) => {
  const {
    bloomColor = 'rgba(131,56,236,0.12)',
    bloomPeak = 0.16,
    scaleOut = 1.06,
    scaleIn = 0.94,
  } = passedProps;

  const isExiting = presentationDirection === 'exiting';
  const p = presentationProgress;

  if (isExiting) {
    const scale = interpolate(p, [0, 1], [1, scaleOut], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: PREMIUM_EASE,
    });
    const opacity = interpolate(p, [0, 0.6, 1], [1, 0.7, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: PREMIUM_EASE,
    });

    return React.createElement(
      AbsoluteFill,
      {
        style: {
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        },
      },
      children,
      // Bloom overlay on exit
      React.createElement(AbsoluteFill, {
        style: {
          background: bloomColor,
          opacity: interpolate(
            p,
            [0, 0.3, 0.6, 1],
            [0, bloomPeak, bloomPeak * 0.5, 0],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            },
          ),
          pointerEvents: 'none' as const,
        },
      }),
    );
  }

  // Entering
  const scale = interpolate(p, [0, 1], [scaleIn, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: PREMIUM_EASE,
  });
  const opacity = interpolate(p, [0, 0.4, 1], [0, 0.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: PREMIUM_EASE,
  });

  return React.createElement(
    AbsoluteFill,
    {
      style: {
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
      },
    },
    children,
  );
};

export const pushBloom = (props: PushBloomProps = {}): TransitionPresentation<PushBloomProps> => ({
  component: PushBloomPresentation,
  props,
});
