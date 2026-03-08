import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { SiteAtmosphere } from '../components/SiteAtmosphere';
import { theme } from '../lib/theme';
import { orbitron, montserrat } from '../lib/fonts';
import { softSpring } from '../lib/springs';

// Scene duration: 88 frames (2.9s), global start: 422
//
// Concept: The actual successorsf1.com desktop website floats in dark space,
// rendered as a premium 2.5D browser viewport with depth, parallax, and camera motion.
//
// This is NOT a screen recording — it's a spatial motion-design treatment:
//   • Realistic browser chrome (traffic lights, URL bar)
//   • Actual site content: hero video bg, brand typography, sponsor logos
//   • CSS 3D perspective on the viewport: starts tilted, slowly de-tilts (push-in)
//   • Inner content scrolls from hero section → sponsors section
//   • SiteAtmosphere floats in the dark space surrounding the viewport
//
// Timeline:
//   f00–12   — scene fades in; viewport slides up into frame from below
//   f00–60   — camera push: tilt reduces (rotateX 15°→4°, rotateY -8°→2°)
//              viewport scales 0.82→1.0; creates "flying toward the screen" feel
//   f52–70   — inner content scrolls to reveal sponsors section
//   f76–88   — fade to black

const FADE_IN_END = 12;
const PUSH_END = 60;
const SCROLL_START = 52;
const SCROLL_END = 70;
const FADE_OUT_START = 76;
const SCENE_TOTAL = 88;

// Viewport logical dimensions
const VP_WIDTH = 920;
const VP_CHROME = 44;
const VP_CONTENT_H = 510;
const VP_HEIGHT = VP_CHROME + VP_CONTENT_H;

// Inner content: hero section (510px) + sponsors section (300px)
const INNER_TOTAL_H = VP_CONTENT_H + 300;

