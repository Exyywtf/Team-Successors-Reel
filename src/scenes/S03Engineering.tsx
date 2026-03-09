import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { theme } from '../lib/theme';
import { orbitron, montserrat } from '../lib/fonts';
import { heroSpring, glideSpring, softSpring } from '../lib/springs';

// Scene duration: 180 frames (6.0s), global start: 242
//
// Timeline:
//   f00–10   — scene fades in (cut from S02 fade-out)
//   f10      — CFD image slams in full-bleed (scale 1.10→1.00)
//   f20–48   — "Analyze." gold label + "ANSYS CFD" spring in, bottom-left
//   f40–70   — "0.1mm" data pill slides from right
//   f80–110  — CFD fades; Card 1 (Design) enters from left with 3D tilt
//   f95–125  — Card 2 (Validate) enters from right
//   f140–165 — "CAD → CFD → CNC" label fades in center
//   f165–180 — fade to black

const FADE_IN_END = 10;
const CFD_ANALYZE_DELAY = 20;
const PILL_DELAY = 40;
const CFD_FADE_START = 80;
const CFD_FADE_END = 100;
const CARDS_PHASE_START = 82;
const CARD1_DELAY = 84;
const CARD2_DELAY = 100;
const CHAIN_DELAY = 140;
const FADE_OUT_START = 165;
const SCENE_TOTAL = 180;

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
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Scene envelope ─────────────────────────────────────────────────────────
  const sceneIn = interpolate(frame, [0, FADE_IN_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });
  const fadeToBlack = interpolate(frame, [FADE_OUT_START, SCENE_TOTAL], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── CFD image slam ──────────────────────────────────────────────────────────
  const cfdEntry = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: heroSpring,
    durationInFrames: 30,
  });
  const cfdScale = cfdEntry > 0.96 ? 1.02 : 1.09 - cfdEntry * 0.07;
  // Slow ambient drift across the scene
  const cfdDriftX = interpolate(frame, [10, SCENE_TOTAL], [0, -16], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // CFD phase opacity — fades out as cards arrive
  const cfdOpacity = interpolate(frame, [CFD_FADE_START, CFD_FADE_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── "Analyze." label — bottom-left ────────────────────────────────────────
  const analyzeSpring = spring({
    frame: Math.max(0, frame - CFD_ANALYZE_DELAY),
    fps,
    config: heroSpring,
    durationInFrames: 30,
  });
  const analyzeY = analyzeSpring > 0.96 ? 0 : (1 - analyzeSpring) * 40;

  // ── "ANSYS CFD Simulation" sub-label ──────────────────────────────────────
  const cfdSubSpring = spring({
    frame: Math.max(0, frame - (CFD_ANALYZE_DELAY + 10)),
    fps,
    config: softSpring,
    durationInFrames: 25,
  });

  // ── Data pill ──────────────────────────────────────────────────────────────
  const pillSpring = spring({
    frame: Math.max(0, frame - PILL_DELAY),
    fps,
    config: glideSpring,
    durationInFrames: 22,
  });
  const pillX = (1 - pillSpring) * 180;
  const precisionCountProgress = interpolate(
    frame,
    [PILL_DELAY + 18, PILL_DELAY + 38],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.18, 0.94, 0.32, 1),
    }
  );
  const precisionValue = 10 - 9.9 * precisionCountProgress;

  // ── Cards phase opacity ────────────────────────────────────────────────────
  const cardsIn = interpolate(frame, [CARDS_PHASE_START, CARDS_PHASE_START + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });

  // ── Card 1 (Design) — enters from left ────────────────────────────────────
  const card1Spring = spring({
    frame: Math.max(0, frame - CARD1_DELAY),
    fps,
    config: glideSpring,
    durationInFrames: 40,
  });
  const card1X = (1 - card1Spring) * -220;
  const card1Y = (1 - card1Spring) * 26;
  const card1Scale = 0.95 + card1Spring * 0.05;

  // ── Card 2 (Validate) — enters from right ─────────────────────────────────
  const card2Spring = spring({
    frame: Math.max(0, frame - CARD2_DELAY),
    fps,
    config: glideSpring,
    durationInFrames: 40,
  });
  const card2X = (1 - card2Spring) * 220;
  const card2Y = (1 - card2Spring) * 24;
  const card2Scale = 0.95 + card2Spring * 0.05;

  // ── "CAD → CFD → CNC" label ───────────────────────────────────────────────
  const chainSpring = spring({
    frame: Math.max(0, frame - CHAIN_DELAY),
    fps,
    config: softSpring,
    durationInFrames: 25,
  });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden', opacity: sceneIn }}>

      {/* ── CFD Phase ─────────────────────────────────────────────────────── */}
      <AbsoluteFill style={{ opacity: cfdOpacity }}>

        {/* CFD hero image — full-bleed, slow drift */}
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

        {/* Bottom gradient — pulls focus to labels without hiding CFD detail */}
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

        {/* ── "Analyze." + ANSYS label ── */}
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
              textShadow: `0 0 32px rgba(229,184,11,0.65), 0 0 70px rgba(229,184,11,0.22)`,
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

        {/* ── "0.1mm" data pill — bottom-right ── */}
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
              border: `1px solid rgba(229,184,11,0.38)`,
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
                textShadow: `0 0 30px rgba(255,255,255,0.20)`,
              }}
            >
              {formatPrecisionTarget(precisionValue)}
            </div>
          </div>
        </div>

      </AbsoluteFill>

      {/* ── Cards Phase ───────────────────────────────────────────────────── */}
      <AbsoluteFill style={{ opacity: cardsIn }}>

        {/* Subtle atmosphere glow for cards phase */}
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse 80% 55% at 50% 50%, rgba(58,12,163,0.20) 0%, transparent 70%)',
          }}
        />

        {/* ── Card 1: Design (alpha render) ── */}
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
          <EngineeringCard
            imageSrc={staticFile('assets/concept-alpha-render.png')}
            stageLabel="01 / Design"
            title="Design"
            subtitle="Fusion 360 CAD — precision geometry built for real-world manufacturing."
            tiltDeg={3}
            imageHeight={320}
          />
        </div>

        {/* ── Card 2: Validate (CFD) ── */}
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
          <EngineeringCard
            imageSrc={staticFile('assets/concept-beta-cfd.jpeg')}
            stageLabel="02 / Validate"
            title="Validate"
            subtitle="ANSYS CFD simulation — aerodynamic precision at 0.1mm tolerance."
            tiltDeg={-3}
            imageHeight={320}
          />
        </div>

        {/* ── "CAD · CFD · CNC" label — sits just below the cards ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 640,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: chainSpring > 0.96 ? 1 : chainSpring,
            transform: `translateY(${chainSpring > 0.96 ? 0 : (1 - chainSpring) * 18}px)`,
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
            CAD &nbsp;·&nbsp; CFD &nbsp;·&nbsp; CNC
          </div>
        </div>

      </AbsoluteFill>

      {/* Fade to black */}
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

