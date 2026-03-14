import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {SearchBubble} from '../components/SearchBubble';
import {TypewriterText} from '../components/Typewriter';
import {orbitron} from '../lib/fonts';
import {theme} from '../lib/theme';
import {
  URL_INTRO_ENTER_END,
  URL_INTRO_FRAMES_PER_CHAR,
  URL_INTRO_HOLD_DURATION,
  URL_INTRO_MORPH_END,
  URL_INTRO_MORPH_START,
  URL_INTRO_PUSH_START,
  URL_INTRO_SCENE_DURATION,
  URL_INTRO_TEXT,
  URL_INTRO_TYPE_START,
} from '../lib/urlIntroTiming';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export const S01UrlIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const settleEase = Easing.bezier(0.22, 1, 0.36, 1);
  const pushEase = Easing.bezier(0.18, 0.8, 0.24, 1);

  const enterProgress = spring({
    frame,
    fps,
    config: {
      damping: 22,
      stiffness: 132,
      mass: 1.16,
      overshootClamping: false,
    },
    durationInFrames: URL_INTRO_ENTER_END,
  });

  const morphProgress = spring({
    frame: Math.max(0, frame - URL_INTRO_MORPH_START),
    fps,
    config: {
      damping: 28,
      stiffness: 176,
      mass: 1.08,
      overshootClamping: false,
    },
    durationInFrames: URL_INTRO_MORPH_END - URL_INTRO_MORPH_START,
  });

  const textRevealProgress = interpolate(
    frame,
    [URL_INTRO_TYPE_START - 2, URL_INTRO_TYPE_START + 8],
    [0, 1],
    {
      ...clamp,
      easing: settleEase,
    },
  );

  const shellMorphProgress = interpolate(morphProgress, [0, 0.28, 1], [0, 0.04, 1], clamp);
  const iconTravelProgress = interpolate(morphProgress, [0, 0.58, 1], [0, 0.04, 1], clamp);

  const pushProgress = interpolate(
    frame,
    [URL_INTRO_PUSH_START, URL_INTRO_SCENE_DURATION],
    [0, 1],
    {
      ...clamp,
      easing: pushEase,
    },
  );

  const entryFade = interpolate(frame, [0, 7], [0, 1], {
    ...clamp,
    easing: settleEase,
  });
  const lifeProgress = interpolate(
    frame,
    [URL_INTRO_MORPH_START + 6, URL_INTRO_PUSH_START - 10],
    [0, 1],
    {
      ...clamp,
      easing: Easing.inOut(Easing.sin),
    },
  );

  const shellWidth = interpolate(shellMorphProgress, [0, 1], [100, 760], clamp);
  const shellHeight = interpolate(shellMorphProgress, [0, 1], [100, 88], clamp);
  const shellRadius = shellHeight / 2;
  const iconTargetX = -shellWidth / 2 + 56;
  const iconOffsetX = interpolate(iconTravelProgress, [0, 1], [0, iconTargetX], clamp);
  const iconScale = interpolate(iconTravelProgress, [0, 1], [1.08, 0.92], clamp);
  const baseScale = interpolate(enterProgress, [0, 1], [0.68, 1], clamp);
  const pushScale = interpolate(pushProgress, [0, 1], [1, 1.11], clamp);
  const lifeBreathScale = 1 + Math.sin(frame / 24) * 0.0045 * lifeProgress;
  const objectY =
    interpolate(enterProgress, [0, 1], [-228, 0], clamp) +
    Math.cos(frame / 40) * 0.9 * lifeProgress +
    interpolate(pushProgress, [0, 1], [0, -22], clamp);
  const objectRotateX =
    interpolate(enterProgress, [0, 1], [-14, 0], clamp) +
    interpolate(pushProgress, [0, 1], [0, 1.3], clamp);
  const objectRotateZ =
    interpolate(enterProgress, [0, 1], [-4.8, 0], clamp) +
    Math.sin(frame / 72) * 0.18 * lifeProgress;
  const objectRotateY =
    Math.cos(frame / 82) * 0.22 * lifeProgress +
    interpolate(pushProgress, [0, 1], [0, -0.55], clamp);
  const objectOpacity =
    entryFade * interpolate(pushProgress, [0, 1], [1, 0.95], clamp);
  const glowIntensity = Math.min(
    1,
    0.24 + morphProgress * 0.24 + textRevealProgress * 0.14 + lifeProgress * 0.08,
  );
  const contentOpacity =
    textRevealProgress * interpolate(pushProgress, [0, 1], [1, 0.89], clamp);
  const contentTranslateX =
    interpolate(textRevealProgress, [0, 1], [18, 0], clamp) -
    interpolate(pushProgress, [0, 1], [0, 8], clamp);
  const objectDriftX = Math.sin(frame / 56) * 1.8 * Math.max(0.35, lifeProgress);
  const objectDriftY = Math.cos(frame / 70) * 1.2 * Math.max(0.4, lifeProgress);
  const glowTrackX = objectDriftX;
  const glowTrackY = objectY + objectDriftY;
  const haloScale =
    0.985 +
    interpolate(shellMorphProgress, [0, 1], [0, 0.02], clamp) +
    Math.sin(frame / 28) * 0.005 * lifeProgress;
  const rearBloomWidth = shellWidth + interpolate(shellMorphProgress, [0, 1], [140, 220], clamp);
  const rearBloomHeight = shellHeight + interpolate(shellMorphProgress, [0, 1], [96, 136], clamp);
  const rearBloomRadius = shellRadius + interpolate(shellMorphProgress, [0, 1], [86, 132], clamp);
  const rearBloomScale =
    0.96 +
    interpolate(shellMorphProgress, [0, 1], [0, 0.05], clamp) +
    Math.sin(frame / 30) * 0.004 * lifeProgress;
  const rearBloomOpacity =
    entryFade *
    interpolate(frame, [0, 12, URL_INTRO_MORPH_END], [0.08, 0.1, 0.14], clamp) *
    interpolate(pushProgress, [0, 1], [1, 1.04], clamp);
  const nearHaloWidth = shellWidth + interpolate(shellMorphProgress, [0, 1], [26, 46], clamp);
  const nearHaloHeight = shellHeight + interpolate(shellMorphProgress, [0, 1], [14, 22], clamp);
  const nearHaloRadius = shellRadius + interpolate(shellMorphProgress, [0, 1], [10, 16], clamp);
  const nearHaloOpacity = entryFade * interpolate(
    frame,
    [0, URL_INTRO_MORPH_START, URL_INTRO_MORPH_END],
    [0.14, 0.18, 0.22],
    clamp,
  );
  const rearHaloWidth = shellWidth + interpolate(shellMorphProgress, [0, 1], [76, 126], clamp);
  const rearHaloHeight = shellHeight + interpolate(shellMorphProgress, [0, 1], [44, 64], clamp);
  const rearHaloRadius = shellRadius + interpolate(shellMorphProgress, [0, 1], [28, 42], clamp);
  const rearHaloOpacity = entryFade * interpolate(
    frame,
    [0, URL_INTRO_MORPH_START, URL_INTRO_MORPH_END],
    [0.08, 0.1, 0.13],
    clamp,
  );
  const sweepStart = URL_INTRO_MORPH_START + 4;
  const sweepEnd = URL_INTRO_MORPH_END - 2;
  const sweepProgress = interpolate(
    frame,
    [sweepStart, sweepEnd],
    [0, 1],
    {
      ...clamp,
      easing: Easing.bezier(0.22, 0.76, 0.34, 1),
    },
  );
  const sweepOffset = interpolate(sweepProgress, [0, 1], [-shellWidth * 0.42, shellWidth * 0.14], clamp);
  const sweepOpacity = interpolate(
    frame,
    [sweepStart, sweepStart + 4, sweepEnd - 3, sweepEnd],
    [0, 0.18, 0.08, 0],
    clamp,
  );

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
      }}
      >

      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1800px',
          perspectiveOrigin: '50% 46%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: rearBloomWidth,
            height: rearBloomHeight,
            borderRadius: rearBloomRadius,
            transform: `translateX(${glowTrackX}px) translateY(${glowTrackY}px) scale(${rearBloomScale})`,
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(131,56,236,0.18) 0%, rgba(131,56,236,0.10) 34%, rgba(76,29,149,0.05) 56%, rgba(131,56,236,0) 78%)',
            filter: 'blur(52px)',
            opacity: rearBloomOpacity,
            mixBlendMode: 'screen',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: rearHaloWidth,
            height: rearHaloHeight,
            borderRadius: rearHaloRadius,
            transform: `translateX(${glowTrackX}px) translateY(${glowTrackY}px) scale(${haloScale})`,
            background:
              'linear-gradient(90deg, rgba(131,56,236,0.07) 0%, rgba(131,56,236,0.10) 18%, rgba(131,56,236,0.14) 50%, rgba(131,56,236,0.10) 82%, rgba(131,56,236,0.07) 100%), radial-gradient(circle at 16% 50%, rgba(131,56,236,0.16) 0%, rgba(131,56,236,0.07) 44%, rgba(131,56,236,0) 78%), radial-gradient(circle at 84% 50%, rgba(131,56,236,0.14) 0%, rgba(131,56,236,0.06) 42%, rgba(131,56,236,0) 76%)',
            filter: 'blur(34px)',
            opacity: rearHaloOpacity,
            mixBlendMode: 'screen',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: nearHaloWidth,
            height: nearHaloHeight,
            borderRadius: nearHaloRadius,
            transform: `translateX(${glowTrackX}px) translateY(${glowTrackY}px) scale(${haloScale + 0.01})`,
            background:
              'linear-gradient(90deg, rgba(131,56,236,0.12) 0%, rgba(131,56,236,0.18) 20%, rgba(131,56,236,0.24) 50%, rgba(131,56,236,0.18) 80%, rgba(131,56,236,0.12) 100%), radial-gradient(circle at 18% 50%, rgba(131,56,236,0.28) 0%, rgba(131,56,236,0.12) 42%, rgba(131,56,236,0) 74%), radial-gradient(circle at 82% 50%, rgba(131,56,236,0.26) 0%, rgba(131,56,236,0.11) 40%, rgba(131,56,236,0) 72%)',
            filter: 'blur(18px)',
            opacity: nearHaloOpacity,
            mixBlendMode: 'screen',
          }}
        />
        <div
          style={{
            transform: [
              `translate3d(${objectDriftX}px, ${objectY + objectDriftY}px, 0)`,
              `rotateX(${objectRotateX}deg)`,
              `rotateY(${objectRotateY}deg)`,
              `rotateZ(${objectRotateZ}deg)`,
              `scale(${baseScale * pushScale * lifeBreathScale})`,
            ].join(' '),
            opacity: objectOpacity,
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: shellWidth,
              height: shellHeight,
              borderRadius: shellRadius,
            }}
          >
            <SearchBubble
              glowIntensity={glowIntensity}
              width={shellWidth}
              height={shellHeight}
              radius={shellRadius}
              iconOffsetX={iconOffsetX}
              iconScale={iconScale}
              contentOpacity={contentOpacity}
              contentTranslateX={contentTranslateX}
            >
              <TypewriterText
                text={URL_INTRO_TEXT}
                frame={frame}
                startFrame={URL_INTRO_TYPE_START}
                framesPerChar={URL_INTRO_FRAMES_PER_CHAR}
                cursorHideAfter={URL_INTRO_HOLD_DURATION}
                color={theme.colors.white}
                cursorColor={theme.colors.purpleSoft}
                fontFamily={orbitron}
                fontSize={24}
                fontWeight={700}
                letterSpacing="0.028em"
              />
            </SearchBubble>
            <div
              style={{
                position: 'absolute',
                inset: 1,
                borderRadius: Math.max(0, shellRadius - 1),
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -2,
                  bottom: -2,
                  width: Math.max(120, shellWidth * 0.34),
                  left: '50%',
                  borderRadius: 999,
                  background:
                    'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 34%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.04) 66%, rgba(255,255,255,0) 100%)',
                  opacity: sweepOpacity,
                  filter: 'blur(6px)',
                  transform: `translateX(${sweepOffset}px) skewX(-16deg)`,
                  mixBlendMode: 'screen',
                }}
              />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
