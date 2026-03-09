import React from 'react';
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SearchBubble } from '../components/SearchBubble';
import { TypewriterText } from '../components/Typewriter';
import { SiteAtmosphere } from '../components/SiteAtmosphere';
import { theme } from '../lib/theme';
import { orbitron } from '../lib/fonts';
import { snappySpring } from '../lib/springs';
import { SCENE_DURATIONS, TRANSITION_DURATIONS } from '../lib/timing';

// Scene timing is derived from timing.ts so the local exit stays in sync
// with sequence retimes.
//
// Timeline:
//   f00–12  — search bar springs in
//   f10–70  — URL types out
//   f70–84  — short hold with cursor blinking; typing complete
//   f84–104 — gentle premium exit: bar scales 1.0→1.08 + fades out

const URL_TEXT = 'https://successorsf1.com';
const TYPE_START = 10;
const FRAMES_PER_CHAR = 2.5;
const TYPE_END = TYPE_START + URL_TEXT.length * FRAMES_PER_CHAR;
const HOLD_AFTER_TYPING = 12;
const SCENE_END = SCENE_DURATIONS.S01;
const EXIT_DURATION = Math.min(20, TRANSITION_DURATIONS.T01);
// Exit begins after a brief hold post-typing and stays synced to scene retimes.
const EXIT_START = Math.max(TYPE_END + HOLD_AFTER_TYPING, SCENE_END - EXIT_DURATION);

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
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });
  const exitScale = 1 + exitProgress * 0.08;    // 1.0 → 1.08, softer handoff
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
            transform: `scale(${finalScale}) translateZ(0)`,
            opacity: finalOpacity,
            transformOrigin: 'center center',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
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
