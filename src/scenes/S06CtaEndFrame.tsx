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
import { LogoMark } from '../components/LogoMark';
import { SiteAtmosphere } from '../components/SiteAtmosphere';
import { theme } from '../lib/theme';
import { orbitron, montserrat } from '../lib/fonts';
import { heroSpring, softSpring } from '../lib/springs';

// Scene duration: 96 frames (3.2s), global start: 596
//
// Timeline:
//   f00–12  — scene fades in
//   f06     — logo springs in
//   f22     — eyebrow + CTA heading animate in
//   f36     — URL fades in
//   f48     — sponsor logos stagger in
//   f84–96  — fade to black

const SCENE_FADE_IN = 12;
const LOGO_DELAY = 6;
const CTA_DELAY = 22;
const URL_DELAY = 36;
const SPONSORS_DELAY = 46;
const FADE_TO_BLACK_START = 84;
const SCENE_TOTAL = 96;

// Sponsor config — colored, no invert filter
const SPONSORS = [
  { file: 'vmake.svg',     label: 'VMake'            },
  { file: 'spicebox.svg',  label: 'Spicebox.AI'      },
  { file: 'indiana.svg',   label: 'Indiana Delights' },
  { file: 'yetkey.svg',    label: 'YetKey'           },
];

export const S06CtaEndFrame: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scene envelope ────────────────────────────────────────────────────────
  const sceneIn = interpolate(frame, [0, SCENE_FADE_IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });
  const fadeToBlack = interpolate(frame, [FADE_TO_BLACK_START, SCENE_TOTAL], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Atmosphere: slow orb drift right→left for gentle motion ──────────────

  // ── CTA heading ───────────────────────────────────────────────────────────
  const ctaSpring = spring({
    frame: Math.max(0, frame - CTA_DELAY),
    fps,
    config: heroSpring,
    durationInFrames: 32,
  });
  const ctaY = ctaSpring > 0.96 ? 0 : (1 - ctaSpring) * 45;

  // ── URL ───────────────────────────────────────────────────────────────────
  const urlSpring = spring({
    frame: Math.max(0, frame - URL_DELAY),
    fps,
    config: softSpring,
    durationInFrames: 25,
  });

  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        overflow: 'hidden',
      }}
    >
      {/* Website-faithful atmosphere (same treatment as S01) */}
      <SiteAtmosphere />

      {/* ── Content column ── */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 72px',
        }}
      >
        {/* Crown — matches S02 size */}
        <div style={{ marginBottom: 36 }}>
          <LogoMark size={120} delay={LOGO_DELAY} glowColor="rgba(131,56,236,0.6)" />
        </div>

        {/* Eyebrow — aligned with S02's eyebrow scale */}
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 22,
            fontWeight: 700,
            color: theme.colors.gold,
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            opacity: ctaSpring,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Partnership Opportunity
        </div>

        {/* CTA heading — large, sponsor-facing */}
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 64,
            fontWeight: 900,
            color: theme.colors.white,
            letterSpacing: '-0.01em',
            textAlign: 'center',
            lineHeight: 1.08,
            transform: `translateY(${ctaY}px)`,
            opacity: ctaSpring,
            textShadow: `0 0 40px rgba(131,56,236,0.35)`,
            maxWidth: 900,
          }}
        >
          Sponsor With<br />Clear Outcomes.
        </div>

        {/* Gold rule */}
        <div
          style={{
            width: `${ctaSpring * 180}px`,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${theme.colors.gold}, transparent)`,
            margin: '26px auto',
            opacity: ctaSpring,
          }}
        />

        {/* URL — slightly larger */}
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 32,
            fontWeight: 700,
            color: theme.colors.gold,
            letterSpacing: '0.06em',
            textAlign: 'center',
            opacity: urlSpring,
            textShadow: `0 0 24px rgba(229,184,11,0.55)`,
          }}
        >
          successorsf1.com
        </div>

        {/* Sponsor logos — full colored, significantly larger */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 44,
            marginTop: 48,
            flexWrap: 'wrap',
            maxWidth: 960,
          }}
        >
          {SPONSORS.map(({ file, label }, i) => {
            const sponsorSpring = spring({
              frame: Math.max(0, frame - (SPONSORS_DELAY + i * 7)),
              fps,
              config: softSpring,
              durationInFrames: 22,
            });
            return (
              <div
                key={file}
                style={{
                  opacity: sponsorSpring * 0.9,
                  transform: `scale(${sponsorSpring > 0.96 ? 1 : 0.75 + sponsorSpring * 0.25}) translateY(${sponsorSpring > 0.96 ? 0 : (1 - sponsorSpring) * 22}px)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                {/* Colored sponsor logo — no brightness/invert filter */}
                <div
                  style={{
                    height: 154,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Img
                    src={staticFile(`assets/${file}`)}
                    style={{
                      height: '100%',
                      maxWidth: 270,
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.42))',
                      // No filter — render sponsor logos in their real colors
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: montserrat,
                    fontSize: 24,
                    fontWeight: 500,
                    color: theme.colors.muted,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* GEMS footer */}
        <div
          style={{
            marginTop: 40,
            fontFamily: montserrat,
            fontSize: 24,
            fontWeight: 400,
            color: theme.colors.muted,
            letterSpacing: '0.14em',
            textAlign: 'center',
            opacity: urlSpring * 0.6,
            textTransform: 'uppercase',
          }}
        >
          GEMS Founders School · Dubai, UAE
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
