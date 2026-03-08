/**
 * SiteAtmosphere — faithful Remotion recreation of the website's CinematicBackground.
 *
 * Layers (matching CinematicBackground.tsx exactly):
 *  1. Gold light leak   — top-right,   radial, blur 96px, breathing opacity
 *  2. Purple light leak — bottom-left, radial, blur 104px, breathing opacity
 *  3. Center orb base   — dark radial with purple edge, blur 64px, opacity 0.55
 *  4. Breathing halo    — scale 0.85..1.15, opacity 0.08..0.38, period 6.4s
 *  5. Bloom overlay     — heavy gaussian blur above all layers; breathes with halo;
 *                         creates the soft dreamy luminance the live site has.
 *
 * Breathing: sin-based frame math replicates CSS ease-in-out atmoPulseHalo keyframe.
 * Leak opacity: counter-phase oscillation on shorter period for organic feel.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

interface SiteAtmosphereProps {
  /**
   * Slow drift offsets for the center orb, -1..1 range.
   * Set via interpolated frame values in the parent scene for subtle motion.
   */
  orbX?: number;
  orbY?: number;
  /** Overall opacity multiplier, default 1 */
  opacity?: number;
}

// Base leak opacity: clamp(0, 0.255 * 1.35, 0.55) = 0.344 — matches website
const LEAK_OPACITY_BASE = 0.344;

// Halo: wider range than real CSS keyframe to compensate for no mouse-tracking movement.
// Real site: scale 0.94..1.07, opacity 0.10..0.26
// Our version: scale 0.85..1.15, opacity 0.08..0.38 — more dramatic, still premium
const HALO_SCALE_MIN = 0.85;
const HALO_SCALE_MAX = 1.15;
const HALO_OP_MIN = 0.08;
const HALO_OP_MAX = 0.38;

// Primary breathing: 6.4s × 30fps = 192 frames (matches atmoPulseHalo duration)
const BREATHE_PERIOD_FRAMES = 192;
// Secondary leak oscillator: ~4.3s period — counterpoint creates organic motion
const LEAK_PERIOD_FRAMES = 130;

export const SiteAtmosphere: React.FC<SiteAtmosphereProps> = ({
  orbX = 0,
  orbY = 0,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  useVideoConfig(); // required for Remotion context

  // Primary breathing: 0..1, peaks at frame 48 of each 192-frame cycle
  const breathT = (Math.sin((frame / BREATHE_PERIOD_FRAMES) * Math.PI * 2) + 1) / 2;

  // Secondary oscillator for leaks: inverted phase for organic counterpoint
  const leakT = (Math.sin((frame / LEAK_PERIOD_FRAMES) * Math.PI * 2 + Math.PI) + 1) / 2;

  const haloScale = HALO_SCALE_MIN + breathT * (HALO_SCALE_MAX - HALO_SCALE_MIN);
  const haloOpacity = HALO_OP_MIN + breathT * (HALO_OP_MAX - HALO_OP_MIN);

  // Leak opacity modulation: ±30% swing on secondary oscillator
  const leakOpacity = LEAK_OPACITY_BASE * (0.70 + leakT * 0.60); // 0.70x..1.30x base

  // Orb position: center of canvas ± drift offset (in % units)
  const orbOffX = orbX * 4; // ±4% max gentle drift
  const orbOffY = orbY * 4;

  // Bloom opacity: rises with halo breathe — peaks when halo is largest
  const bloomOpacity = 0.16 + breathT * 0.22; // 0.16..0.38

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        pointerEvents: 'none',
        // No overflow:hidden — clipping blurred children at the boundary
        // creates rendering artifacts in Chromium. Let the canvas clip instead.
      }}
    >
      {/*
       * Layer 1 — Gold light leak, top-right corner
       * Website: top: -10vh; right: -12vw; size: 35vw × 35vw; blur: 96px
       * Adapted for 1080×1920 portrait canvas. Opacity breathes gently.
       */}
      <div
        style={{
          position: 'absolute',
          top: '-8%',
          right: '-10%',
          width: '55%',
          height: '30%',
          background:
            'radial-gradient(circle at 70% 30%, rgba(255,214,2,0.34) 0%, rgba(255,214,2,0.16) 26%, rgba(255,214,2,0.00) 62%)',
          filter: 'blur(96px)',
          opacity: leakOpacity,
          willChange: 'opacity',
        }}
      />

      {/*
       * Layer 2 — Purple light leak, bottom-left corner
       * Website: bottom: -12vh; left: -12vw; size: 38vw × 38vw; blur: 104px
       * Color: rgba(122,77,255) = #7A4DFF (lifted purple, matches real site)
       */}
      <div
        style={{
          position: 'absolute',
          bottom: '-8%',
          left: '-10%',
          width: '58%',
          height: '32%',
          background:
            'radial-gradient(circle at 30% 70%, rgba(122,77,255,0.4) 0%, rgba(122,77,255,0.22) 22%, rgba(122,77,255,0) 62%)',
          filter: 'blur(104px)',
          opacity: leakOpacity,
          willChange: 'opacity',
        }}
      />

      {/*
       * Layer 3 — Center orb base
       * Website: 110vw × 110vw; blur: 64px; opacity: 0.55
       * Dark center, purple halo at 36% (rgba(58,12,163,0.14))
       */}
      <div
        style={{
          position: 'absolute',
          left: `calc(50% + ${orbOffX}%)`,
          top: `calc(50% + ${orbOffY}%)`,
          width: '130%',
          height: '80%',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.38) 18%, rgba(58,12,163,0.14) 36%, rgba(5,5,5,0) 72%)',
          filter: 'blur(64px)',
          opacity: 0.55,
        }}
      />

      {/*
       * Layer 4 — Breathing halo
       * Website: same gradient as orb, CSS keyframe scale 0.94..1.07, opacity 0.10..0.26
       * We use wider range + more purple (0.22 vs 0.14) to compensate for no mouse movement.
       */}
      <div
        style={{
          position: 'absolute',
          left: `calc(50% + ${orbOffX}%)`,
          top: `calc(50% + ${orbOffY}%)`,
          width: '130%',
          height: '80%',
          transform: `translate(-50%, -50%) scale(${haloScale})`,
          background:
            'radial-gradient(circle, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.20) 18%, rgba(58,12,163,0.22) 36%, rgba(5,5,5,0) 72%)',
          filter: 'blur(64px)',
          opacity: haloOpacity,
        }}
      />

      {/*
       * Layer 5 — Bloom overlay
       * Heavy gaussian blur (110px) cap over all layers.
       * This is the key layer: makes the light leaks bleed beyond their hard edges
       * into a soft ambient haze that pulses with breathT.
       * Creates the luminous, alive feel of the live website.
       */}
      <div
        style={{
          position: 'absolute',
          left: `calc(50% + ${orbOffX}%)`,
          top: `calc(50% + ${orbOffY}%)`,
          width: '160%',
          height: '100%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(ellipse at 50% 50%,
            rgba(58,12,163,${(0.14 + breathT * 0.14).toFixed(3)}) 0%,
            rgba(122,77,255,${(0.08 + breathT * 0.08).toFixed(3)}) 28%,
            rgba(255,214,2,${(0.04 + breathT * 0.04).toFixed(3)}) 52%,
            transparent 72%)`,
          filter: 'blur(110px)',
          opacity: bloomOpacity,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
