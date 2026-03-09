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
import { SiteAtmosphere } from '../components/SiteAtmosphere';
import { theme } from '../lib/theme';
import { orbitron, montserrat } from '../lib/fonts';
import { softSpring } from '../lib/springs';

// Scene duration: 120 frames (4.0s)
//
// 2.5D browser viewport showing the Engineering page.
// Scrolls through engineering pipeline: hero, 3 steps, gallery.

const FADE_IN_END = 10;
const PUSH_END = 22;
const SCROLL_START = 14;
const SCROLL_END = 106;
const FADE_OUT_START = 108;
const SCENE_TOTAL = 120;

const VP_WIDTH = 920;
const VP_CHROME = 44;
const VP_CONTENT_H = 510;
const VP_HEIGHT = VP_CHROME + VP_CONTENT_H;

const SEC_HERO_H = 460;
const SEC_STEPS_H = 700;
const SEC_GALLERY_H = 440;

const INNER_TOTAL_H = SEC_HERO_H + SEC_STEPS_H + SEC_GALLERY_H;
const SCROLL_DISTANCE = INNER_TOTAL_H - VP_CONTENT_H;
const SCROLL_TARGET = SCROLL_DISTANCE * 0.92;

export const SEngineering2D5: React.FC = () => {
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

  const cameraPush = interpolate(frame, [0, PUSH_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * t * (3 - 2 * t),
  });
  const cameraDriftX = Math.sin(frame / 42) * 4.5;
  const cameraDriftY = Math.cos(frame / 58) * 2.8;
  const tiltX = 10 - cameraPush * 7 + Math.sin(frame / 58) * 0.6;
  const tiltY = -4.5 + cameraPush * 5.5 + Math.cos(frame / 62) * 0.5;
  const vpScale = 0.85 + cameraPush * 0.16;
  const vpEntryY = (1 - sceneIn) * 60;

  const scrollProgress = interpolate(frame, [SCROLL_START, SCROLL_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const innerScrollY = -SCROLL_TARGET * scrollProgress;

  const urlBadgeSpring = spring({
    frame: Math.max(0, frame - 16),
    fps,
    config: softSpring,
    durationInFrames: 22,
  });
  const urlFadeOut = interpolate(frame, [FADE_OUT_START, SCENE_TOTAL], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden' }}>
      <SiteAtmosphere />

      {/* Purple glow behind viewport */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: 1020,
            height: 720,
            transform: `translateX(${cameraDriftX * 0.45}px) translateY(${cameraDriftY * 0.45}px)`,
            background:
              'radial-gradient(ellipse 62% 44% at 50% 50%, rgba(131,56,236,0.36) 0%, rgba(58,12,163,0.16) 36%, transparent 76%)',
            filter: 'blur(88px)',
            opacity: 0.9,
          }}
        />
      </AbsoluteFill>

      {/* 3D perspective container */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1850px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div
          style={{
            transform: `translateX(${cameraDriftX}px) translateY(${vpEntryY + cameraDriftY}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${vpScale})`,
            transformOrigin: 'center center',
            width: VP_WIDTH,
            height: VP_HEIGHT,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow:
              '0 60px 160px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.09), 0 0 130px rgba(58,12,163,0.32)',
          }}
        >
          <BrowserChrome />

          <div
            style={{
              width: '100%',
              height: VP_CONTENT_H,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '100%',
                height: INNER_TOTAL_H,
                transform: `translateY(${innerScrollY}px)`,
              }}
            >
              <EngHeroSection />
              <EngStepsSection />
              <EngGallerySection />
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* URL badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          opacity: urlBadgeSpring * urlFadeOut,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: theme.colors.gold,
            boxShadow: '0 0 12px rgba(229,184,11,0.8)',
          }}
        />
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 28,
            fontWeight: 700,
            color: theme.colors.gold,
            letterSpacing: '0.08em',
            textShadow: '0 0 24px rgba(229,184,11,0.5)',
          }}
        >
          successorsf1.com/engineering
        </div>
      </div>

      <AbsoluteFill
        style={{ background: theme.colors.bg, opacity: 1 - sceneIn, pointerEvents: 'none' }}
      />
      <AbsoluteFill
        style={{ background: theme.colors.bg, opacity: fadeToBlack, pointerEvents: 'none' }}
      />
    </AbsoluteFill>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// INTERNAL COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const cardStyle: React.CSSProperties = {
  borderRadius: 24,
  border: '1px solid rgba(240,238,245,0.08)',
  background:
    'linear-gradient(165deg, rgba(10,10,14,0.96) 0%, rgba(8,8,12,0.92) 56%, rgba(58,12,163,0.22) 100%)',
  boxShadow: '0 10px 28px rgba(0,0,0,0.4), 0 0 80px rgba(131,56,236,0.15)',
  overflow: 'hidden',
};

