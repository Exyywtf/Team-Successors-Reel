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
import { SiteAtmosphere } from '../components/SiteAtmosphere';
import { theme } from '../lib/theme';
import { orbitron } from '../lib/fonts';
import { heroSpring, softSpring } from '../lib/springs';

// Scene duration: 72 frames (2.4s), global start: 306
//
// Timeline image sits in the upper portion of the frame — clearly readable,
// properly framed above the "Nationals" title. Not used as zoomed background.
//
// Timeline:
//   f00–10  — scene fades in via overlay, SiteAtmosphere bg breathes
//   f06     — timeline image slides down from above, scale 1.06→1.00
//   f18     — "Nationals" slams up from below
//   f28     — "UAE · Q2 Race Window" gold accent fades up
//   f54–66  — fade to black

const FADE_IN_END = 10;
const TIMELINE_IN = 6;
const NATIONALS_DELAY = 18;
const UAE_DELAY = 28;
const FADE_OUT_START = 60;
const SCENE_TOTAL = 72;

export const STimeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scene envelope ─────────────────────────────────────────────────────────
  const sceneIn = interpolate(frame, [0, FADE_IN_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });
  const fadeToBlack = interpolate(frame, [FADE_OUT_START, SCENE_TOTAL], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Timeline image entry ───────────────────────────────────────────────────
  const timelineSpring = spring({
    frame: Math.max(0, frame - TIMELINE_IN),
    fps,
    config: heroSpring,
    durationInFrames: 28,
  });
  const timelineY = timelineSpring > 0.96 ? 0 : (1 - timelineSpring) * -60;
  const timelineScale = timelineSpring > 0.96 ? 1 : 1.02 - timelineSpring * 0.02;

  // ── "Nationals" slam ───────────────────────────────────────────────────────
  const nationalsSpring = spring({
    frame: Math.max(0, frame - NATIONALS_DELAY),
    fps,
    config: heroSpring,
    durationInFrames: 22,
  });
  const nationalsY = nationalsSpring > 0.96 ? 0 : (1 - nationalsSpring) * 52;

  // ── "UAE" gold accent ──────────────────────────────────────────────────────
  const uaeSpring = spring({
    frame: Math.max(0, frame - UAE_DELAY),
    fps,
    config: softSpring,
    durationInFrames: 22,
  });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden' }}>
      {/* Website-faithful atmosphere — same system as S01 / S06 */}
      <SiteAtmosphere />

      {/* ── Content column — flex centered, with camera breathing ── */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 46,
          padding: '64px 72px',
        }}
      >
        {/* ── Single card framing both timeline images ── */}
        <div
          style={{
            width: '100%',
            maxWidth: 960,
            flexShrink: 0,
            transform: `translateY(${timelineY}px) scale(${timelineScale})`,
            transformOrigin: 'center top',
            opacity: timelineSpring > 0.96 ? 1 : timelineSpring,
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.72), 0 0 0 1px rgba(131,56,236,0.15)',
            background: 'rgba(10,10,14,0.70)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {/* Row 1 — slightly inset from card edges */}
          <div style={{ borderRadius: 10, overflow: 'hidden' }}>
            <Img
              src={staticFile('assets/timeline-row1-with-car.png')}
              style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {/* Row 2 — same treatment */}
          <div style={{ borderRadius: 10, overflow: 'hidden' }}>
            <Img
              src={staticFile('assets/timeline-row2.png')}
              style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>

        {/* ── "Nationals" — below the card ── */}
        <div
          style={{
            transform: `translateY(${nationalsY}px)`,
            opacity: nationalsSpring > 0.96 ? 1 : nationalsSpring,
            textAlign: 'center',
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
              textShadow: '0 0 60px rgba(131,56,236,0.45)',
            }}
          >
            Nationals
          </div>
        </div>

        {/* ── "UAE · Q2 Race Window" gold accent ── */}
        <div
          style={{
            opacity: uaeSpring > 0.96 ? 1 : uaeSpring,
            transform: `translateY(${uaeSpring > 0.96 ? 0 : (1 - uaeSpring) * 22}px)`,
            textAlign: 'center',
            marginTop: 4,
          }}
        >
          <div
            style={{
              fontFamily: orbitron,
              fontSize: 30,
              fontWeight: 700,
              color: theme.colors.gold,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              textShadow: '0 0 28px rgba(229,184,11,0.55)',
            }}
          >
            UAE &nbsp;·&nbsp; Q2 Race Window
          </div>
        </div>
      </AbsoluteFill>

      {/* Scene fade-in overlay (avoids parent opacity on blur children) */}
      <AbsoluteFill
        style={{
          background: theme.colors.bg,
          opacity: 1 - sceneIn,
          pointerEvents: 'none',
        }}
      />

      {/* Fade to black */}
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