// ── Internal card component — real website .card-pro styling ──────────────

interface EngineeringCardProps {
  imageSrc: string;
  stageLabel: string;
  title: string;
  subtitle: string;
  tiltDeg: number;
  imageHeight: number;
}

const EngineeringCard: React.FC<EngineeringCardProps> = ({
  imageSrc,
  stageLabel,
  title,
  subtitle,
  tiltDeg,
  imageHeight,
}) => (
  <div
    style={{
      // Real site: perspective(900px) rotateY on hover — keep subtle for reel
      transform: `perspective(1200px) rotateY(${tiltDeg}deg)`,
      // Real site .card-pro: border-radius: 24px
      borderRadius: 24,
      overflow: 'hidden',
      // Real site: 1px solid rgba(240,238,245,0.08)
      border: '1px solid rgba(240,238,245,0.12)',
      // Real site: --obsidian-card-fill gradient
      background: 'linear-gradient(165deg, rgba(10,10,14,0.95) 0%, rgba(8,8,12,0.90) 56%, rgba(58,12,163,0.28) 100%)',
      // Real site: 0 10px 28px rgba(0,0,0,0.4), 0 0 80px rgba(131,56,236,0.15)
      boxShadow: '0 34px 92px rgba(0,0,0,0.68), 0 0 120px rgba(131,56,236,0.24), 0 0 0 1px rgba(255,255,255,0.04) inset',
      position: 'relative',
    }}
  >
    {/* Tech-bracket corners — real site .tech-brackets decoration */}
    <div style={{
      position: 'absolute', top: 10, left: 10, width: 14, height: 14,
      borderTop: '1.5px solid rgba(229,184,11,0.30)',
      borderLeft: '1.5px solid rgba(229,184,11,0.30)',
    }} />
    <div style={{
      position: 'absolute', bottom: 10, right: 10, width: 14, height: 14,
      borderBottom: '1.5px solid rgba(229,184,11,0.30)',
      borderRight: '1.5px solid rgba(229,184,11,0.30)',
    }} />
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.10) 0%, transparent 34%)',
      }}
    />

    {/* Image section */}
    <div style={{ height: imageHeight, overflow: 'hidden', position: 'relative' }}>
      <Img
        src={imageSrc}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {/* Real site cards use gradient overlay from transparent → card bg */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 45%, rgba(8,8,12,0.90) 100%)',
        }}
      />
    </div>

    {/* Card content — real site card-pad-default: 24px */}
    <div style={{ padding: '20px 24px 28px' }}>
      {/* Stage badge — real site .type-label with pill treatment */}
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
      {/* Title — real site .type-title */}
      <div
        style={{
          fontFamily: orbitron,
          fontSize: 32,
          fontWeight: 900,
          color: theme.colors.white,
          letterSpacing: '-0.01em',
          lineHeight: 1.0,
        }}
      >
        {title}
      </div>
      {/* Description — real site .copy-sm muted */}
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
