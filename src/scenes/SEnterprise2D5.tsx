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
// 2.5D browser viewport showing the Enterprise page.
// Scrolls through sponsorship tiers, performance metrics, and outreach.

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

const SEC_HERO_H = 440;
const SEC_TIERS_H = 400;
const SEC_METRICS_H = 240;
const SEC_OUTREACH_H = 300;

const INNER_TOTAL_H = SEC_HERO_H + SEC_TIERS_H + SEC_METRICS_H + SEC_OUTREACH_H;
const SCROLL_DISTANCE = INNER_TOTAL_H - VP_CONTENT_H;
const SCROLL_TARGET = SCROLL_DISTANCE * 0.92;

export const SEnterprise2D5: React.FC = () => {
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
  const cameraDriftX = Math.sin(frame / 44) * 4.2;
  const cameraDriftY = Math.cos(frame / 60) * 2.6;
  const tiltX = 10 - cameraPush * 7 + Math.sin(frame / 56) * 0.5;
  const tiltY = -4.5 + cameraPush * 5.5 + Math.cos(frame / 64) * 0.5;
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
              <EntHeroSection />
              <EntTiersSection />
              <EntMetricsSection />
              <EntOutreachSection />
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
          successorsf1.com/enterprise
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
        successorsf1.com/enterprise
      </span>
    </div>
  </div>
);


// ── SECTION 1: ENTERPRISE HERO ───────────────────────────────────────────────

const EntHeroSection: React.FC = () => (
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
                link === 'Enterprise'
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
      Enterprise Program
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
      Strategic Partnership
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
        marginBottom: 20,
      }}
    >
      Invest in a winning strategy. Our enterprise program delivers measurable
      sponsor visibility, STEM outreach impact, and brand activation through
      competition excellence and community engagement.
    </div>
    <div
      style={{
        width: 160,
        height: 1,
        margin: '0 auto 20px',
        background:
          'linear-gradient(90deg, transparent, rgba(229,184,11,0.40), transparent)',
      }}
    />
    {/* CTA buttons */}
    <div style={{ display: 'flex', gap: 10 }}>
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(76,29,149,0.90), rgba(131,56,236,0.90))',
          border: '1px solid rgba(131,56,236,0.50)',
          borderRadius: 999,
          padding: '7px 18px',
          fontFamily: orbitron,
          fontSize: 9,
          fontWeight: 700,
          color: theme.colors.white,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          boxShadow: '0 0 28px rgba(131,56,236,0.28)',
        }}
      >
        View Full Deck
      </div>
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(229,184,11,0.12), rgba(229,184,11,0.04))',
          border: '1px solid rgba(229,184,11,0.38)',
          borderRadius: 999,
          padding: '7px 18px',
          fontFamily: orbitron,
          fontSize: 9,
          fontWeight: 700,
          color: theme.colors.gold,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
        }}
      >
        Contact Us
      </div>
    </div>
  </div>
);


// ── SECTION 2: SPONSORSHIP TIERS ─────────────────────────────────────────────

const TIERS = [
  { name: 'Champion', price: '15,000+', color: theme.colors.gold, features: ['Primary logo placement', 'Full activation suite', 'Competition day VIP'] },
  { name: 'Nitro', price: '10,000+', color: theme.colors.purpleSoft, features: ['Co-branded content', 'Social campaign feature', 'Event presence'] },
  { name: 'Turbo', price: '5,000+', color: theme.colors.white, features: ['Logo on car & materials', 'Social media mentions', 'Newsletter feature'] },
  { name: 'Speed', price: '1,000+', color: 'rgba(255,255,255,0.60)', features: ['Website sponsor listing', 'Social media thanks', 'Report inclusion'] },
];

const EntTiersSection: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: SEC_TIERS_H,
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
        Sponsorship Tiers
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
        Choose Your Level
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
        maxWidth: 760,
        width: '100%',
      }}
    >
      {TIERS.map(({ name, price, color, features }) => (
        <div
          key={name}
          style={{
            ...cardStyle,
            padding: '16px 18px',
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
              borderTop: `1.5px solid ${color}`,
              borderLeft: `1.5px solid ${color}`,
              opacity: 0.35,
            }}
          />
          <div
            style={{
              fontFamily: orbitron,
              fontSize: 13,
              fontWeight: 900,
              color,
              letterSpacing: '0.04em',
              marginBottom: 4,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: orbitron,
              fontSize: 20,
              fontWeight: 900,
              color: theme.colors.white,
              letterSpacing: '-0.02em',
              marginBottom: 8,
            }}
          >
            {price}
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: theme.colors.muted,
                letterSpacing: '0.06em',
                marginLeft: 4,
              }}
            >
              AED
            </span>
          </div>
          {features.map((f) => (
            <div
              key={f}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: color,
                  opacity: 0.6,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: montserrat,
                  fontSize: 8,
                  fontWeight: 400,
                  color: theme.colors.muted,
                  lineHeight: 1.4,
                }}
              >
                {f}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);


// ── SECTION 3: PERFORMANCE METRICS ───────────────────────────────────────────

const PERF_METRICS = [
  { value: '100k+', label: 'LinkedIn Impressions', glow: theme.colors.gold },
  { value: '6,000+', label: 'Students Reached', glow: theme.colors.purpleSoft },
  { value: '100%', label: 'Sustainable Operations', glow: theme.colors.gold },
  { value: 'UAE', label: 'National Finals', glow: theme.colors.purpleSoft },
];

const EntMetricsSection: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: SEC_METRICS_H,
      background: 'rgba(5,5,5,0.99)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 40px',
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
        Performance
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
        Measurable Outcomes
      </div>
    </div>

    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', maxWidth: 760, width: '100%' }}>
      {PERF_METRICS.map(({ value, label, glow }) => (
        <div
          key={label}
          style={{
            ...cardStyle,
            flex: 1,
            padding: '14px 12px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: orbitron,
              fontSize: 22,
              fontWeight: 900,
              color: glow,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              marginBottom: 6,
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontFamily: montserrat,
              fontSize: 8,
              fontWeight: 600,
              color: theme.colors.muted,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  </div>
);


// ── SECTION 4: STRATEGIC OUTREACH ────────────────────────────────────────────

const OUTREACH_ITEMS = [
  'Charity runs and STEM campaign activations across Dubai schools',
  'AI and innovation workshops for students aged 12-18',
  'Sustainable kit design and operations partnerships',
  'Content production and social media amplification strategy',
];

const EntOutreachSection: React.FC = () => (
  <div
    style={{
      width: '100%',
      height: SEC_OUTREACH_H,
      background: 'rgba(5,5,5,0.99)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 40px',
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
        Outreach
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
        Strategic Community Impact
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
        ...cardStyle,
        maxWidth: 700,
        width: '100%',
        padding: '20px 24px',
      }}
    >
      {OUTREACH_ITEMS.map((item) => (
        <div
          key={item}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: theme.colors.gold,
              flexShrink: 0,
              marginTop: 5,
            }}
          />
          <div
            style={{
              fontFamily: montserrat,
              fontSize: 11,
              fontWeight: 400,
              color: theme.colors.textDim,
              lineHeight: 1.55,
            }}
          >
            {item}
          </div>
        </div>
      ))}
    </div>
  </div>
);
