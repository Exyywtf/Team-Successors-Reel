import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {LogoMark} from '../components/LogoMark';
import {SiteAtmosphere} from '../components/SiteAtmosphere';
import {theme} from '../lib/theme';
import {orbitron, montserrat} from '../lib/fonts';
import {heroSpring, softSpring} from '../lib/springs';
import {
  HERO_REVEAL_BACKGROUND,
  buildHeroStagePreviewStyle,
} from '../lib/siteHeroTuning';
import {SitePreviewProvider} from '../imported-site/site/runtime/SitePreviewContext';
import PersistentHeroVideo from '../imported-site/site/components/PersistentHeroVideo';

const SCENE_FADE_IN_END = 16;
const LOGO_DELAY = 18;
const EYEBROW_DELAY = 26;
const EYEBROW_REVEAL_END = EYEBROW_DELAY + 18;
const HEADLINE_DELAY = 30;
const HEADLINE_REVEAL_END = HEADLINE_DELAY + 20;
const LINE1_DELAY = 44;
const LINE2_DELAY = 58;
const SUBLINE_DELAY = 84;
const FADE_OUT_START = 142;
const SCENE_TOTAL = 156;

const heroBackgroundStyle: React.CSSProperties = {
  zIndex: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  ...buildHeroStagePreviewStyle(HERO_REVEAL_BACKGROUND.heroHeightScale),
};

export const S02HeroReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const settleEase = Easing.bezier(0.22, 1, 0.36, 1);

  const sceneIn = interpolate(frame, [0, SCENE_FADE_IN_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });
  const sceneOut = interpolate(frame, [FADE_OUT_START, SCENE_TOTAL], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });
  const fadeToBlack = 1 - sceneOut;
  const backgroundFadeOut = interpolate(
    frame,
    [HERO_REVEAL_BACKGROUND.fadeStartFrame, SCENE_TOTAL],
    [1, HERO_REVEAL_BACKGROUND.fadeEndOpacity],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  const eyebrowRevealProgress = interpolate(
    frame,
    [EYEBROW_DELAY, EYEBROW_REVEAL_END],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: settleEase,
    },
  );
  const eyebrowSettled = frame >= EYEBROW_REVEAL_END;

  const headlineSpring = spring({
    frame: Math.max(0, frame - HEADLINE_DELAY),
    fps,
    config: {
      ...heroSpring,
      overshootClamping: true,
    },
    durationInFrames: HEADLINE_REVEAL_END - HEADLINE_DELAY,
  });
  const headlineRawY = Math.max(0, (1 - headlineSpring) * 70);
  const headlineSettled = headlineRawY <= 0.35;
  const headlineY = headlineSettled ? 0 : headlineRawY;
  const headlineOpacity = headlineSettled ? 1 : Math.min(headlineSpring, 1);

  const dividerSpring = spring({
    frame: Math.max(0, frame - HEADLINE_DELAY - 8),
    fps,
    config: heroSpring,
    durationInFrames: 30,
  });

  const line1Spring = spring({
    frame: Math.max(0, frame - LINE1_DELAY),
    fps,
    config: heroSpring,
    durationInFrames: 35,
  });
  const line1X = (1 - line1Spring) * -90;

  const line2Spring = spring({
    frame: Math.max(0, frame - LINE2_DELAY),
    fps,
    config: heroSpring,
    durationInFrames: 35,
  });
  const line2X = (1 - line2Spring) * 90;

  const sublineSpring = spring({
    frame: Math.max(0, frame - SUBLINE_DELAY),
    fps,
    config: softSpring,
    durationInFrames: 35,
  });

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: theme.colors.bg}}>
      <SiteAtmosphere />

      <SitePreviewProvider pathname="/">
        <AbsoluteFill
          style={{
            ...heroBackgroundStyle,
            opacity: backgroundFadeOut,
            transform: 'scale(1.01)',
          }}
        >
          <PersistentHeroVideo />
        </AbsoluteFill>
      </SitePreviewProvider>

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 64px',
          zIndex: 2,
        }}
      >
        <div style={{marginBottom: 32}}>
          <LogoMark size={120} delay={LOGO_DELAY} />
        </div>

        <div
          style={{
            fontFamily: orbitron,
            fontSize: 22,
            fontWeight: 700,
            color: theme.colors.gold,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            opacity: eyebrowSettled ? 1 : eyebrowRevealProgress,
            marginBottom: 18,
            textAlign: 'center',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            transform: 'none',
          }}
        >
          F1 in Schools · UAE
        </div>

        <div
          style={{
            fontFamily: orbitron,
            fontSize: 112,
            fontWeight: 900,
            color: theme.colors.white,
            letterSpacing: '-0.02em',
            lineHeight: 0.9,
            textAlign: 'center',
            transform: headlineSettled ? 'none' : `translate3d(0, ${headlineY}px, 0)`,
            opacity: headlineOpacity,
            textShadow:
              '0 0 60px rgba(131,56,236,0.5), 0 0 120px rgba(131,56,236,0.22)',
          }}
        >
          Successors
        </div>

        <div
          style={{
            width: `${Math.min(dividerSpring, 1) * 220}px`,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${theme.colors.gold}, transparent)`,
            margin: '24px auto',
            opacity: dividerSpring,
          }}
        />

        <div
          style={{
            fontFamily: orbitron,
            fontSize: 36,
            fontWeight: 700,
            color: theme.colors.white,
            letterSpacing: '0.03em',
            textAlign: 'center',
            transform: `translateX(${line1X}px)`,
            opacity: Math.min(line1Spring, 1),
            lineHeight: 1.2,
            textShadow: '0 4px 24px rgba(0,0,0,0.42)',
          }}
        >
          Inheriting the Legacy.
        </div>

        <div
          style={{
            fontFamily: orbitron,
            fontSize: 36,
            fontWeight: 700,
            color: theme.colors.gold,
            letterSpacing: '0.03em',
            textAlign: 'center',
            transform: `translateX(${line2X}px)`,
            opacity: Math.min(line2Spring, 1),
            marginTop: 8,
            lineHeight: 1.2,
            textShadow: '0 4px 24px rgba(0,0,0,0.42)',
          }}
        >
          Defining the Future.
        </div>

        <div
          style={{
            fontFamily: montserrat,
            fontSize: 26,
            fontWeight: 400,
            color: theme.colors.textDim,
            letterSpacing: '0.03em',
            textAlign: 'center',
            marginTop: 36,
            opacity: sublineSpring * 0.85,
            lineHeight: 1.55,
            maxWidth: 780,
            textShadow: '0 4px 28px rgba(0,0,0,0.46)',
          }}
        >
          An F1 in Schools team. Precision engineering.
          {'\n'}Sponsor-ready outcomes.
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: theme.colors.bg,
          opacity: 1 - sceneIn,
          pointerEvents: 'none',
        }}
      />

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
