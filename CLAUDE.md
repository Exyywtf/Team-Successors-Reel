# TeamSuccessorsReel — Project Rules

## Reel-Native Text Motion

**Rule: Reel-native text must animate in smoothly, fully settle, and remain perfectly static after landing.**

- All text entrance animations must use a single, deterministic motion: a spring or eased interpolate that rises from 0 → 1 and stays at 1.
- After settling, text transforms and opacity must be completely static — no drift, no oscillation, no slow creep.
- **Never use `> 0.96` (or any threshold) snap guards on spring values.** These cause a 1-frame discrete jump when the spring crosses the threshold, which is visible as a glitch. Use raw spring values directly, or `Math.min(spring, 1)` for opacity safety.
- **Never apply `cameraBreathScale`, `parallaxDrift`, or `zDrift` to reel-native text containers.** These are continuous sinusoidal functions — they never reach a stable value and cause perpetual sub-pixel motion on text.
- **Springs used for translateY/X text entrances must use `overshootClamping: true`** (or a sufficiently damped config) unless intentional overshoot is desired. Underdamped springs (`overshootClamping: false`) on translateY will cause post-settle bounce that reads as a glitch.
- Fade-out interpolations on text scenes should use smoothstep easing `(t) => t * t * (3 - 2 * t)` so the fade onset is gradual rather than abrupt.

## Read-Only Reference

`C:\Users\Admin\dev\TeamSuccessors` — do not modify this repo.
