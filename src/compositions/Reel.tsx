import React from 'react';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../lib/theme';
import {
  SCENE_DURATIONS,
  TOTAL_FRAMES,
  TRANSITION_DURATIONS,
} from '../lib/timing';
import { S01UrlIntro } from '../scenes/S01UrlIntro';
import { S04DesktopShowcase } from '../scenes/S04DesktopShowcase';
import { S02HeroReveal } from '../scenes/S02HeroReveal';
import { STimeline } from '../scenes/STimeline';
import { S05MetricsRoadmap } from '../scenes/S05MetricsRoadmap';
import { S03Engineering } from '../scenes/S03Engineering';
import { S06CtaEndFrame } from '../scenes/S06CtaEndFrame';

export const Reel: React.FC = () => {
  const frame = useCurrentFrame();

  const driftX = Math.sin(frame / 80) * 8;
  const driftY = Math.cos(frame / 120) * 5;
  const driftRotate = Math.sin(frame / 220) * 0.35;
  const globalPush = interpolate(frame, [0, TOTAL_FRAMES], [1, 1.017], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });
  const emissivePulse = 0.16 + ((Math.sin(frame / 48) + 1) / 2) * 0.08;
  const softTransitionEase = Easing.bezier(0.22, 0.61, 0.36, 1);

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          transform: `translate3d(${driftX}px, ${driftY}px, 0) rotate(${driftRotate}deg) scale(${globalPush})`,
          transformOrigin: '50% 50%',
        }}
      >
        <TransitionSeries>
          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S01}>
            <S01UrlIntro />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({
              durationInFrames: TRANSITION_DURATIONS.T01,
              easing: softTransitionEase,
            })}
          />

          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S02}>
            <S04DesktopShowcase />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({
              durationInFrames: TRANSITION_DURATIONS.T02,
              easing: softTransitionEase,
            })}
          />

          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S03}>
            <S02HeroReveal />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({
              durationInFrames: TRANSITION_DURATIONS.T03,
              easing: softTransitionEase,
            })}
          />

          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S04}>
            <STimeline />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({
              durationInFrames: TRANSITION_DURATIONS.T04,
              easing: softTransitionEase,
            })}
          />

          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S05}>
            <S05MetricsRoadmap />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({
              durationInFrames: TRANSITION_DURATIONS.T05,
              easing: softTransitionEase,
            })}
          />

          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S06}>
            <S03Engineering />
          </TransitionSeries.Sequence>

          <TransitionSeries.Transition
            presentation={fade()}
            timing={linearTiming({
              durationInFrames: TRANSITION_DURATIONS.T06,
              easing: softTransitionEase,
            })}
          />

          <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S07}>
            <S06CtaEndFrame />
          </TransitionSeries.Sequence>
        </TransitionSeries>
      </AbsoluteFill>

      {/* Global finishing glow keeps scenes inside one shared world */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `radial-gradient(ellipse 72% 56% at 50% 52%, rgba(131,56,236,${emissivePulse.toFixed(
            3
          )}) 0%, rgba(58,12,163,0.07) 36%, transparent 72%)`,
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 22%, transparent 82%, rgba(0,0,0,0.36) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
