import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { theme } from '../lib/theme';
import { orbitron, montserrat } from '../lib/fonts';
import { heroSpring, cardSpring, softSpring } from '../lib/springs';

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
  const cfdScale = 1.10 - cfdEntry * 0.10; // 1.10 → 1.00
  // Slow ambient drift across the scene
  const cfdDriftX = interpolate(frame, [10, SCENE_TOTAL], [0, -22], {
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
  const analyzeY = (1 - analyzeSpring) * 40;

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
    config: cardSpring,
    durationInFrames: 22,
  });
  const pillX = (1 - pillSpring) * 180;

  // ── Cards phase opacity ────────────────────────────────────────────────────
  const cardsIn = interpolate(frame, [CARDS_PHASE_START, CARDS_PHASE_START + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Card 1 (Design) — enters from left ────────────────────────────────────
  const card1Spring = spring({
    frame: Math.max(0, frame - CARD1_DELAY),
    fps,
    config: cardSpring,
    durationInFrames: 32,
  });
  const card1X = (1 - card1Spring) * -260;

  // ── Card 2 (Validate) — enters from right ─────────────────────────────────
  const card2Spring = spring({
    frame: Math.max(0, frame - CARD2_DELAY),
    fps,
    config: cardSpring,
    durationInFrames: 32,
  });
  const card2X = (1 - card2Spring) * 260;

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
            background:
              'linear-gradient(180deg, rgba(5,5,5,0.15) 0%, rgba(5,5,5,0.08) 35%, rgba(5,5,5,0.55) 72%, rgba(5,5,5,0.94) 100%)',
          }}
        />
        {/* Side vignettes */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(90deg, rgba(5,5,5,0.50) 0%, transparent 28%, transparent 72%, rgba(5,5,5,0.50) 100%)',
          }}
        />

        {/* ── "Analyze." + ANSYS label ── */}
        <div
          style={{
            position: 'absolute',
            left: 60,
            bottom: 240,
            transform: `translateY(${analyzeY}px)`,
            opacity: analyzeSpring,
          }}
        >
          <div
            style={{
              fontFamily: orbitron,
              fontSize: 58,
              fontWeight: 900,
              color: theme.colors.gold,
              letterSpacing: '0.08em',
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
              fontSize: 21,
              fontWeight: 600,
              color: theme.colors.textDim,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              marginTop: 12,
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
              borderRadius: 10,
              padding: '16px 24px',
            }}
          >
            <div
              style={{
                fontFamily: orbitron,
                fontSize: 12,
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
                fontSize: 40,
                fontWeight: 900,
                color: theme.colors.white,
                letterSpacing: '-0.02em',
                marginTop: 6,
                lineHeight: 1,
                textShadow: `0 0 30px rgba(255,255,255,0.20)`,
              }}
            >
              0.1mm
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
            transform: `translateY(-54%) translateX(${card1X}px)`,
            opacity: card1Spring,
          }}
        >
          <EngineeringCard
            imageSrc={staticFile('assets/concept-alpha-render.png')}
            title="Design"
            subtitle="Fusion 360 · CAD"
            accentColor={theme.colors.purpleSoft}
            tiltDeg={5}
            imageHeight={340}
          />
        </div>

        {/* ── Card 2: Validate (CFD) ── */}
        <div
          style={{
            position: 'absolute',
            right: 24,
            top: '50%',
            width: 488,
            transform: `translateY(-46%) translateX(${card2X}px)`,
            opacity: card2Spring,
          }}
        >
          <EngineeringCard
            imageSrc={staticFile('assets/concept-beta-cfd.jpeg')}
            title="Validate"
            subtitle="ANSYS · CFD"
            accentColor={theme.colors.gold}
            tiltDeg={-5}
            imageHeight={340}
          />
        </div>

        {/* ── "CAD → CFD → CNC" label ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 130,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: chainSpring,
            transform: `translateY(${(1 - chainSpring) * 18}px)`,
          }}
        >
          <div
            style={{
              fontFamily: orbitron,
              fontSize: 24,
              fontWeight: 700,
              color: theme.colors.muted,
              letterSpacing: '0.22em',
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

// ── Internal card component ────────────────────────────────────────────────

interface EngineeringCardProps {
  imageSrc: string;
  title: string;
  subtitle: string;
  accentColor: string;
  tiltDeg: number;
  imageHeight: number;
}

const EngineeringCard: React.FC<EngineeringCardProps> = ({
  imageSrc,
  title,
  subtitle,
  accentColor,
  tiltDeg,
  imageHeight,
}) => (
  <div
    style={{
      transform: `perspective(900px) rotateY(${tiltDeg}deg)`,
      borderRadius: 14,
      overflow: 'hidden',
      border: `1px solid rgba(255,255,255,0.08)`,
      background: 'rgba(18,18,18,0.92)',
      boxShadow: `0 32px 90px rgba(0,0,0,0.65), 0 0 0 1px ${accentColor}1A`,
    }}
  >
    <div style={{ height: imageHeight, overflow: 'hidden', position: 'relative' }}>
      <Img
        src={imageSrc}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, transparent 50%, rgba(18,18,18,0.88) 100%)',
        }}
      />
    </div>
    <div style={{ padding: '20px 24px 26px' }}>
      <div
        style={{
          fontFamily: orbitron,
          fontSize: 30,
          fontWeight: 900,
          color: theme.colors.white,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: montserrat,
          fontSize: 16,
          color: accentColor,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginTop: 8,
        }}
      >
        {subtitle}
      </div>
    </div>
  </div>
);
