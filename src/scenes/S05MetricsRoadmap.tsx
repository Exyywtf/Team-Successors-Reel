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

const SCENE_TOTAL = 97;
const FADE_TO_BLACK = 87;

const BEAT1_START = 0;
const BEAT1_END = 43;
const BEAT2_START = 38;
const BEAT2_END = SCENE_TOTAL;

const countToText = (value: number, unit: 'k' | 'plain') => {
  if (unit === 'k') {
    return `${Math.max(0, Math.round(value / 1000)).toLocaleString()}k+`;
  }
  return `${Math.max(0, Math.round(value)).toLocaleString()}+`;
};

const countToPreviewText = (
  value: number,
  valueTarget: number,
  unit: 'k' | 'plain',
) => {
  if (unit === 'k') {
    const previewK = Math.max(0, Math.floor(value / 1000));
    const targetK = Math.max(0, Math.round(valueTarget / 1000));
    const clampedPreviewK = Math.min(previewK, Math.max(0, targetK - 1));
    return `${clampedPreviewK.toLocaleString()}k+`;
  }

  const previewPlain = Math.max(0, Math.floor(value));
  const targetPlain = Math.max(0, Math.round(valueTarget));
  const clampedPreviewPlain = Math.min(
    previewPlain,
    Math.max(0, targetPlain - 1),
  );
  return `${clampedPreviewPlain.toLocaleString()}+`;
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
    durationInFrames: 19,
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

  const countEase = Easing.bezier(0.18, 0.84, 0.24, 1);
  const countStart = start + 2;
  const countProgress = interpolate(
    frame,
    [countStart, countStart + 17],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: countEase,
    },
  );

  const rawDepthY = (1 - pop) * 64;
  const rawDepthScale = 0.78 + pop * 0.22;
  const valueSettled = rawDepthY <= 0.25 && Math.abs(rawDepthScale - 1) <= 0.002;
  const depthY = valueSettled ? 0 : rawDepthY;
  const depthScale = valueSettled ? 1 : rawDepthScale;
  const valueOpacity = valueSettled ? 1 : pop;
  const glowColor =
    glow === 'gold'
      ? 'rgba(229,184,11,0.55), 0 0 140px rgba(229,184,11,0.2)'
      : 'rgba(131,56,236,0.55), 0 0 160px rgba(131,56,236,0.2)';
  const ruleColor = glow === 'gold' ? theme.colors.gold : theme.colors.purpleSoft;
  const animatedValueText = countToPreviewText(
    valueTarget * countProgress,
    valueTarget,
    unit,
  );
  const finalValueText = countToText(valueTarget, unit);
  const finalLocked = countProgress >= 1 && valueSettled;
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
            transform: finalLocked
              ? 'none'
              : `translate3d(0, ${depthY}px, 0) scale(${depthScale})`,
            opacity: finalLocked ? 1 : valueOpacity,
            transformOrigin: 'center center',
            textShadow: `0 0 72px ${glowColor}`,
            fontVariantNumeric: 'tabular-nums lining-nums',
            fontFeatureSettings: '"tnum" 1, "lnum" 1',
          }}
        >
          <span
            style={{
              position: 'relative',
              display: 'inline-grid',
              justifyItems: 'center',
              alignItems: 'center',
              minWidth: `${Math.max(1, finalValueText.length)}ch`,
            }}
          >
            {finalLocked ? (
              <>
                <span
                  aria-hidden
                  style={{
                    visibility: 'hidden',
                  }}
                >
                  {finalValueText}
                </span>
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {finalValueText}
                </span>
              </>
            ) : (
              <>
                <span
                  aria-hidden
                  style={{
                    visibility: 'hidden',
                  }}
                >
                  {finalValueText}
                </span>
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {animatedValueText}
                </span>
              </>
            )}
          </span>
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
