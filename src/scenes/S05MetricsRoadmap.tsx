import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { theme } from '../lib/theme';
import { orbitron, montserrat } from '../lib/fonts';
import { heroSpring, softSpring } from '../lib/springs';

// Scene duration: 72 frames (2.4s), global start: 510
//
// Three fast beats — each one hits hard and exits clean:
//
// Beat 1 — Roadmap Zoom  [f00–26]
//   Roadmap timeline image zooms through (scale 0.82→1.20).
//   "NATIONALS" slams in from bottom, "UAE" gold accent overlaps.
//   Leaves on a quick vignette fade.
//
// Beat 2 — 100k+ Impression [f24–48]
//   Cross-dissolve. Massive gold "100k+" in Orbitron 900.
//   "LINKEDIN IMPRESSIONS" sub-label in muted Montserrat.
//
// Beat 3 — 6,000+ Students  [f46–72]
//   Cross-dissolve. "6,000+" in white. "STUDENTS REACHED".
//   Fades to black into S06.

const BEAT1_START = 0;
const BEAT1_END = 26;
const BEAT2_START = 22;   // 4-frame overlap for smooth cross-dissolve
const BEAT2_END = 48;
const BEAT3_START = 44;   // 4-frame overlap
const FADE_TO_BLACK = 62;
const SCENE_TOTAL = 72;

