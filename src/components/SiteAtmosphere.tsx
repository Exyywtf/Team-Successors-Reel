import React from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface SiteAtmosphereProps {
  // Slow drift offsets for the center orb, -1..1 range.
  orbX?: number;
  orbY?: number;
  // Overall opacity multiplier.
  opacity?: number;
}

// Matches website desktop atmosphere values.
const LEAK_OPACITY = 0.344; // clamp(0, 0.255 * 1.35, 0.55)
const HALO_SCALE_MIN = 0.94;
const HALO_SCALE_MAX = 1.07;
const HALO_OPACITY_MIN = 0.1;
const HALO_OPACITY_MAX = 0.26;
const BREATHE_SECONDS = 6.4;

export const SiteAtmosphere: React.FC<SiteAtmosphereProps> = ({
  orbX = 0,
  orbY = 0,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mirrors website keyframes: 0% -> 50% -> 100%, eased in/out.
  const breatheFrames = Math.max(1, Math.round(fps * BREATHE_SECONDS));
  const cycle = (frame % breatheFrames) / breatheFrames;
  const mirroredT = cycle <= 0.5 ? cycle * 2 : (1 - cycle) * 2;
  const breatheT = Easing.inOut(Easing.ease)(mirroredT);

  const haloScale = interpolate(breatheT, [0, 1], [HALO_SCALE_MIN, HALO_SCALE_MAX], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const haloOpacity = interpolate(
    breatheT,
    [0, 1],
    [HALO_OPACITY_MIN, HALO_OPACITY_MAX],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Shared drift keeps atmosphere motion identical everywhere it is used.
  const sharedDriftX = Math.sin(frame / 90) * 0.18;
  const sharedDriftY = Math.cos(frame / 120) * 0.12;
  const orbOffX = (orbX + sharedDriftX) * 4;
  const orbOffY = (orbY + sharedDriftY) * 4;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-18vh',
          right: '-12vw',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 70% 30%, rgba(255,214,2,0.34) 0%, rgba(255,214,2,0.16) 26%, rgba(255,214,2,0.00) 62%)',
          filter: 'blur(96px)',
          opacity: LEAK_OPACITY,
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '-10vh',
          left: '-10vw',
          width: '36vw',
          height: '36vw',
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 30% 70%, rgba(122,77,255,0.38) 0%, rgba(122,77,255,0.2) 22%, rgba(122,77,255,0) 62%)',
          filter: 'blur(90px)',
          opacity: LEAK_OPACITY,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: `calc(50% + ${orbOffX}%)`,
          top: `calc(50% + ${orbOffY}%)`,
          width: '110vw',
          height: '110vw',
          transform: 'translate(-50%, -50%)',
          borderRadius: '9999px',
          background:
            'radial-gradient(circle, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.38) 18%, rgba(58,12,163,0.14) 36%, rgba(5,5,5,0) 72%, rgba(5,5,5,0) 100%)',
          filter: 'blur(64px)',
          opacity: 0.55,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: `calc(50% + ${orbOffX}%)`,
          top: `calc(50% + ${orbOffY}%)`,
          width: '110vw',
          height: '110vw',
          transform: `translate(-50%, -50%) scale(${haloScale})`,
          borderRadius: '9999px',
          background:
            'radial-gradient(circle, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.38) 18%, rgba(58,12,163,0.18) 36%, rgba(5,5,5,0) 72%, rgba(5,5,5,0) 100%)',
          filter: 'blur(64px)',
          opacity: haloOpacity,
        }}
      />
    </div>
  );
};
