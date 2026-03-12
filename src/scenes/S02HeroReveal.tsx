import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { LogoMark } from '../components/LogoMark';
import { theme } from '../lib/theme';
import { orbitron, montserrat } from '../lib/fonts';
import { heroSpring, softSpring } from '../lib/springs';
import {
  HERO_REVEAL_BACKGROUND,
  buildHeroStagePreviewStyle,
} from '../lib/siteHeroTuning';
import { SitePreviewProvider } from '../imported-site/site/runtime/SitePreviewContext';
import CinematicBackground from '../imported-site/site/components/layout/CinematicBackground';
import PersistentHeroVideo from '../imported-site/site/components/PersistentHeroVideo';

const SCENE_FADE_IN_END = 16;
const LOGO_DELAY = 18;
const EYEBROW_DELAY = 26;
const HEADLINE_DELAY = 30;
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
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, SCENE_FADE_IN_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });
  const sceneOut = interpolate(frame, [FADE_OUT_START, SCENE_TOTAL], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sceneOpacity = Math.min(sceneIn, sceneOut);
  const backgroundFadeOut = interpolate(
    frame,
    [HERO_REVEAL_BACKGROUND.fadeStartFrame, SCENE_TOTAL],
    [1, HERO_REVEAL_BACKGROUND.fadeEndOpacity],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );

  const eyebrowSpring = spring({
    frame: Math.max(0, frame - EYEBROW_DELAY),
    fps,
    config: softSpring,
    durationInFrames: 30,
  });

  const headlineSpring = spring({
    frame: Math.max(0, frame - HEADLINE_DELAY),
    fps,
    config: heroSpring,
    durationInFrames: 40,
  });
  const headlineY = headlineSpring > 0.96 ? 0 : (1 - headlineSpring) * 70;

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
  const line1X = line1Spring > 0.96 ? 0 : (1 - line1Spring) * -90;

  const line2Spring = spring({
    frame: Math.max(0, frame - LINE2_DELAY),
    fps,
    config: heroSpring,
    durationInFrames: 35,
  });
  const line2X = line2Spring > 0.96 ? 0 : (1 - line2Spring) * 90;

  const sublineSpring = spring({
    frame: Math.max(0, frame - SUBLINE_DELAY),
    fps,
    config: softSpring,
    durationInFrames: 35,
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden', opacity: sceneOpacity, background: theme.colors.bg }}>
      <SitePreviewProvider pathname="/">
        <AbsoluteFill style={{
          ...heroBackgroundStyle,
          opacity: backgroundFadeOut,
          transform: 'scale(1.01)',
        }}>
          <CinematicBackground />
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
        <div style={{ marginBottom: 32 }}>
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
            opacity: eyebrowSpring,
            marginBottom: 18,
            textAlign: 'center',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
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
            transform: `translateY(${headlineY}px)`,
            opacity: headlineSpring > 0.96 ? 1 : headlineSpring,
            textShadow: '0 0 60px rgba(131,56,236,0.5), 0 0 120px rgba(131,56,236,0.22)',
          }}
        >
          Successors
        </div>

        <div
          style={{
            width: `${dividerSpring > 0.96 ? 220 : dividerSpring * 220}px`,
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
            opacity: line1Spring > 0.96 ? 1 : line1Spring,
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
            opacity: line2Spring > 0.96 ? 1 : line2Spring,
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
    </AbsoluteFill>
  );
};
