import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { theme } from '../lib/theme';
import { orbitron, montserrat } from '../lib/fonts';
import { glideSpring, heroSpring, softSpring } from '../lib/springs';
import { SiteAtmosphere } from '../components/SiteAtmosphere';
import { ENGINEERING_INTRO_MODE } from '../lib/engineeringIntroConfig';
import Card from '../imported-site/site/components/ui/Card';
import ImageWithFallback from '../imported-site/site/components/ImageWithFallback';
import {
  TEAM_MEDIA_BACKGROUND_CLASS,
  TEAM_MEDIA_FADE_STYLE,
  TEAM_MEDIA_OVERLAY_SIZE_CLASS,
} from '../imported-site/site/components/media/teamMediaStyles';
import { siteContent } from '../imported-site/site/lib/content';
import type { GalleryItem } from '../imported-site/site/types/content';

const FADE_IN_END = 10;
const CFD_ANALYZE_DELAY = 20;
const PILL_DELAY = 40;
const CFD_FADE_START = 80;
const CFD_FADE_END = 100;
const CARDS_PHASE_START = 82;
const CARD1_DELAY = 84;
const CARD2_DELAY = 100;
const FADE_OUT_START = 165;
const SCENE_TOTAL = 180;

const BETA_CARD_PHASE_START = 16;
const BETA_CARD_PHASE_DURATION = 64;
const BETA_CARD_MORPH_DURATION = 16;
const CARD_SWAP_STAGGER = 8;
const CARD_SWAP_SETTLE_DURATION = 30;
const CHAIN_SYNC_APPEAR_DURATION = 12;
const BETA_CARD_PHASE_TWO_START = BETA_CARD_PHASE_START + BETA_CARD_PHASE_DURATION;
const CHAIN_DELAY = BETA_CARD_PHASE_TWO_START + BETA_CARD_PHASE_DURATION;
const CHAIN_SYNC_FULLY_VISIBLE =
  BETA_CARD_PHASE_TWO_START + CARD_SWAP_STAGGER + CARD_SWAP_SETTLE_DURATION;
const CHAIN_SYNC_START = CHAIN_SYNC_FULLY_VISIBLE - CHAIN_SYNC_APPEAR_DURATION;
const PRECISION_COUNT_START = PILL_DELAY + 21;
const PRECISION_COUNT_END = PILL_DELAY + 43;

const getEngineeringGalleryItem = (id: string): GalleryItem => {
  const item = siteContent.engineeringPage.gallery.find((entry) => entry.id === id);

  if (!item) {
    throw new Error(`Engineering gallery item not found: ${id}`);
  }

  return item;
};

const BETA_RENDER_CARD = getEngineeringGalleryItem('concept-beta');
const BETA_CFD_CARD = getEngineeringGalleryItem('beta-simulation');
const GAMMA_RENDER_CARD = getEngineeringGalleryItem('concept-gamma');
const GAMMA_CFD_CARD = getEngineeringGalleryItem('gamma-simulation');

const formatPrecisionTarget = (value: number) => {
  if (value >= 9.95) {
    return '10mm';
  }

  if (value >= 1) {
    return `${value.toFixed(1).replace(/\.0$/, '')}mm`;
  }

  return `${value.toFixed(1)}mm`;
};

export const S03Engineering: React.FC = () => {
  if (ENGINEERING_INTRO_MODE === 'cfd-background') {
    return <EngineeringCfdBackgroundIntro />;
  }

  return <EngineeringBetaCardsIntro />;
};

const EngineeringCfdBackgroundIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, FADE_IN_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });
  const fadeToBlack = interpolate(frame, [FADE_OUT_START, SCENE_TOTAL], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cfdEntry = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: heroSpring,
    durationInFrames: 30,
  });
  const cfdScale = cfdEntry > 0.96 ? 1.02 : 1.09 - cfdEntry * 0.07;
  const cfdDriftX = interpolate(frame, [10, SCENE_TOTAL], [0, -16], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cfdOpacity = interpolate(frame, [CFD_FADE_START, CFD_FADE_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cardsIn = interpolate(frame, [CARDS_PHASE_START, CARDS_PHASE_START + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });

  const card1Spring = spring({
    frame: Math.max(0, frame - CARD1_DELAY),
    fps,
    config: glideSpring,
    durationInFrames: 40,
  });
  const card1X = (1 - card1Spring) * -220;
  const card1Y = (1 - card1Spring) * 26;
  const card1Scale = 0.95 + card1Spring * 0.05;

  const card2Spring = spring({
    frame: Math.max(0, frame - CARD2_DELAY),
    fps,
    config: glideSpring,
    durationInFrames: 40,
  });
  const card2X = (1 - card2Spring) * 220;
  const card2Y = (1 - card2Spring) * 24;
  const card2Scale = 0.95 + card2Spring * 0.05;

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden', opacity: sceneIn }}>
      <AbsoluteFill style={{ opacity: cfdOpacity }}>
        <AbsoluteFill
          style={{
            transform: `scale(${cfdScale}) translateX(${cfdDriftX}px)`,
            transformOrigin: 'center center',
          }}
        >
          <Img
            src={staticFile('assets/concept-gamma-cfd.jpeg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>

        <AbsoluteFill
          style={{
            transform: `scale(${cfdScale + 0.018}) translateX(${cfdDriftX * 0.7}px)`,
            transformOrigin: 'center center',
            filter: 'blur(16px)',
            opacity: 0.18,
          }}
        >
          <Img
            src={staticFile('assets/concept-gamma-cfd.jpeg')}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(5,5,5,0.15) 0%, rgba(5,5,5,0.10) 42%, rgba(5,5,5,0.32) 100%)',
          }}
        />
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 84% 60% at 50% 46%, rgba(5,5,5,0.01) 0%, rgba(5,5,5,0.13) 66%, rgba(5,5,5,0.29) 100%)',
          }}
        />

        <AnalyzeOverlay />
        <PrecisionTargetPill />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: cardsIn }}>
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 80% 55% at 50% 50%, rgba(58,12,163,0.20) 0%, transparent 70%)',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: 24,
            top: '50%',
            width: 488,
            transform: `translateY(calc(-54% + ${card1Y}px)) translateX(${card1X}px) scale(${card1Scale})`,
            opacity: card1Spring,
          }}
        >
          <LegacyEngineeringCard
            imageSrc={staticFile('assets/concept-alpha-render.png')}
            stageLabel="01 / Design"
            title="Design"
            subtitle="Fusion 360 CAD â€” precision geometry built for real-world manufacturing."
            tiltDeg={3}
            imageHeight={320}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            right: 24,
            top: '50%',
            width: 488,
            transform: `translateY(calc(-46% + ${card2Y}px)) translateX(${card2X}px) scale(${card2Scale})`,
            opacity: card2Spring,
          }}
        >
          <LegacyEngineeringCard
            imageSrc={staticFile('assets/concept-beta-cfd.jpeg')}
            stageLabel="02 / Validate"
            title="Validate"
            subtitle="ANSYS CFD simulation â€” aerodynamic precision at 0.1mm tolerance."
            tiltDeg={-3}
            imageHeight={320}
          />
        </div>

        <EngineeringChainLabel />
      </AbsoluteFill>

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

const EngineeringBetaCardsIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sceneIn = interpolate(frame, [0, FADE_IN_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });
  const fadeToBlack = interpolate(frame, [FADE_OUT_START, SCENE_TOTAL], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 0.61, 0.36, 1),
  });

  const phaseOneBlendOut = interpolate(
    frame,
    [BETA_CARD_PHASE_TWO_START, BETA_CARD_PHASE_TWO_START + BETA_CARD_MORPH_DURATION],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const phaseTwoBlendIn = interpolate(
    frame,
    [BETA_CARD_PHASE_TWO_START, BETA_CARD_PHASE_TWO_START + BETA_CARD_MORPH_DURATION],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.cubic),
    },
  );

  const betaLeftSpring = spring({
    frame: Math.max(0, frame - BETA_CARD_PHASE_START),
    fps,
    config: glideSpring,
    durationInFrames: 30,
  });
  const betaRightSpring = spring({
    frame: Math.max(0, frame - (BETA_CARD_PHASE_START + CARD_SWAP_STAGGER)),
    fps,
    config: glideSpring,
    durationInFrames: CARD_SWAP_SETTLE_DURATION,
  });
  const gammaLeftSpring = spring({
    frame: Math.max(0, frame - BETA_CARD_PHASE_TWO_START),
    fps,
    config: glideSpring,
    durationInFrames: CARD_SWAP_SETTLE_DURATION,
  });
  const gammaRightSpring = spring({
    frame: Math.max(0, frame - (BETA_CARD_PHASE_TWO_START + CARD_SWAP_STAGGER)),
    fps,
    config: glideSpring,
    durationInFrames: CARD_SWAP_SETTLE_DURATION,
  });

  const betaLeftX = (1 - betaLeftSpring) * -180 - (1 - phaseOneBlendOut) * 24;
  const betaRightX = (1 - betaRightSpring) * 180 + (1 - phaseOneBlendOut) * 24;
  const gammaLeftX = (1 - gammaLeftSpring) * -90;
  const gammaRightX = (1 - gammaRightSpring) * 90;

  const betaLeftY = (1 - betaLeftSpring) * 22;
  const betaRightY = (1 - betaRightSpring) * 20;
  const gammaLeftY = (1 - gammaLeftSpring) * 16;
  const gammaRightY = (1 - gammaRightSpring) * 14;

  const betaLeftOpacity = betaLeftSpring * phaseOneBlendOut;
  const betaRightOpacity = betaRightSpring * phaseOneBlendOut;
  const gammaLeftOpacity = gammaLeftSpring * phaseTwoBlendIn;
  const gammaRightOpacity = gammaRightSpring * phaseTwoBlendIn;

  const betaLeftScale = 0.965 + betaLeftSpring * 0.035 + (1 - phaseOneBlendOut) * 0.02;
  const betaRightScale = 0.965 + betaRightSpring * 0.035 + (1 - phaseOneBlendOut) * 0.02;
  const gammaLeftScale = 0.98 + gammaLeftSpring * 0.02;
  const gammaRightScale = 0.98 + gammaRightSpring * 0.02;

  const betaPhaseBlur = interpolate(phaseOneBlendOut, [0, 1], [8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const gammaPhaseBlur = interpolate(phaseTwoBlendIn, [0, 1], [8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden', opacity: sceneIn }}>
      <SiteAtmosphere />

      <div
        style={{
          position: 'absolute',
          left: 24,
          top: '50%',
          width: 488,
          transform: `translateY(calc(-54% + ${betaLeftY}px)) translateX(${betaLeftX}px) scale(${betaLeftScale})`,
          opacity: betaLeftOpacity,
          filter: `blur(${betaPhaseBlur}px)`,
        }}
      >
        <EngineeringGalleryCard item={BETA_RENDER_CARD} tiltDeg={3} />
      </div>

      <div
        style={{
          position: 'absolute',
          right: 24,
          top: '50%',
          width: 488,
          transform: `translateY(calc(-46% + ${betaRightY}px)) translateX(${betaRightX}px) scale(${betaRightScale})`,
          opacity: betaRightOpacity,
          filter: `blur(${betaPhaseBlur}px)`,
        }}
      >
        <EngineeringGalleryCard item={BETA_CFD_CARD} tiltDeg={-3} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 24,
          top: '50%',
          width: 488,
          transform: `translateY(calc(-54% + ${gammaLeftY}px)) translateX(${gammaLeftX}px) scale(${gammaLeftScale})`,
          opacity: gammaLeftOpacity,
          filter: `blur(${gammaPhaseBlur}px)`,
        }}
      >
        <EngineeringGalleryCard item={GAMMA_RENDER_CARD} tiltDeg={3} />
      </div>

      <div
        style={{
          position: 'absolute',
          right: 24,
          top: '50%',
          width: 488,
          transform: `translateY(calc(-46% + ${gammaRightY}px)) translateX(${gammaRightX}px) scale(${gammaRightScale})`,
          opacity: gammaRightOpacity,
          filter: `blur(${gammaPhaseBlur}px)`,
        }}
      >
        <EngineeringGalleryCard item={GAMMA_CFD_CARD} tiltDeg={-3} />
      </div>

      <AnalyzeOverlay />
      <PrecisionTargetPill />
      <EngineeringChainLabel
        startFrame={CHAIN_SYNC_START}
        fullyVisibleFrame={CHAIN_SYNC_FULLY_VISIBLE}
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

const AnalyzeOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const analyzeSpring = spring({
    frame: Math.max(0, frame - CFD_ANALYZE_DELAY),
    fps,
    config: heroSpring,
    durationInFrames: 30,
  });
  const analyzeY = analyzeSpring > 0.96 ? 0 : (1 - analyzeSpring) * 40;
  const cfdSubSpring = spring({
    frame: Math.max(0, frame - (CFD_ANALYZE_DELAY + 10)),
    fps,
    config: softSpring,
    durationInFrames: 25,
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        bottom: 240,
        transform: `translateY(${analyzeY}px)`,
        opacity: analyzeSpring > 0.96 ? 1 : analyzeSpring,
      }}
    >
      <div
        style={{
          fontFamily: orbitron,
          fontSize: 72,
          fontWeight: 900,
          color: theme.colors.gold,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          lineHeight: 1,
          textShadow: '0 0 32px rgba(229,184,11,0.65), 0 0 70px rgba(229,184,11,0.22)',
        }}
      >
        Analyze.
      </div>
      <div
        style={{
          fontFamily: montserrat,
          fontSize: 26,
          fontWeight: 600,
          color: theme.colors.textDim,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginTop: 14,
          marginLeft: 4,
          opacity: cfdSubSpring,
        }}
      >
        ANSYS CFD Simulation
      </div>
    </div>
  );
};

