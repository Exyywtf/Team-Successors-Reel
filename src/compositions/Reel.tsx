import React, {useMemo} from 'react';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {Audio} from '@remotion/media';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile} from 'remotion';
import {theme} from '../lib/theme';
import {SCENE_DURATIONS, TRANSITION_DURATIONS} from '../lib/timing';
import {buildSfxTimeline} from '../lib/sfxTimeline';
import {SiteAtmosphere} from '../components/SiteAtmosphere';
import {pushBloom} from '../lib/pushBloomTransition';
import {depthWeld, driftDissolve} from '../lib/transitions';
import {S01UrlIntro} from '../scenes/S01UrlIntro';
import {S04DesktopShowcase} from '../scenes/S04DesktopShowcase';
import {S02HeroReveal} from '../scenes/S02HeroReveal';
import {STimeline} from '../scenes/STimeline';
import {SEnterprise2D5} from '../scenes/SEnterprise2D5';
import {S05MetricsRoadmap} from '../scenes/S05MetricsRoadmap';
import {SEngineering2D5} from '../scenes/SEngineering2D5';
import {S03Engineering} from '../scenes/S03Engineering';
import {S06CtaEndFrame} from '../scenes/S06CtaEndFrame';

export const Reel: React.FC = () => {
  const softEase = Easing.bezier(0.22, 0.61, 0.36, 1);
  const cinematicEase = Easing.bezier(0.16, 0.72, 0.24, 1);
  const sfxCues = useMemo(() => buildSfxTimeline(), []);

  return (
    <AbsoluteFill style={{background: theme.colors.bg, overflow: 'hidden'}}>
      <SiteAtmosphere />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S01}>
          <S01UrlIntro />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={pushBloom({
            perspective: 2040,
            perspectiveOrigin: '50% 49%',
            exitTranslateX: 0,
            exitTranslateY: -6,
            exitTranslateZ: 110,
            exitRotateX: 1.4,
            exitRotateY: 0,
            exitRotateZ: 0,
            exitScale: 1.032,
            enterTranslateX: 0,
            enterTranslateY: 14,
            enterTranslateZ: -140,
            enterRotateX: 2.8,
            enterRotateY: 0,
            enterRotateZ: 0,
            enterScale: 0.965,
            bloomColor: 'rgba(131,56,236,0.10)',
            bloomPeak: 0.05,
            veilColor: 'rgba(8,8,12,0.12)',
            blurMax: 3.8,
            bloomRadius: 'ellipse 54% 42%',
            edgeLightOpacity: 0.055,
            overscanPx: 186,
            supportFillColor: 'rgba(8,8,12,0.05)',
            exitOpacityStops: [1, 0.9, 0],
            enterOpacityStops: [0, 0.3, 0.82, 1],
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T01,
            easing: cinematicEase,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S02}>
          <S04DesktopShowcase />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={depthWeld({
            perspective: 1820,
            perspectiveOrigin: '50% 53%',
            exitTranslateX: -28,
            exitTranslateY: -12,
            exitTranslateZ: -150,
            exitRotateX: 3.4,
            exitRotateY: 6.5,
            exitRotateZ: -0.7,
            exitScale: 0.965,
            enterTranslateX: 12,
            enterTranslateY: 20,
            enterTranslateZ: 144,
            enterRotateX: -2.4,
            enterRotateY: -3.2,
            enterRotateZ: 0.4,
            enterScale: 1.028,
            bloomColor: 'rgba(131,56,236,0.08)',
            bloomPeak: 0.05,
            veilColor: 'rgba(8,8,12,0.18)',
            blurMax: 5.8,
            overscanPx: 170,
            supportFillColor: 'rgba(8,8,12,0.08)',
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T02,
            easing: cinematicEase,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S03}>
          <S02HeroReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={driftDissolve({
            driftDirection: 'left',
            driftDistance: 48,
            driftLift: 12,
            scaleOut: 1.018,
            scaleIn: 0.992,
            blurMax: 4,
            bloomColor: 'rgba(131,56,236,0.04)',
            veilColor: 'rgba(8,8,12,0.10)',
            rotateZ: 0.38,
            overscanPx: 104,
            supportFillColor: 'rgba(8,8,12,0.06)',
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T03,
            easing: softEase,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S04}>
          <STimeline />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={pushBloom({
            perspective: 1880,
            perspectiveOrigin: '56% 49%',
            exitTranslateX: 28,
            exitTranslateY: -10,
            exitTranslateZ: 72,
            exitRotateX: 1.4,
            exitRotateY: 3,
            exitRotateZ: 0.4,
            exitScale: 1.018,
            enterTranslateX: 88,
            enterTranslateY: 34,
            enterTranslateZ: -130,
            enterRotateX: 3.6,
            enterRotateY: 7,
            enterRotateZ: 0.7,
            enterScale: 0.96,
            bloomColor: 'rgba(131,56,236,0.10)',
            bloomPeak: 0.08,
            veilColor: 'rgba(8,8,12,0.12)',
            blurMax: 4.2,
            bloomRadius: 'ellipse 56% 44%',
            overscanPx: 190,
            supportFillColor: 'rgba(8,8,12,0.08)',
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T04,
            easing: cinematicEase,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S05}>
          <SEnterprise2D5 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={depthWeld({
            perspective: 1700,
            perspectiveOrigin: '52% 50%',
            exitTranslateX: 24,
            exitTranslateY: -12,
            exitTranslateZ: -110,
            exitRotateX: 2.2,
            exitRotateY: -3,
            exitRotateZ: 0.6,
            exitScale: 0.972,
            enterTranslateX: -10,
            enterTranslateY: 18,
            enterTranslateZ: 120,
            enterRotateX: -2,
            enterRotateY: 2.2,
            enterRotateZ: -0.3,
            enterScale: 1.022,
            bloomColor: 'rgba(131,56,236,0.06)',
            bloomPeak: 0.045,
            veilColor: 'rgba(8,8,12,0.14)',
            blurMax: 5,
            overscanPx: 156,
            supportFillColor: 'rgba(8,8,12,0.07)',
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T05,
            easing: softEase,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S06}>
          <S05MetricsRoadmap />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={pushBloom({
            perspective: 1620,
            perspectiveOrigin: '51% 55%',
            exitTranslateX: -32,
            exitTranslateY: -14,
            exitTranslateZ: 78,
            exitRotateX: 2.2,
            exitRotateY: -3.6,
            exitRotateZ: -0.45,
            exitScale: 1.018,
            enterTranslateX: -58,
            enterTranslateY: 42,
            enterTranslateZ: -135,
            enterRotateX: 4.8,
            enterRotateY: -5,
            enterRotateZ: -0.4,
            enterScale: 0.958,
            bloomColor: 'rgba(131,56,236,0.11)',
            bloomPeak: 0.09,
            veilColor: 'rgba(8,8,12,0.12)',
            blurMax: 4.6,
            bloomRadius: 'ellipse 58% 46%',
            overscanPx: 200,
            supportFillColor: 'rgba(8,8,12,0.08)',
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T06,
            easing: cinematicEase,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S07}>
          <SEngineering2D5 />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={depthWeld({
            perspective: 1740,
            perspectiveOrigin: '51% 54%',
            exitTranslateX: -20,
            exitTranslateY: -8,
            exitTranslateZ: 144,
            exitRotateX: 3.6,
            exitRotateY: -5,
            exitRotateZ: -0.25,
            exitScale: 1.028,
            enterTranslateX: 12,
            enterTranslateY: 10,
            enterTranslateZ: -88,
            enterRotateX: -1.1,
            enterRotateY: 1.4,
            enterRotateZ: 0.25,
            enterScale: 1.008,
            bloomColor: 'rgba(131,56,236,0.06)',
            bloomPeak: 0.05,
            veilColor: 'rgba(8,8,12,0.15)',
            blurMax: 4.8,
            overscanPx: 162,
            supportFillColor: 'rgba(8,8,12,0.08)',
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T07,
            easing: cinematicEase,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S08}>
          <S03Engineering />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={driftDissolve({
            driftDirection: 'right',
            driftDistance: 46,
            driftLift: 10,
            scaleOut: 1.016,
            scaleIn: 0.994,
            blurMax: 3.5,
            bloomColor: 'rgba(131,56,236,0.03)',
            veilColor: 'rgba(8,8,12,0.10)',
            rotateZ: 0.28,
            overscanPx: 92,
            supportFillColor: 'rgba(8,8,12,0.06)',
          })}
          timing={linearTiming({
            durationInFrames: TRANSITION_DURATIONS.T08,
            easing: softEase,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.S09}>
          <S06CtaEndFrame />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {sfxCues.map((cue, i) => (
        <Sequence key={i} from={cue.frame} durationInFrames={cue.durationFrames}>
          <Audio
            src={staticFile(cue.src)}
            volume={(f) => {
              let v = cue.volume;
              if (cue.fadeInFrames) {
                v = Math.min(
                  v,
                  interpolate(f, [0, cue.fadeInFrames], [0, cue.volume], {
                    extrapolateRight: 'clamp',
                  }),
                );
              }
              if (cue.fadeOutFrames && cue.durationFrames) {
                v = Math.min(
                  v,
                  interpolate(
                    f,
                    [cue.durationFrames - cue.fadeOutFrames, cue.durationFrames],
                    [cue.volume, 0],
                    {extrapolateLeft: 'clamp'},
                  ),
                );
              }
              return v;
            }}
            playbackRate={cue.playbackRate}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