export const S04DesktopShowcase: React.FC = () => {
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

  // ── Camera motion: 3D tilt de-reducing (push-in) ──────────────────────────
  const cameraPush = interpolate(frame, [0, PUSH_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });
  const tiltX = 15 - cameraPush * 11;     // 15° → 4°
  const tiltY = -8 + cameraPush * 10;     // -8° → 2°
  const vpScale = 0.82 + cameraPush * 0.18; // 0.82 → 1.00

  // Viewport slides up from just below center on entry
  const vpEntryY = (1 - sceneIn) * 80;

  // ── Inner content scroll (hero → sponsors) ────────────────────────────────
  const scrollProgress = interpolate(frame, [SCROLL_START, SCROLL_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });
  const innerScrollY = scrollProgress * -300; // scroll up 300px to reveal sponsors

  // ── Parallax within viewport (video bg moves slower than UI) ──────────────
  const videoParallaxX = interpolate(frame, [0, PUSH_END], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const videoScale = 1.08 - cameraPush * 0.06; // 1.08 → 1.02 as we push in

  // ── Floating URL label (beside viewport) ──────────────────────────────────
  const urlLabelSpring = spring({
    frame: Math.max(0, frame - 28),
    fps,
    config: softSpring,
    durationInFrames: 28,
  });

  // ── Atmosphere orb drifts left→right during push ──────────────────────────
  const orbX = interpolate(frame, [0, SCENE_TOTAL], [-0.3, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        overflow: 'hidden',
        opacity: sceneIn,
      }}
    >
      {/* Atmospheric dark space the viewport floats in */}
      <SiteAtmosphere orbX={orbX} orbY={0} opacity={0.7} />

      {/* ── 3D perspective container ── */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1600px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* ── Viewport 3D wrapper ── */}
        <div
          style={{
            transform: `
              rotateX(${tiltX}deg)
              rotateY(${tiltY}deg)
              scale(${vpScale})
              translateY(${vpEntryY}px)
            `,
            transformOrigin: 'center center',
            width: VP_WIDTH,
            height: VP_HEIGHT,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: `
              0 60px 160px rgba(0,0,0,0.85),
              0 0 0 1px rgba(255,255,255,0.09),
              0 0 80px rgba(58,12,163,0.18)
            `,
          }}
        >
          {/* ── Browser chrome ── */}
          <div
            style={{
              height: VP_CHROME,
              background: 'rgba(10,10,10,0.98)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              flexShrink: 0,
              gap: 8,
            }}
          >
            {/* Traffic light dots */}
            <div style={{ display: 'flex', gap: 7, marginRight: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
            </div>
            {/* URL bar */}
            <div
              style={{
                flex: 1,
                height: 28,
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 6,
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              {/* Lock icon (inline SVG) */}
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                <rect x="1" y="6" width="10" height="8" rx="2" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
                <path d="M3.5 6V4.5C3.5 3.12 4.62 2 6 2C7.38 2 8.5 3.12 8.5 4.5V6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
              </svg>
              <span
                style={{
                  fontFamily: montserrat,
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.45)',
                  letterSpacing: '0.01em',
                }}
              >
                successorsf1.com
              </span>
            </div>
          </div>

          {/* ── Viewport content area (scrollable inner) ── */}
          <div
            style={{
              width: '100%',
              height: VP_CONTENT_H,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Scrollable inner content */}
            <div
              style={{
                width: '100%',
                height: INNER_TOTAL_H,
                transform: `translateY(${innerScrollY}px)`,
                transition: 'none', // driven by frame, not CSS transition
              }}
            >
              {/* ── Section 1: Hero ── */}
              <div style={{ width: '100%', height: VP_CONTENT_H, position: 'relative', overflow: 'hidden' }}>

                {/* Hero video background — the actual website background */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `scale(${videoScale}) translateX(${videoParallaxX}px)`,
                    transformOrigin: 'center center',
                    overflow: 'hidden',
                  }}
                >
                  <OffthreadVideo
                    src={staticFile('assets/hero.mp4')}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                  />
                </div>

                {/* Dark overlay — website faithful */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(5,5,5,0.50) 0%, rgba(5,5,5,0.68) 55%, rgba(5,5,5,0.88) 100%)',
                  }}
                />

                {/* Website atmosphere behind content */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(ellipse 80% 60% at 50% 42%, rgba(58,12,163,0.22) 0%, transparent 72%)',
                  }}
                />

                {/* Hero content — centered, matching real site layout */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 48px',
                  }}
                >
                  {/* Logo */}
                  <div style={{ marginBottom: 18 }}>
                    <Img
                      src={staticFile('assets/logo.svg')}
                      style={{ width: 54, height: 54, objectFit: 'contain' }}
                    />
                  </div>

                  {/* Eyebrow */}
                  <div
                    style={{
                      fontFamily: orbitron,
                      fontSize: 11,
                      fontWeight: 700,
                      color: theme.colors.gold,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      marginBottom: 12,
                      textAlign: 'center',
                    }}
                  >
                    F1 in Schools · UAE
                  </div>

                  {/* Main heading */}
                  <div
                    style={{
                      fontFamily: orbitron,
                      fontSize: 72,
                      fontWeight: 900,
                      color: theme.colors.white,
                      letterSpacing: '-0.02em',
                      lineHeight: 0.92,
                      textAlign: 'center',
                      textShadow: `0 0 60px rgba(131,56,236,0.5), 0 0 120px rgba(131,56,236,0.20)`,
                    }}
                  >
                    Successors
                  </div>

                  {/* Gold divider */}
                  <div
                    style={{
                      width: 140,
                      height: 1.5,
                      background: `linear-gradient(90deg, transparent, ${theme.colors.gold}, transparent)`,
                      margin: '16px auto',
                    }}
                  />

                  {/* Taglines */}
                  <div
                    style={{
                      fontFamily: orbitron,
                      fontSize: 18,
                      fontWeight: 700,
                      color: theme.colors.white,
                      letterSpacing: '0.02em',
                      textAlign: 'center',
                      lineHeight: 1.4,
                    }}
                  >
                    Inheriting the Legacy.
                  </div>
                  <div
                    style={{
                      fontFamily: orbitron,
                      fontSize: 18,
                      fontWeight: 700,
                      color: theme.colors.gold,
                      letterSpacing: '0.02em',
                      textAlign: 'center',
                      marginTop: 4,
                    }}
                  >
                    Defining the Future.
                  </div>

                  {/* Subline */}
                  <div
                    style={{
                      fontFamily: montserrat,
                      fontSize: 14,
                      fontWeight: 400,
                      color: theme.colors.textDim,
                      textAlign: 'center',
                      marginTop: 20,
                      lineHeight: 1.6,
                      maxWidth: 520,
                    }}
                  >
                    An F1 in Schools team. Precision engineering.
                    {' '}Sponsor-ready outcomes.
                  </div>
                </div>

                {/* Bottom mask — fades into sponsors section below */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 80,
                    background: 'linear-gradient(transparent, rgba(5,5,5,0.95))',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* ── Section 2: Sponsors ── */}
              <div
                style={{
                  width: '100%',
                  height: 300,
                  background: 'rgba(5,5,5,0.97)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 24,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  style={{
                    fontFamily: orbitron,
                    fontSize: 11,
                    fontWeight: 700,
                    color: theme.colors.muted,
                    letterSpacing: '0.26em',
                    textTransform: 'uppercase',
                  }}
                >
                  Our Sponsors
                </div>

                {/* Sponsor logos row */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 40,
                    flexWrap: 'wrap',
                    padding: '0 40px',
                  }}
                >
                  {(['vmake.svg', 'spicebox.svg', 'indiana.svg', 'yetkey.svg'] as const).map((file) => (
                    <div
                      key={file}
                      style={{ height: 42, display: 'flex', alignItems: 'center' }}
                    >
                      <Img
                        src={staticFile(`assets/${file}`)}
                        style={{ height: '100%', maxWidth: 120, objectFit: 'contain' }}
                      />
                    </div>
                  ))}
                </div>

                {/* Sponsor CTA */}
                <div
                  style={{
                    fontFamily: montserrat,
                    fontSize: 12,
                    color: theme.colors.muted,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}
                >
                  Partnership Opportunities Open
                </div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* ── Floating URL badge (beside the viewport) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '14%',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: urlLabelSpring * (1 - scrollProgress),
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: theme.colors.gold,
            boxShadow: `0 0 10px rgba(229,184,11,0.8)`,
          }}
        />
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 16,
            fontWeight: 700,
            color: theme.colors.gold,
            letterSpacing: '0.08em',
            textShadow: `0 0 20px rgba(229,184,11,0.5)`,
          }}
        >
          successorsf1.com
        </div>
      </div>

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
