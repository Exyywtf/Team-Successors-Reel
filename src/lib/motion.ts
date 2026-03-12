import { Easing, interpolate } from 'remotion';

/**
 * Shared cinematic motion primitives for the reel.
 * Every scene pulls from these so the whole reel shares one motion language.
 */

// ── Camera breathing ────────────────────────────────────────────────────────
// Slow, subtle scale pulse that keeps scenes from feeling frozen.
// Returns a multiplier centered on 1.0 (e.g. 0.998 … 1.003).
export const cameraBreathScale = (frame: number, amplitude = 0.003, period = 120): number =>
  1 + Math.sin((frame / period) * Math.PI * 2) * amplitude;

// Slow forward Z-drift — returns a small translateZ or scale offset over time.
// Use for subtle "camera pushing in" feel during holds.
export const zDrift = (
  frame: number,
  startFrame: number,
  endFrame: number,
  amount = 0.012,
): number =>
  interpolate(frame, [startFrame, endFrame], [0, amount], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });

// Micro parallax drift — subtle X/Y sway for depth layers.
// Returns {x, y} in px. Different layers use different amplitudes for parallax.
export const parallaxDrift = (
  frame: number,
  xAmp = 3,
  yAmp = 2,
  xPeriod = 100,
  yPeriod = 140,
): { x: number; y: number } => ({
  x: Math.sin((frame / xPeriod) * Math.PI * 2) * xAmp,
  y: Math.cos((frame / yPeriod) * Math.PI * 2) * yAmp,
});

// ── Transition helpers ──────────────────────────────────────────────────────

// Premium easing curves used across the reel
export const EASE_PREMIUM = Easing.bezier(0.22, 0.61, 0.36, 1);
export const EASE_CINEMATIC = Easing.bezier(0.16, 0.72, 0.24, 1);
export const EASE_PUSH = Easing.bezier(0.32, 0.04, 0.18, 1);

// Bloom bridge — white/purple exposure spike that bridges two scenes.
// Returns opacity 0→peak→0 over the given frame range.
export const bloomBridge = (
  frame: number,
  startFrame: number,
  endFrame: number,
  peak = 0.18,
): number => {
  const mid = (startFrame + endFrame) / 2;
  if (frame < startFrame || frame > endFrame) return 0;
  if (frame <= mid) {
    return interpolate(frame, [startFrame, mid], [0, peak], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }
  return interpolate(frame, [mid, endFrame], [peak, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
};

// Smoothstep easing function — smoother than linear, no overshoot
export const smoothstep = (t: number): number => t * t * (3 - 2 * t);
