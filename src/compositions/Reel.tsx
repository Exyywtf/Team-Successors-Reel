import React from 'react';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { AbsoluteFill, Easing } from 'remotion';
import { theme } from '../lib/theme';
import { SCENE_DURATIONS, TRANSITION_DURATIONS } from '../lib/timing';
import { S01UrlIntro } from '../scenes/S01UrlIntro';
import { S04DesktopShowcase } from '../scenes/S04DesktopShowcase';
import { S02HeroReveal } from '../scenes/S02HeroReveal';
import { STimeline } from '../scenes/STimeline';
import { SEnterprise2D5 } from '../scenes/SEnterprise2D5';
import { S05MetricsRoadmap } from '../scenes/S05MetricsRoadmap';
import { SEngineering2D5 } from '../scenes/SEngineering2D5';
import { S03Engineering } from '../scenes/S03Engineering';
import { S06CtaEndFrame } from '../scenes/S06CtaEndFrame';

export const Reel: React.FC = () => {
  const softTransitionEase = Easing.bezier(0.22, 0.61, 0.36, 1);

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden' }}>
      <TransitionSeries>
        {/* S01 — URL Intro */}
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

        {/* S02 — Desktop Homepage Quick-Glance */}
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

        {/* S03 — Hero Reveal */}
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

        {/* S04 — Timeline */}
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

        {/* S05 — Enterprise 2.5D Page Scroll */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S05}>
          <SEnterprise2D5 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T05,
            easing: softTransitionEase,
          })}
        />

        {/* S06 — Metrics */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S06}>
          <S05MetricsRoadmap />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T06,
            easing: softTransitionEase,
          })}
        />

        {/* S07 — Engineering 2.5D Page Scroll */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S07}>
          <SEngineering2D5 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T07,
            easing: softTransitionEase,
          })}
        />

        {/* S08 — Engineering Deep-Dive */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S08}>
          <S03Engineering />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T08,
            easing: softTransitionEase,
          })}
        />

        {/* S09 — CTA End Frame */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S09}>
          <S06CtaEndFrame />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
