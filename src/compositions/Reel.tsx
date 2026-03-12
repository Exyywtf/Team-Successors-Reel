import React from 'react';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { AbsoluteFill, Easing } from 'remotion';
import { theme } from '../lib/theme';
import { SCENE_DURATIONS, TRANSITION_DURATIONS } from '../lib/timing';
import { pushBloom } from '../lib/pushBloomTransition';
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
  const softEase = Easing.bezier(0.22, 0.61, 0.36, 1);
  const cinematicEase = Easing.bezier(0.16, 0.72, 0.24, 1);

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden' }}>
      <TransitionSeries>
        {/* S01 — URL Intro */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S01}>
          <S01UrlIntro />
        </TransitionSeries.Sequence>

        {/* T01: URL → Desktop — push-bloom: search bar scales out, desktop pushes in */}
        <TransitionSeries.Transition
          presentation={pushBloom({
            bloomColor: 'rgba(131,56,236,0.10)',
            bloomPeak: 0.14,
            scaleOut: 1.08,
            scaleIn: 0.93,
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T01,
            easing: cinematicEase,
          })}
        />

        {/* S02 — Desktop Homepage Quick-Glance */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S02}>
          <S04DesktopShowcase />
        </TransitionSeries.Sequence>

        {/* T02: Desktop → Hero — push-bloom with purple tint */}
        <TransitionSeries.Transition
          presentation={pushBloom({
            bloomColor: 'rgba(131,56,236,0.14)',
            bloomPeak: 0.18,
            scaleOut: 1.05,
            scaleIn: 0.95,
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T02,
            easing: cinematicEase,
          })}
        />

        {/* S03 — Hero Reveal */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S03}>
          <S02HeroReveal />
        </TransitionSeries.Sequence>

        {/* T03: Hero → Timeline — soft fade, elegant handoff */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T03,
            easing: softEase,
          })}
        />

        {/* S04 — Timeline */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S04}>
          <STimeline />
        </TransitionSeries.Sequence>

        {/* T04: Timeline → Enterprise — push-bloom, camera-led */}
        <TransitionSeries.Transition
          presentation={pushBloom({
            bloomColor: 'rgba(131,56,236,0.08)',
            bloomPeak: 0.12,
            scaleOut: 1.04,
            scaleIn: 0.95,
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T04,
            easing: cinematicEase,
          })}
        />

        {/* S05 — Enterprise 2.5D Page Scroll */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S05}>
          <SEnterprise2D5 />
        </TransitionSeries.Sequence>

        {/* T05: Enterprise → Metrics — fade with soft ease */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T05,
            easing: softEase,
          })}
        />

        {/* S06 — Metrics */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S06}>
          <S05MetricsRoadmap />
        </TransitionSeries.Sequence>

        {/* T06: Metrics → Engineering 2.5D — push-bloom */}
        <TransitionSeries.Transition
          presentation={pushBloom({
            bloomColor: 'rgba(131,56,236,0.10)',
            bloomPeak: 0.14,
            scaleOut: 1.05,
            scaleIn: 0.94,
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T06,
            easing: cinematicEase,
          })}
        />

        {/* S07 — Engineering 2.5D Page Scroll */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S07}>
          <SEngineering2D5 />
        </TransitionSeries.Sequence>

        {/* T07: Eng 2.5D → Eng Deep-Dive — push-bloom, continuous engineering world */}
        <TransitionSeries.Transition
          presentation={pushBloom({
            bloomColor: 'rgba(131,56,236,0.12)',
            bloomPeak: 0.16,
            scaleOut: 1.04,
            scaleIn: 0.96,
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T07,
            easing: cinematicEase,
          })}
        />

        {/* S08 — Engineering Deep-Dive */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S08}>
          <S03Engineering />
        </TransitionSeries.Sequence>

        {/* T08: Eng Deep-Dive → CTA — gentle fade for final scene */}
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T08,
            easing: softEase,
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