const PrecisionTargetPill: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pillSpring = spring({
    frame: Math.max(0, frame - PILL_DELAY),
    fps,
    config: glideSpring,
    durationInFrames: 22,
  });
  const pillX = (1 - pillSpring) * 180;
  const precisionCountProgress = interpolate(
    frame,
    [PRECISION_COUNT_START, PRECISION_COUNT_END],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.18, 0.92, 0.28, 1),
    },
  );
  const precisionValue = 10 - 9.9 * precisionCountProgress;

  return (
    <div
      style={{
        position: 'absolute',
        right: 60,
        bottom: 240,
        transform: `translateX(${pillX}px)`,
        opacity: pillSpring,
      }}
    >
      <div
        style={{
          background: 'rgba(229,184,11,0.09)',
          border: '1px solid rgba(229,184,11,0.38)',
          borderRadius: 12,
          padding: '22px 32px',
        }}
      >
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 14,
            fontWeight: 700,
            color: theme.colors.gold,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
          }}
        >
          Precision Target
        </div>
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 56,
            fontWeight: 900,
            color: theme.colors.white,
            letterSpacing: '-0.02em',
            marginTop: 8,
            lineHeight: 1,
            textShadow: '0 0 30px rgba(255,255,255,0.20)',
          }}
        >
          {formatPrecisionTarget(precisionValue)}
        </div>
      </div>
    </div>
  );
};

const EngineeringChainLabel: React.FC<{
  startFrame?: number;
  fullyVisibleFrame?: number;
}> = ({
  startFrame = CHAIN_DELAY,
  fullyVisibleFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chainSpring = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: softSpring,
    durationInFrames: 25,
  });
  const syncProgress =
    fullyVisibleFrame === undefined
      ? null
      : interpolate(frame, [startFrame, fullyVisibleFrame], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.22, 0.61, 0.36, 1),
        });
  const opacity =
    syncProgress === null ? (chainSpring > 0.96 ? 1 : chainSpring) : syncProgress;
  const translateY =
    syncProgress === null
      ? chainSpring > 0.96
        ? 0
        : (1 - chainSpring) * 18
      : (1 - syncProgress) * 18;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 640,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          fontFamily: orbitron,
          fontSize: 28,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
        }}
      >
        {'CAD \u00b7 CFD \u00b7 CNC'}
      </div>
    </div>
  );
};

interface LegacyEngineeringCardProps {
  imageSrc: string;
  stageLabel: string;
  title: string;
  subtitle: string;
  tiltDeg: number;
  imageHeight: number;
}