export const S05MetricsRoadmap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Beat opacities (cross-dissolve) ───────────────────────────────────────
  const beat1Opacity = interpolate(
    frame,
    [BEAT1_START, BEAT1_START + 6, BEAT1_END - 6, BEAT1_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const beat2Opacity = interpolate(
    frame,
    [BEAT2_START, BEAT2_START + 6, BEAT2_END - 6, BEAT2_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const beat3Opacity = interpolate(
    frame,
    [BEAT3_START, BEAT3_START + 6, FADE_TO_BLACK, SCENE_TOTAL],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Beat 1: Roadmap zoom ───────────────────────────────────────────────────
  const roadmapScale = interpolate(frame, [BEAT1_START, BEAT1_END], [0.82, 1.22], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const nationalsSpring = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: heroSpring,
    durationInFrames: 22,
  });
  const nationalsY = (1 - nationalsSpring) * 50;

  const uaeSpring = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: heroSpring,
    durationInFrames: 18,
  });

  // ── Beat 2: 100k+ ─────────────────────────────────────────────────────────
  const metric1Spring = spring({
    frame: Math.max(0, frame - BEAT2_START),
    fps,
    config: heroSpring,
    durationInFrames: 22,
  });
  const metric1Y = (1 - metric1Spring) * 40;

  const metric1SubSpring = spring({
    frame: Math.max(0, frame - (BEAT2_START + 6)),
    fps,
    config: softSpring,
    durationInFrames: 18,
  });

  // ── Beat 3: 6,000+ ────────────────────────────────────────────────────────
  const metric2Spring = spring({
    frame: Math.max(0, frame - BEAT3_START),
    fps,
    config: heroSpring,
    durationInFrames: 22,
  });
  const metric2Y = (1 - metric2Spring) * 40;

  const metric2SubSpring = spring({
    frame: Math.max(0, frame - (BEAT3_START + 6)),
    fps,
    config: softSpring,
    durationInFrames: 18,
  });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════════════════════
          BEAT 1 — Roadmap Zoom
      ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: beat1Opacity }}>

        {/* Timeline image — zooms through */}
        <AbsoluteFill
          style={{
            transform: `scale(${roadmapScale})`,
            transformOrigin: 'center 40%',
          }}
        >
          <Img
            src={staticFile('assets/timeline-row1-with-car.png')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>

        {/* Heavy dark vignette — keeps timeline as texture, not literal */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(5,5,5,0.72) 0%, rgba(5,5,5,0.38) 35%, rgba(5,5,5,0.55) 65%, rgba(5,5,5,0.90) 100%)',
          }}
        />
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 50%, transparent 20%, rgba(5,5,5,0.60) 100%)',
          }}
        />

        {/* "NATIONALS" slam */}
        <div
          style={{
            position: 'absolute',
            bottom: '35%',
            left: 0,
            right: 0,
            textAlign: 'center',
            transform: `translateY(${nationalsY}px)`,
            opacity: nationalsSpring,
          }}
        >
          <div
            style={{
              fontFamily: orbitron,
              fontSize: 80,
              fontWeight: 900,
              color: theme.colors.white,
              letterSpacing: '-0.02em',
              lineHeight: 0.92,
              textShadow: `0 0 60px rgba(131,56,236,0.45)`,
            }}
          >
            Nationals
          </div>
        </div>

        {/* "UAE" gold accent */}
        <div
          style={{
            position: 'absolute',
            bottom: '27%',
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: uaeSpring,
            transform: `translateY(${(1 - uaeSpring) * 22}px)`,
          }}
        >
          <div
            style={{
              fontFamily: orbitron,
              fontSize: 36,
              fontWeight: 700,
              color: theme.colors.gold,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textShadow: `0 0 28px rgba(229,184,11,0.55)`,
            }}
          >
            UAE · Q2 Race Window
          </div>
        </div>

      </AbsoluteFill>

      {/* ══════════════════════════════════════════════════════════════════════
          BEAT 2 — 100k+ Impressions
      ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: beat2Opacity }}>

        {/* Subtle atmosphere */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 65% 45% at 50% 50%, rgba(58,12,163,0.22) 0%, transparent 72%)',
          }}
        />

        {/* Center content */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Number */}
          <div
            style={{
              fontFamily: orbitron,
              fontSize: 130,
              fontWeight: 900,
              color: theme.colors.gold,
              letterSpacing: '-0.03em',
              lineHeight: 0.85,
              textAlign: 'center',
              transform: `translateY(${metric1Y}px)`,
              opacity: metric1Spring,
              textShadow: `0 0 60px rgba(229,184,11,0.45), 0 0 120px rgba(229,184,11,0.18)`,
            }}
          >
            100k+
          </div>

          {/* Gold rule */}
          <div
            style={{
              width: `${metric1SubSpring * 160}px`,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${theme.colors.gold}, transparent)`,
              margin: '24px auto',
              opacity: metric1SubSpring,
            }}
          />

          {/* Sub-label */}
          <div
            style={{
              fontFamily: montserrat,
              fontSize: 22,
              fontWeight: 600,
              color: theme.colors.muted,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              textAlign: 'center',
              opacity: metric1SubSpring,
              transform: `translateY(${(1 - metric1SubSpring) * 14}px)`,
            }}
          >
            LinkedIn Impressions
          </div>
        </AbsoluteFill>

      </AbsoluteFill>

      {/* ══════════════════════════════════════════════════════════════════════
          BEAT 3 — 6,000+ Students
      ══════════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{ opacity: beat3Opacity }}>

        {/* Subtle atmosphere — shifted purple hue for variety */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 65% 45% at 50% 50%, rgba(131,56,236,0.18) 0%, transparent 72%)',
          }}
        />

        {/* Center content */}
        <AbsoluteFill
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Number — white instead of gold for contrast with previous beat */}
          <div
            style={{
              fontFamily: orbitron,
              fontSize: 130,
              fontWeight: 900,
              color: theme.colors.white,
              letterSpacing: '-0.03em',
              lineHeight: 0.85,
              textAlign: 'center',
              transform: `translateY(${metric2Y}px)`,
              opacity: metric2Spring,
              textShadow: `0 0 70px rgba(131,56,236,0.50), 0 0 140px rgba(131,56,236,0.20)`,
            }}
          >
            6,000+
          </div>

          {/* Purple rule */}
          <div
            style={{
              width: `${metric2SubSpring * 160}px`,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${theme.colors.purpleSoft}, transparent)`,
              margin: '24px auto',
              opacity: metric2SubSpring,
            }}
          />

          {/* Sub-label */}
          <div
            style={{
              fontFamily: montserrat,
              fontSize: 22,
              fontWeight: 600,
              color: theme.colors.muted,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              textAlign: 'center',
              opacity: metric2SubSpring,
              transform: `translateY(${(1 - metric2SubSpring) * 14}px)`,
            }}
          >
            Students Reached
          </div>
        </AbsoluteFill>

      </AbsoluteFill>

    </AbsoluteFill>
  );
};
