import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { LogoMark } from '../components/LogoMark';
import { theme } from '../lib/theme';
import { orbitron, montserrat } from '../lib/fonts';
import { heroSpring, softSpring } from '../lib/springs';

// Local frame 0 = global frame 62 (10-frame overlap with S01 bloom exit)
// Scene total: 180 frames (6.0s)
//
// Timeline:
//   f00–18  — scene fades in (blend with S01 bloom exit)
//   f22     — logo springs in
//   f35     — eyebrow label fades in
//   f38     — "Successors" headline slams up
//   f58     — "Inheriting the Legacy." slides from left
//   f76     — "Defining the Future." slides from right
//   f100    — subline fades in
//   f165–180 — scene fades out to dark for S03

const SCENE_FADE_IN_END = 18;
const LOGO_DELAY = 22;
const EYEBROW_DELAY = 35;
const HEADLINE_DELAY = 38;
const LINE1_DELAY = 58;
const LINE2_DELAY = 76;
const SUBLINE_DELAY = 100;
const FADE_OUT_START = 165;
const SCENE_TOTAL = 180;

export const S02HeroReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scene envelope ────────────────────────────────────────────────────────
  const sceneIn = interpolate(frame, [0, SCENE_FADE_IN_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });
  const sceneOut = interpolate(frame, [FADE_OUT_START, SCENE_TOTAL], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sceneOpacity = Math.min(sceneIn, sceneOut);

  // ── hero.jpg slow ambient drift ───────────────────────────────────────────
  const bgScale = interpolate(frame, [0, SCENE_TOTAL], [1.06, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bgDriftX = interpolate(frame, [0, SCENE_TOTAL], [14, -10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Eyebrow ───────────────────────────────────────────────────────────────
  const eyebrowSpring = spring({
    frame: Math.max(0, frame - EYEBROW_DELAY),
    fps,
    config: softSpring,
    durationInFrames: 30,
  });

  // ── "Successors" headline slam ────────────────────────────────────────────
  const headlineSpring = spring({
    frame: Math.max(0, frame - HEADLINE_DELAY),
    fps,
    config: heroSpring,
    durationInFrames: 40,
  });
  const headlineY = (1 - headlineSpring) * 70;

  // ── Divider line ──────────────────────────────────────────────────────────
  const dividerSpring = spring({
    frame: Math.max(0, frame - HEADLINE_DELAY - 8),
    fps,
    config: heroSpring,
    durationInFrames: 30,
  });

  // ── Tagline line 1: slide from left ───────────────────────────────────────
  const line1Spring = spring({
    frame: Math.max(0, frame - LINE1_DELAY),
    fps,
    config: heroSpring,
    durationInFrames: 35,
  });
  const line1X = (1 - line1Spring) * -90;

  // ── Tagline line 2: slide from right ──────────────────────────────────────
  const line2Spring = spring({
    frame: Math.max(0, frame - LINE2_DELAY),
    fps,
    config: heroSpring,
    durationInFrames: 35,
  });
  const line2X = (1 - line2Spring) * 90;

  // ── Subline soft reveal ───────────────────────────────────────────────────
  const sublineSpring = spring({
    frame: Math.max(0, frame - SUBLINE_DELAY),
    fps,
    config: softSpring,
    durationInFrames: 35,
  });

  // Purple bloom handoff from S01 — fades in the first 25 local frames
  const bloomHandoff = interpolate(frame, [0, 25], [0.4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity: sceneOpacity }}>

      {/* ── hero.mp4 — atmospheric silk wave looping video ── */}
      <AbsoluteFill
        style={{
          transform: `scale(${bgScale}) translateX(${bgDriftX}px)`,
          transformOrigin: 'center center',
        }}
      >
        <OffthreadVideo
          src={staticFile('assets/hero.mp4')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
        />
      </AbsoluteFill>

      {/* Dark overlay — controls readability */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(5,5,5,0.50) 0%, rgba(5,5,5,0.70) 55%, rgba(5,5,5,0.90) 100%)',
        }}
      />

      {/* Purple bloom handoff from S01 — dissolves the atmosphere into hero */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 50%, rgba(58,12,163,${bloomHandoff}) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Content column ── */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 64px',
        }}
      >
        {/* Crown / Logo — slightly larger */}
        <div style={{ marginBottom: 32 }}>
          <LogoMark size={120} delay={LOGO_DELAY} />
        </div>

        {/* Eyebrow — now comfortably readable on mobile */}
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 22,
            fontWeight: 700,
            color: theme.colors.gold,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            opacity: eyebrowSpring,
            marginBottom: 18,
            textAlign: 'center',
          }}
        >
          F1 in Schools · UAE
        </div>

        {/* "Successors" — title case, headline slam */}
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 112,
            fontWeight: 900,
            color: theme.colors.white,
            letterSpacing: '-0.02em',
            lineHeight: 0.9,
            textAlign: 'center',
            transform: `translateY(${headlineY}px)`,
            opacity: headlineSpring,
            textShadow: `0 0 60px rgba(131,56,236,0.5), 0 0 120px rgba(131,56,236,0.22)`,
          }}
        >
          Successors
        </div>

        {/* Gold divider */}
        <div
          style={{
            width: `${dividerSpring * 220}px`,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${theme.colors.gold}, transparent)`,
            margin: '24px auto',
            opacity: dividerSpring,
          }}
        />

        {/* "Inheriting the Legacy." */}
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 36,
            fontWeight: 700,
            color: theme.colors.white,
            letterSpacing: '0.03em',
            textAlign: 'center',
            transform: `translateX(${line1X}px)`,
            opacity: line1Spring,
            lineHeight: 1.2,
          }}
        >
          Inheriting the Legacy.
        </div>

        {/* "Defining the Future." */}
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 36,
            fontWeight: 700,
            color: theme.colors.gold,
            letterSpacing: '0.03em',
            textAlign: 'center',
            transform: `translateX(${line2X}px)`,
            opacity: line2Spring,
            marginTop: 8,
            lineHeight: 1.2,
          }}
        >
          Defining the Future.
        </div>

        {/* Subline — significantly larger, readable on mobile */}
        <div
          style={{
            fontFamily: montserrat,
            fontSize: 26,
            fontWeight: 400,
            color: theme.colors.textDim,
            letterSpacing: '0.03em',
            textAlign: 'center',
            marginTop: 36,
            opacity: sublineSpring * 0.85,
            lineHeight: 1.55,
            maxWidth: 780,
          }}
        >
          An F1 in Schools team. Precision engineering.
          {'\n'}Sponsor-ready outcomes.
        </div>
      </AbsoluteFill>

      {/* Bottom vignette */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(0deg, rgba(5,5,5,0.88) 0%, transparent 32%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