const LegacyEngineeringCard: React.FC<LegacyEngineeringCardProps> = ({
  imageSrc,
  stageLabel,
  title,
  subtitle,
  tiltDeg,
  imageHeight,
}) => (
  <div
    style={{
      transform: `perspective(1200px) rotateY(${tiltDeg}deg)`,
      borderRadius: 24,
      overflow: 'hidden',
      border: '1px solid rgba(240,238,245,0.12)',
      background: 'linear-gradient(165deg, rgba(10,10,14,0.95) 0%, rgba(8,8,12,0.90) 56%, rgba(58,12,163,0.28) 100%)',
      boxShadow: '0 34px 92px rgba(0,0,0,0.68), 0 0 120px rgba(131,56,236,0.24), 0 0 0 1px rgba(255,255,255,0.04) inset',
      position: 'relative',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        width: 14,
        height: 14,
        borderTop: '1.5px solid rgba(229,184,11,0.30)',
        borderLeft: '1.5px solid rgba(229,184,11,0.30)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 14,
        height: 14,
        borderBottom: '1.5px solid rgba(229,184,11,0.30)',
        borderRight: '1.5px solid rgba(229,184,11,0.30)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, transparent 34%)',
      }}
    />

    <div style={{ height: imageHeight, overflow: 'hidden', position: 'relative' }}>
      <Img
        src={imageSrc}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 45%, rgba(8,8,12,0.90) 100%)',
        }}
      />
    </div>

    <div style={{ padding: '20px 24px 28px' }}>
      <div
        style={{
          display: 'inline-block',
          fontFamily: orbitron,
          fontSize: 10,
          fontWeight: 700,
          color: theme.colors.gold,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          marginBottom: 10,
          padding: '4px 12px',
          background: 'rgba(229,184,11,0.08)',
          border: '1px solid rgba(229,184,11,0.18)',
          borderRadius: 999,
        }}
      >
        {stageLabel}
      </div>
      <div
        style={{
          fontFamily: orbitron,
          fontSize: 32,
          fontWeight: 900,
          color: theme.colors.white,
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: montserrat,
          fontSize: 14,
          fontWeight: 500,
          color: theme.colors.muted,
          letterSpacing: '0.04em',
          marginTop: 10,
          lineHeight: 1.55,
        }}
      >
        {subtitle}
      </div>
    </div>
  </div>
);

const EngineeringGalleryCard: React.FC<{
  item: GalleryItem;
  tiltDeg: number;
}> = ({ item, tiltDeg }) => {
  const usesEngineeringMedia = Boolean(item.mediaType && item.mediaSrc);
  const isRenderMedia = usesEngineeringMedia && item.mediaType === 'render';
  const isCfdMedia = usesEngineeringMedia && item.mediaType === 'cfd';
  const isBackgroundMedia = usesEngineeringMedia && item.mediaType === 'background';

  return (
    <div style={{ transform: `perspective(1200px) rotateY(${tiltDeg}deg)` }}>
      <Card className="overflow-hidden" style={{ boxShadow: '0 34px 92px rgba(0,0,0,0.68), 0 0 120px rgba(131,56,236,0.24)' }}>
        <div
          className="relative w-full overflow-hidden"
          data-engineering-media-wrapper={usesEngineeringMedia ? '1' : undefined}
          style={{ height: 300 }}
        >
          {isRenderMedia ? (
            <>
              <div
                aria-hidden="true"
                className={TEAM_MEDIA_BACKGROUND_CLASS}
                style={TEAM_MEDIA_FADE_STYLE}
              />
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <ImageWithFallback
                  src={item.mediaSrc ?? item.image}
                  alt={item.mediaAlt ?? item.title}
                  width={900}
                  height={620}
                  className={TEAM_MEDIA_OVERLAY_SIZE_CLASS}
                />
              </div>
            </>
          ) : isCfdMedia || isBackgroundMedia ? (
            <div
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden"
              style={TEAM_MEDIA_FADE_STYLE}
            >
              <ImageWithFallback
                src={item.mediaSrc ?? item.image}
                alt={item.mediaAlt ?? item.title}
                width={900}
                height={620}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <>
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                width={900}
                height={620}
                className="h-full w-full object-cover"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(58, 12, 163, 0) 20%, rgba(10, 10, 14, 0.52) 66%, rgba(5, 5, 5, 0.82) 100%)',
                }}
              />
            </>
          )}
        </div>
        <div className="card-pad-compact" style={{ padding: '20px 24px 28px' }}>
          <p className="tier-chip mb-3 w-fit">{item.category}</p>
          <h3 className="font-heading text-lg">{item.title}</h3>
          <p className="mt-2 text-sm muted-copy">{item.caption}</p>
        </div>
      </Card>
    </div>
  );
};
