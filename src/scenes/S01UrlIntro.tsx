import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SearchBubble } from '../components/SearchBubble';
import { TypewriterText } from '../components/Typewriter';
import { SiteAtmosphere } from '../components/SiteAtmosphere';
import { theme } from '../lib/theme';
import { orbitron } from '../lib/fonts';
import { snappySpring } from '../lib/springs';

// Scene duration: 66 frames (2.2s)
//
// Timeline:
//   f00–12  — search bar springs in
//   f10–58  — URL types out (22 chars × 2.2 fr/char)
//   f58–62  — hold with cursor blinking; typing complete
//   f60–72  — gentle premium exit: bar scales 1.0→1.12 + fades out
//             S02 starts overlapping at global f62 for continuity

const URL_TEXT = 'https://successorsf1.com';
const TYPE_START = 10;
const FRAMES_PER_CHAR = 2.2;
// Exit begins after a brief hold post-typing (typing completes ≈ f58)
const EXIT_START = 56;
const SCENE_END = 66;

export const S01UrlIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Bubble entrance (spring, snappy) ──────────────────────────────────────
  const enterProgress = spring({
    frame,
    fps,
    config: snappySpring,
    durationInFrames: 14,
  });
  const enterScale = 0.80 + enterProgress * 0.20;
  const enterOpacity = enterProgress;

  // ── Premium exit: only after typing is done ───────────────────────────────
  // Gentle scale-up + fade — slow, eased, not explosive
  const exitProgress = interpolate(frame, [EXIT_START, SCENE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t), // smoothstep — premium feel
  });
  const exitScale = 1 + exitProgress * 0.10;    // 1.0 → 1.10, very restrained
  const exitOpacity = 1 - exitProgress;          // 1 → 0 smoothly

  // Combine
  const finalScale = enterScale * exitScale;
  const finalOpacity = enterOpacity * exitOpacity;

  // ── Atmosphere orb: very slow drift left→right during scene ──────────────
  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        overflow: 'hidden',
      }}
    >
      {/* Website-faithful atmosphere — this IS the background */}
      <SiteAtmosphere />

      {/* Search bubble centered */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            transform: `scale(${finalScale})`,
            opacity: finalOpacity,
            transformOrigin: 'center center',
          }}
        >
          <SearchBubble
            glowIntensity={enterProgress * (1 - exitProgress * 0.6)}
            width={740}
            height={76}
          >
            <TypewriterText
              text={URL_TEXT}
              frame={frame}
              startFrame={TYPE_START}
              framesPerChar={FRAMES_PER_CHAR}
              cursorHideAfter={30}
              color={theme.colors.white}
              cursorColor={theme.colors.gold}
              fontFamily={orbitron}
              fontSize={21}
              fontWeight={700}
              letterSpacing="0.02em"
            />
          </SearchBubble>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