const NAV_LINKS = ['Home', 'Team', 'Engineering', 'Enterprise', 'Sponsors'];

const BrowserChrome: React.FC = () => (
  <div
    style={{
      height: VP_CHROME,
      background: 'rgba(10,10,10,0.98)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      flexShrink: 0,
      gap: 8,
    }}
  >
    <div style={{ display: 'flex', gap: 7, marginRight: 4 }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F57' }} />
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#FEBC2E' }} />
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28C840' }} />
    </div>
    <div
      style={{
        flex: 1,
        height: 28,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
      }}
    >
      <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
        <rect x="1" y="6" width="10" height="8" rx="2" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
        <path d="M3.5 6V4.5C3.5 3.12 4.62 2 6 2C7.38 2 8.5 3.12 8.5 4.5V6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
      </svg>
      <span
        style={{
          fontFamily: montserrat,
          fontSize: 13,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.01em',
        }}
      >
        successorsf1.com/engineering
      </span>
    </div>
  </div>
);


// ── SECTION 1: ENGINEERING HERO ──────────────────────────────────────────────

const EngHeroSection: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: SEC_HERO_H,
      background: 'rgba(5,5,5,0.99)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 40px',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {/* Nav bar */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 48,
        background: 'rgba(5,5,5,0.60)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 18px',
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Img
          src={staticFile('assets/logo.svg')}
          style={{ width: 20, height: 20, objectFit: 'contain' }}
        />
        <span
          style={{
            fontFamily: orbitron,
            fontSize: 11,
            fontWeight: 700,
            color: theme.colors.white,
            letterSpacing: '0.06em',
          }}
        >
          Successors
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 999,
          padding: '5px 14px',
        }}
      >
        {NAV_LINKS.map((link) => (
          <span
            key={link}
            style={{
              fontFamily: montserrat,
              fontSize: 10,
              fontWeight: 600,
              color:
                link === 'Engineering'
                  ? 'rgba(255,255,255,0.90)'
                  : 'rgba(255,255,255,0.42)',
              letterSpacing: '0.03em',
            }}
          >
            {link}
          </span>
        ))}
      </div>
    </div>

    {/* Atmosphere glow */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(58,12,163,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />

    <div
      style={{
        fontFamily: orbitron,
        fontSize: 9,
        fontWeight: 700,
        color: theme.colors.gold,
        letterSpacing: '0.24em',
        textTransform: 'uppercase',
        marginBottom: 10,
      }}
    >
      Engineering Pipeline
    </div>
    <div
      style={{
        fontFamily: orbitron,
        fontSize: 28,
        fontWeight: 900,
        color: theme.colors.white,
        letterSpacing: '-0.01em',
        lineHeight: 1.15,
        textAlign: 'center',
        marginBottom: 12,
        textShadow: '0 0 40px rgba(131,56,236,0.35)',
      }}
    >
      Our Engineering Timeline
    </div>
    <div
      style={{
        fontFamily: montserrat,
        fontSize: 11,
        fontWeight: 400,
        color: theme.colors.muted,
        textAlign: 'center',
        lineHeight: 1.6,
        maxWidth: 640,
        marginBottom: 24,
      }}
    >
      From concept to competition, every phase is precision-engineered. Our pipeline
      combines CAD sculpting, CFD validation, and CNC production to deliver a
      race-ready F1 car at 0.1mm tolerance.
    </div>
    <div
      style={{
        width: 160,
        height: 1,
        margin: '0 auto 24px',
        background:
          'linear-gradient(90deg, transparent, rgba(229,184,11,0.40), transparent)',
      }}
    />
    <div style={{ ...cardStyle, width: '100%', maxWidth: 700, padding: 8 }}>
      <Img
        src={staticFile('assets/concept-gamma-cfd.jpeg')}
        style={{
          width: '100%',
          height: 180,
          objectFit: 'cover',
          borderRadius: 16,
          display: 'block',
        }}
      />
    </div>
  </div>
);


// ── SECTION 2: ENGINEERING STEPS ─────────────────────────────────────────────

const ENG_STEPS = [
  {
    num: '01',
    title: 'CAD Sculpting',
    tool: 'Autodesk Fusion 360',
    desc: 'Aerodynamic surfacing and precision geometry. Rapid iteration loops refine nose cone, diffuser, and sidepod profiles for optimal airflow.',
  },
  {
    num: '02',
    title: 'CFD Validation',
    tool: 'Ansys Discovery',
    desc: 'Computational fluid dynamics simulation validates drag targets. Velocity streamline analysis identifies pressure zones and flow separation.',
  },
  {
    num: '03',
    title: 'CNC Production',
    tool: 'Lunyee 3018 Pro Ultra',
    desc: 'G-code toolpath generation and subtractive manufacturing. Balsa block machining with controlled feed rates delivers sub-0.1mm surface accuracy.',
  },
];

const EngStepsSection: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: SEC_STEPS_H,
      background: 'rgba(5,5,5,0.99)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '30px 40px',
      gap: 14,
    }}
  >
    <div style={{ textAlign: 'center', marginBottom: 10 }}>
      <div
        style={{
          fontFamily: orbitron,
          fontSize: 9,
          fontWeight: 700,
          color: theme.colors.gold,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        The Pipeline
      </div>
      <div
        style={{
          fontFamily: orbitron,
          fontSize: 18,
          fontWeight: 900,
          color: theme.colors.white,
          letterSpacing: '-0.01em',
        }}
      >
        Three Phases. One Workflow.
      </div>
      <div
        style={{
          width: 120,
          height: 1,
          margin: '8px auto 0',
          background:
            'linear-gradient(90deg, transparent, rgba(229,184,11,0.40), transparent)',
        }}
      />
    </div>

    {ENG_STEPS.map(({ num, title, tool, desc }) => (
      <div
        key={num}
        style={{
          ...cardStyle,
          width: '100%',
          maxWidth: 700,
          padding: '18px 22px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            width: 10,
            height: 10,
            borderTop: '1.5px solid rgba(229,184,11,0.30)',
            borderLeft: '1.5px solid rgba(229,184,11,0.30)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 10,
            height: 10,
            borderBottom: '1.5px solid rgba(229,184,11,0.30)',
            borderRight: '1.5px solid rgba(229,184,11,0.30)',
          }}
        />
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div
            style={{
              fontFamily: orbitron,
              fontSize: 32,
              fontWeight: 900,
              color: theme.colors.gold,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              opacity: 0.7,
            }}
          >
            {num}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: orbitron,
                fontSize: 15,
                fontWeight: 900,
                color: theme.colors.white,
                letterSpacing: '-0.01em',
                marginBottom: 4,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontFamily: montserrat,
                fontSize: 8,
                fontWeight: 600,
                color: theme.colors.gold,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                marginBottom: 8,
                opacity: 0.8,
              }}
            >
              {tool}
            </div>
            <div
              style={{
                fontFamily: montserrat,
                fontSize: 10,
                fontWeight: 400,
                color: theme.colors.muted,
                lineHeight: 1.55,
              }}
            >
              {desc}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);


// ── SECTION 3: GALLERY ───────────────────────────────────────────────────────

const GALLERY_ITEMS = [
  { file: 'concept-alpha-render.png', label: 'Concept Alpha' },
  { file: 'concept-beta-render.png', label: 'Concept Beta' },
  { file: 'concept-gamma-cfd.jpeg', label: 'CFD Analysis' },
  { file: 'concept-beta-cfd.jpeg', label: 'Flow Validation' },
];

const EngGallerySection: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: SEC_GALLERY_H,
      background: 'rgba(5,5,5,0.99)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '24px 40px',
    }}
  >
    <div style={{ textAlign: 'center', marginBottom: 14 }}>
      <div
        style={{
          fontFamily: orbitron,
          fontSize: 9,
          fontWeight: 700,
          color: theme.colors.gold,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        Gallery
      </div>
      <div
        style={{
          fontFamily: orbitron,
          fontSize: 16,
          fontWeight: 900,
          color: theme.colors.white,
          letterSpacing: '-0.01em',
        }}
      >
        Digital Prototyping & Analysis
      </div>
      <div
        style={{
          width: 120,
          height: 1,
          margin: '8px auto 0',
          background:
            'linear-gradient(90deg, transparent, rgba(229,184,11,0.40), transparent)',
        }}
      />
    </div>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        maxWidth: 700,
        width: '100%',
      }}
    >
      {GALLERY_ITEMS.map(({ file, label }) => (
        <div key={file} style={{ ...cardStyle, padding: 6 }}>
          <Img
            src={staticFile(`assets/${file}`)}
            style={{
              width: '100%',
              height: 120,
              objectFit: 'cover',
              borderRadius: 18,
              display: 'block',
            }}
          />
          <div
            style={{
              fontFamily: montserrat,
              fontSize: 9,
              fontWeight: 600,
              color: theme.colors.muted,
              letterSpacing: '0.06em',
              textAlign: 'center',
              padding: '6px 0 4px',
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  </div>
);
