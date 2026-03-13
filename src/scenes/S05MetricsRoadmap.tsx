import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SiteAtmosphere } from '../components/SiteAtmosphere';
import { orbitron, montserrat } from '../lib/fonts';
import { snappySpring } from '../lib/springs';
import { theme } from '../lib/theme';

const SCENE_TOTAL = 84;
const FADE_TO_BLACK = 74;

const BEAT1_START = 0;
const BEAT1_END = 48;
const BEAT2_START = 38;
const BEAT2_END = SCENE_TOTAL;

const countToText = (value: number, unit: 'k' | 'plain') => {
  if (unit === 'k') {
    return `${Math.max(0, Math.round(value / 1000)).toLocaleString()}k+`;
  }
  return `${Math.max(0, Math.round(value)).toLocaleString()}+`;
};

interface MetricBeatProps {
  frame: number;
  fps: number;
  start: number;
  opacity: number;
  valueTarget: number;
  unit: 'k' | 'plain';
  label: string;
  glow: 'gold' | 'purple';
}

const MetricBeat: React.FC<MetricBeatProps> = ({
  frame,
  fps,
  start,
  opacity,
  valueTarget,
  unit,
  label,
  glow,
}) => {
  const pop = spring({
    frame: Math.max(0, frame - start),
    fps,
    config: snappySpring,
    durationInFrames: 24,
  });

  const subtitleRevealStart = start + 7;
  const subtitleRevealEnd = subtitleRevealStart + 16;
  const subtitleProgress = interpolate(
    frame,
    [subtitleRevealStart, subtitleRevealEnd],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    },
  );
  const subtitleSettled = frame >= subtitleRevealEnd;

  const countProgress = spring({
    frame: Math.max(0, frame - (start + 2)),
    fps,
    config: { damping: 22, stiffness: 240, mass: 0.7, overshootClamping: true },
    durationInFrames: 26,
  });

  const depthY = (1 - pop) * 64;
  const depthScale = 0.78 + pop * 0.22;
  const glowColor =
    glow === 'gold'
      ? 'rgba(229,184,11,0.55), 0 0 140px rgba(229,184,11,0.2)'
      : 'rgba(131,56,236,0.55), 0 0 160px rgba(131,56,236,0.2)';
  const ruleColor = glow === 'gold' ? theme.colors.gold : theme.colors.purpleSoft;
  const valueText = countToText(valueTarget * countProgress, unit);
  const subtitleY = subtitleSettled ? 0 : Math.round((1 - subtitleProgress) * 14);
  const subtitleOpacity = subtitleSettled ? 1 : subtitleProgress;
  const ruleWidth = subtitleSettled ? 220 : Math.round(subtitleProgress * 220);

  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'translateZ(0)',
        }}
      >
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 148,
            fontWeight: 900,
            color: glow === 'gold' ? theme.colors.gold : theme.colors.white,
            letterSpacing: '-0.04em',
            lineHeight: 0.82,
            textAlign: 'center',
            transform: `translateY(${depthY}px) scale(${depthScale})`,
            opacity: pop,
            textShadow: `0 0 72px ${glowColor}`,
          }}
        >
          {valueText}
        </div>

        <div
          style={{
            width: `${ruleWidth}px`,
            height: 2,
            marginTop: 26,
            marginBottom: 24,
            opacity: subtitleOpacity,
            background: `linear-gradient(90deg, transparent, ${ruleColor}, transparent)`,
            transform: 'none',
          }}
        />

        <div
          style={{
            fontFamily: montserrat,
            fontSize: 24,
            fontWeight: 700,
            color: theme.colors.muted,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            textAlign: 'center',
            transform: subtitleSettled ? 'none' : `translate3d(0, ${subtitleY}px, 0)`,
            opacity: subtitleOpacity,
          }}
        >
          {label}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const S05MetricsRoadmap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const beat1Opacity = interpolate(
    frame,
    [BEAT1_START, BEAT1_START + 5, BEAT1_END - 8, BEAT1_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const beat2Opacity = interpolate(
    frame,
    [BEAT2_START, BEAT2_START + 5, BEAT2_END - 6, BEAT2_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const fadeToBlack = interpolate(frame, [FADE_TO_BLACK, SCENE_TOTAL], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden' }}>
      <SiteAtmosphere />

      <MetricBeat
        frame={frame}
        fps={fps}
        start={BEAT1_START}
        opacity={beat1Opacity}
        valueTarget={100000}
        unit="k"
        label="LinkedIn Impressions"
        glow="gold"
      />
      <MetricBeat
        frame={frame}
        fps={fps}
        start={BEAT2_START}
        opacity={beat2Opacity}
        valueTarget={6000}
        unit="plain"
        label="Students Reached"
        glow="purple"
      />

      <AbsoluteFill
        style={{
          background: theme.colors.bg,
          opacity: fadeToBlack,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
