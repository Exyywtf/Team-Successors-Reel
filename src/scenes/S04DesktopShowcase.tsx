import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
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
import { SCENE_DURATIONS, TRANSITION_DURATIONS } from '../lib/timing';

// Scene duration follows timing.ts. The entrance envelope is intentionally
// longer than before so the S01 → S02 overlap reads as a soft blend, not a snap.
//
// Faithful 2.5D recreation of successorsf1.com desktop homepage.
// Scrolls through ALL 9 real homepage sections in order:
//   1. Hero           — nav bar, video bg, heading, taglines, CTA buttons
//   2. F1 in Schools  — "What is F1 in Schools" + 4 impact stat pills
//   3. Season Roadmap — timeline images
//   4. Sponsor Trust  — 4 sponsor logo cards
//   5. Highlights     — 4 bento metric cards
//   6. Engineering    — 3 stage cards (Design, Analyze, Manufacture)
//   7. Outreach       — bullets + trust metrics
//   8. Partnership    — "Sponsor With Clear Outcomes" CTA card
//   9. Footer         — brand, nav, contact columns
//
// Timeline with current timings:
//   f00–18   — scene fades in under the URL handoff
//   f00–40   — viewport floats in with a slower-starting depth push
//   f34–104  — premium quick-glance scroll through sections
//   f108–120 — fade to black

const SCENE_TOTAL = SCENE_DURATIONS.S02;
const ENTRANCE_BLEND_END = Math.min(40, TRANSITION_DURATIONS.T01 + 8);
const FADE_IN_END = Math.round(ENTRANCE_BLEND_END * 0.45);
const PUSH_END = ENTRANCE_BLEND_END;
const FADE_OUT_START = SCENE_TOTAL - 12;

// Viewport logical dimensions
const VP_WIDTH = 920;
const VP_CHROME = 44;
const VP_NAV_H = 48;
const VP_CONTENT_H = 510;
const VP_HEIGHT = VP_CHROME + VP_CONTENT_H;

// Homepage section heights (scaled for the viewport)
const SECTION_HERO_H = VP_CONTENT_H;   // 510 — hero fills viewport
const SECTION_F1_H = 380;              // F1 in Schools intro + stats
const SECTION_ROADMAP_H = 340;         // Season Roadmap
const SECTION_SPONSORS_H = 280;        // Sponsor Trust Strip
const SECTION_HIGHLIGHTS_H = 400;      // Highlights bento
const SECTION_ENGINEERING_H = 320;     // Engineering Snapshot
const SECTION_OUTREACH_H = 300;        // Outreach
const SECTION_PARTNERSHIP_H = 240;     // Partnership Deck
const SECTION_FOOTER_H = 260;          // Footer

const INNER_TOTAL_H =
  SECTION_HERO_H + SECTION_F1_H + SECTION_ROADMAP_H + SECTION_SPONSORS_H +
  SECTION_HIGHLIGHTS_H + SECTION_ENGINEERING_H + SECTION_OUTREACH_H +
  SECTION_PARTNERSHIP_H + SECTION_FOOTER_H;

// Total scroll = inner height - viewport content area
const SCROLL_DISTANCE = INNER_TOTAL_H - VP_CONTENT_H;

const SCROLL_START = Math.max(FADE_IN_END + 16, TRANSITION_DURATIONS.T01 + 2);
const SCROLL_END = SCENE_TOTAL - 16;
const SCROLL_TARGET = SCROLL_DISTANCE * 0.92;

export const S04DesktopShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeInEase = Easing.bezier(0.22, 0.61, 0.36, 1);
  const popInEase = Easing.bezier(0.32, 0.04, 0.18, 1);

  // ── Scene envelope ─────────────────────────────────────────────────────────
  const sceneIn = interpolate(frame, [0, FADE_IN_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: fadeInEase,
  });
  const fadeToBlack = interpolate(frame, [FADE_OUT_START, SCENE_TOTAL], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Camera push-in ─────────────────────────────────────────────────────────
  const cameraPush = interpolate(frame, [0, PUSH_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: popInEase,
  });
  const cameraDriftX = Math.sin(frame / 42) * 5.2;
  const cameraDriftY = Math.cos(frame / 58) * 3.1;
  const tiltX = 11 - cameraPush * 7.4 + Math.sin(frame / 58) * 0.7;
  const tiltY = -5 + cameraPush * 6.1 + Math.cos(frame / 62) * 0.65;
  const vpScale = 0.84 + cameraPush * 0.17;
  const vpEntryY = (1 - sceneIn) * 66;

  // ── Inner content scroll (multi-keyframe) ─────────────────────────────────
  const scrollProgress = interpolate(frame, [SCROLL_START, SCROLL_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const innerScrollY = -SCROLL_TARGET * scrollProgress;
  const prevScrollProgress = interpolate(Math.max(0, frame - 1), [SCROLL_START, SCROLL_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const prevScrollY = -SCROLL_TARGET * prevScrollProgress;
  const scrollVelocity = Math.abs(innerScrollY - prevScrollY);
  const glowEnvelope = interpolate(
    frame,
    [SCROLL_START, SCROLL_START + 8, SCROLL_END - 8, SCROLL_END],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );
  const glowLift =
    interpolate(scrollVelocity, [0, 5, 12], [0, 0.2, 0.72], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) * glowEnvelope;

  // ── Video parallax in hero ─────────────────────────────────────────────────
  const videoParallaxX = interpolate(frame, [0, PUSH_END], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const videoScale = 1.07 - cameraPush * 0.05;

  // ── URL badge ──────────────────────────────────────────────────────────────
  const urlBadgeSpring = spring({
    frame: Math.max(0, frame - 18),
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
      {/* Atmospheric dark space */}
      <SiteAtmosphere />

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
            transform: `translateX(${cameraDriftX * 0.45}px) translateY(${cameraDriftY * 0.45}px) scale(${1 + glowLift * 0.035})`,
            background:
              'radial-gradient(ellipse 62% 44% at 50% 50%, rgba(131,56,236,0.36) 0%, rgba(58,12,163,0.16) 36%, transparent 76%)',
            filter: 'blur(96px)',
            opacity: 0.84 + glowLift * 0.1,
          }}
        />
      </AbsoluteFill>

      {/* ── 3D perspective container ── */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1850px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        {/* ── Viewport 3D wrapper ── */}
        <div
          style={{
            transform: `translateX(${cameraDriftX}px) translateY(${vpEntryY + cameraDriftY}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${vpScale})`,
            transformOrigin: 'center center',
            width: VP_WIDTH,
            height: VP_HEIGHT,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: `
              0 60px 160px rgba(0,0,0,0.88),
              0 0 0 1px rgba(255,255,255,0.09),
              0 0 130px rgba(58,12,163,0.32)
            `,
          }}
        >
          {/* ── Browser chrome ── */}
          <BrowserChrome />

          {/* ── Viewport content area ── */}
          <div style={{ width: '100%', height: VP_CONTENT_H, overflow: 'hidden', position: 'relative' }}>
            <div
              style={{
                width: '100%',
                height: INNER_TOTAL_H,
                transform: `translateY(${innerScrollY}px)`,
              }}
            >

              {/* ═══ SECTION 1: HERO ═══ */}
              <HeroSection videoScale={videoScale} videoParallaxX={videoParallaxX} />

              {/* ═══ SECTION 2: F1 IN SCHOOLS INTRO ═══ */}
              <F1InSchoolsSection />

              {/* ═══ SECTION 3: SEASON ROADMAP ═══ */}
              <SeasonRoadmapSection />

              {/* ═══ SECTION 4: SPONSOR TRUST STRIP ═══ */}
              <SponsorTrustSection />

              {/* ═══ SECTION 5: HIGHLIGHTS ═══ */}
              <HighlightsSection />

              {/* ═══ SECTION 6: ENGINEERING SNAPSHOT ═══ */}
              <EngineeringSnapshotSection />

              {/* ═══ SECTION 7: OUTREACH ═══ */}
              <OutreachSection />

              {/* ═══ SECTION 8: PARTNERSHIP DECK ═══ */}
              <PartnershipDeckSection />

              {/* ═══ SECTION 9: FOOTER ═══ */}
              <FooterSection />

            </div>{/* end inner scrollable */}
          </div>{/* end viewport content area */}
        </div>{/* end 3D viewport wrapper */}
      </AbsoluteFill>

      {/* ── Floating URL badge — under viewport, visible until scene exit ── */}
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
            width: 7, height: 7, borderRadius: '50%',
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
          successorsf1.com
        </div>
      </div>

      {/* Scene fade-in overlay */}
      <AbsoluteFill
        style={{ background: theme.colors.bg, opacity: 1 - sceneIn, pointerEvents: 'none' }}
      />

      {/* Fade to black */}
      <AbsoluteFill
        style={{ background: theme.colors.bg, opacity: fadeToBlack, pointerEvents: 'none' }}
      />
    </AbsoluteFill>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// INTERNAL COMPONENTS — each maps to a real homepage section
// ═══════════════════════════════════════════════════════════════════════════════

// ── Shared section styling ──────────────────────────────────────────────────

const sectionPad = '0 40px';

const SectionHeader: React.FC<{
  eyebrow: string;
  title: string;
  subtitle?: string;
}> = ({ eyebrow, title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: 18 }}>
    <div style={{
      fontFamily: orbitron, fontSize: 9, fontWeight: 700,
      color: theme.colors.gold, letterSpacing: '0.24em',
      textTransform: 'uppercase', marginBottom: 6,
    }}>
      {eyebrow}
    </div>
    <div style={{
      fontFamily: orbitron, fontSize: 18, fontWeight: 900,
      color: theme.colors.white, letterSpacing: '-0.01em',
      lineHeight: 1.15,
    }}>
      {title}
    </div>
    {subtitle && (
      <div style={{
        fontFamily: montserrat, fontSize: 10, fontWeight: 400,
        color: theme.colors.muted, marginTop: 6, lineHeight: 1.5,
      }}>
        {subtitle}
      </div>
    )}
    {/* Gold underline — matches real site .gold-underline + .divider-soft */}
    <div style={{
      width: 160, height: 1, margin: '10px auto 0',
      background: `linear-gradient(90deg, transparent, rgba(229,184,11,0.40), transparent)`,
    }} />
  </div>
);

// Real site card styling base
const cardStyle: React.CSSProperties = {
  borderRadius: 24,
  border: '1px solid rgba(240,238,245,0.08)',
  background: 'linear-gradient(165deg, rgba(10,10,14,0.96) 0%, rgba(8,8,12,0.92) 56%, rgba(58,12,163,0.22) 100%)',
  boxShadow: '0 10px 28px rgba(0,0,0,0.4), 0 0 80px rgba(131,56,236,0.15)',
  overflow: 'hidden',
};

const sectionDivider: React.CSSProperties = {
  width: '100%', height: 1,
  background: 'linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.05) 50%, transparent 95%)',
};


// ── Browser Chrome ──────────────────────────────────────────────────────────

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
        flex: 1, height: 28,
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}
    >
      <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
        <rect x="1" y="6" width="10" height="8" rx="2" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
        <path d="M3.5 6V4.5C3.5 3.12 4.62 2 6 2C7.38 2 8.5 3.12 8.5 4.5V6" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
      </svg>
      <span style={{ fontFamily: montserrat, fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.01em' }}>
        successorsf1.com
      </span>
    </div>
  </div>
);


// ── SECTION 1: HERO ─────────────────────────────────────────────────────────

const HeroSection: React.FC<{ videoScale: number; videoParallaxX: number }> = ({ videoScale, videoParallaxX }) => (
  <div style={{ width: '100%', height: SECTION_HERO_H, position: 'relative', overflow: 'hidden' }}>

    {/* Hero video background */}
    <div
      style={{
        position: 'absolute', inset: 0,
        transform: `scale(${videoScale}) translateX(${videoParallaxX}px)`,
        transformOrigin: 'center center',
        overflow: 'hidden',
      }}
    >
      <OffthreadVideo
        src={staticFile('assets/hero.mp4')}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        muted
      />
    </div>

    {/* Gradient overlays — faithful to real site */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, rgba(5,5,5,0.45) 0%, rgba(5,5,5,0.62) 50%, rgba(5,5,5,0.85) 100%)',
    }} />
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse 80% 60% at 50% 42%, rgba(58,12,163,0.20) 0%, transparent 72%)',
    }} />

    {/* ── Nav Bar — real site glass nav ── */}
    <div
      style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: VP_NAV_H,
        background: 'rgba(5,5,5,0.60)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 18px', zIndex: 10,
      }}
    >
      {/* Logo + wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Img src={staticFile('assets/logo.svg')} style={{ width: 20, height: 20, objectFit: 'contain' }} />
        <span style={{
          fontFamily: orbitron, fontSize: 11, fontWeight: 700,
          color: theme.colors.white, letterSpacing: '0.06em',
        }}>
          Successors
        </span>
      </div>
      {/* Nav links in glass pill + Contact */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 999, padding: '5px 14px',
        }}>
          {(['Home', 'Team', 'Engineering', 'Enterprise', 'Sponsors'] as const).map((link) => (
            <span key={link} style={{
              fontFamily: montserrat, fontSize: 10, fontWeight: 600,
              color: link === 'Home' ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.42)',
              letterSpacing: '0.03em',
            }}>
              {link}
            </span>
          ))}
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(229,184,11,0.14), rgba(229,184,11,0.05))',
          border: '1px solid rgba(229,184,11,0.40)',
          borderRadius: 999, padding: '5px 12px',
          fontFamily: orbitron, fontSize: 9, fontWeight: 700,
          color: theme.colors.gold, letterSpacing: '0.08em', textTransform: 'uppercase' as const,
        }}>
          Contact
        </div>
      </div>
    </div>

    {/* Hero content */}
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: `${VP_NAV_H + 8}px 48px 24px`,
    }}>
      {/* Eyebrow label — real site has "Successors" label */}
      <div style={{
        fontFamily: orbitron, fontSize: 11, fontWeight: 700,
        color: theme.colors.gold, letterSpacing: '0.22em',
        textTransform: 'uppercase' as const, marginBottom: 14,
      }}>
        Successors
      </div>

      {/* Main heading — real site: "Inheriting the Legacy. Defining the Future." */}
      <div style={{
        fontFamily: orbitron, fontSize: 42, fontWeight: 900,
        color: theme.colors.white, letterSpacing: '-0.02em',
        lineHeight: 1.1, textAlign: 'center',
        textShadow: '0 0 60px rgba(131,56,236,0.5), 0 0 120px rgba(131,56,236,0.20)',
      }}>
        Inheriting the Legacy.
      </div>
      <div style={{
        fontFamily: orbitron, fontSize: 42, fontWeight: 900,
        color: theme.colors.white, letterSpacing: '-0.02em',
        lineHeight: 1.1, textAlign: 'center', marginTop: 4,
        textShadow: '0 0 60px rgba(131,56,236,0.5), 0 0 120px rgba(131,56,236,0.20)',
      }}>
        Defining the Future.
      </div>

      {/* Subheadline — real site copy */}
      <div style={{
        fontFamily: montserrat, fontSize: 12, fontWeight: 400,
        color: theme.colors.textDim, textAlign: 'center',
        marginTop: 16, lineHeight: 1.65, maxWidth: 560,
      }}>
        We are Successors, an F1 in Schools team building precision engineering,
        measurable partner value, and high-impact STEM outreach.
      </div>

      {/* CTA buttons — real site: "Meet the Team" (purple) + "Sponsor Us" (gold) */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(76,29,149,0.90), rgba(131,56,236,0.90))',
          border: '1px solid rgba(131,56,236,0.50)',
          borderRadius: 999, padding: '7px 18px',
          fontFamily: orbitron, fontSize: 9, fontWeight: 700,
          color: theme.colors.white, letterSpacing: '0.07em', textTransform: 'uppercase' as const,
          boxShadow: '0 0 28px rgba(131,56,236,0.28)',
        }}>
          Meet the Team
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(229,184,11,0.12), rgba(229,184,11,0.04))',
          border: '1px solid rgba(229,184,11,0.38)',
          borderRadius: 999, padding: '7px 18px',
          fontFamily: orbitron, fontSize: 9, fontWeight: 700,
          color: theme.colors.gold, letterSpacing: '0.07em', textTransform: 'uppercase' as const,
        }}>
          Sponsor Us
        </div>
      </div>
    </div>

    {/* Bottom fade into next section */}
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 64,
      background: 'linear-gradient(transparent, rgba(5,5,5,0.98))',
      pointerEvents: 'none',
    }} />
  </div>
);


// ── SECTION 2: F1 IN SCHOOLS INTRO ──────────────────────────────────────────

const F1_STATS = [
  { value: '113',     label: 'Schools Participating' },
  { value: '1,140',   label: 'Students Participating' },
  { value: '85',      label: 'National Teams' },
  { value: '31,000+', label: 'Online Views' },
];

const F1InSchoolsSection: React.FC = () => (
  <div style={{
    width: '100%', height: SECTION_F1_H,
    background: 'rgba(5,5,5,0.99)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: sectionPad, position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(58,12,163,0.08) 0%, transparent 70%)',
      pointerEvents: 'none',
    }} />

    <SectionHeader
      eyebrow="F1 in Schools"
      title="What is F1 in Schools"
      subtitle="The World's Largest International STEM Challenge."
    />

    {/* Main card with description text — matches real site info card */}
    <div style={{
      ...cardStyle,
      padding: '16px 20px',
      maxWidth: 700,
      marginBottom: 18,
    }}>
      <div style={{
        fontFamily: montserrat, fontSize: 10, fontWeight: 400,
        color: theme.colors.textDim, lineHeight: 1.65, textAlign: 'center',
      }}>
        Running in the UAE since 2009, the Formula 1® STEM Challenge is one of the biggest
        international STEAM competitions in the world, seeing teams of 3 to 6 students plan,
        research, design, analyse, manufacture and test a miniature &apos;F1® car&apos; using CAD/CAM/CNC tools.
      </div>
    </div>

    {/* 4 stat pills — real site impact stats */}
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
      {F1_STATS.map(({ value, label }) => (
        <div key={label} style={{
          ...cardStyle,
          padding: '10px 16px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          minWidth: 130,
        }}>
          <div style={{
            fontFamily: orbitron, fontSize: 22, fontWeight: 900,
            color: theme.colors.gold, letterSpacing: '-0.02em', lineHeight: 1,
          }}>
            {value}
          </div>
          <div style={{
            fontFamily: montserrat, fontSize: 8, fontWeight: 600,
            color: theme.colors.muted, letterSpacing: '0.12em',
            textTransform: 'uppercase' as const, textAlign: 'center',
          }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  </div>
);


// ── SECTION 3: SEASON ROADMAP ───────────────────────────────────────────────

const SeasonRoadmapSection: React.FC = () => (
  <div style={{
    width: '100%', height: SECTION_ROADMAP_H,
    background: 'rgba(5,5,5,0.99)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: sectionPad, position: 'relative',
  }}>
    <div style={sectionDivider} />

    <SectionHeader
      eyebrow="Roadmap"
      title="Season Roadmap"
      subtitle="Our strategic project phases from team orientation to the starting grid."
    />

    {/* Timeline row 1 image — in a card */}
    <div style={{
      ...cardStyle,
      width: '100%', maxWidth: 780,
      padding: 8,
    }}>
      <Img
        src={staticFile('assets/timeline-row1-with-car.png')}
        style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block', borderRadius: 16 }}
      />
    </div>

    {/* Timeline row 2 */}
    <div style={{
      ...cardStyle,
      width: '100%', maxWidth: 780,
      padding: 8, marginTop: 8,
    }}>
      <Img
        src={staticFile('assets/timeline-row2.png')}
        style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block', borderRadius: 16 }}
      />
    </div>
  </div>
);


// ── SECTION 4: SPONSOR TRUST STRIP ──────────────────────────────────────────

const SPONSORS = [
  { file: 'vmake.svg',    name: 'VMake',         tier: 'Champion' },
  { file: 'spicebox.svg', name: 'Spicebox.AI',   tier: 'Turbo' },
  { file: 'indiana.svg',  name: 'Indiana',        tier: 'Turbo' },
  { file: 'yetkey.svg',   name: 'YetKey',         tier: 'Speed' },
];

const SponsorTrustSection: React.FC = () => (
  <div style={{
    width: '100%', height: SECTION_SPONSORS_H,
    background: 'rgba(5,5,5,0.97)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: sectionPad,
  }}>
    <SectionHeader
      eyebrow="Partners"
      title="Sponsor Trust Strip"
      subtitle="Trusted by sponsors powering our race to nationals."
    />

    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {SPONSORS.map(({ file, name, tier }) => (
        <div key={file} style={{
          ...cardStyle,
          padding: '14px 16px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          width: 180,
        }}>
          <div style={{
            height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Img
              src={staticFile(`assets/${file}`)}
              style={{ height: '100%', maxWidth: 120, objectFit: 'contain' }}
            />
          </div>
          <div style={{
            fontFamily: orbitron, fontSize: 9, fontWeight: 700,
            color: theme.colors.white, letterSpacing: '0.04em',
          }}>
            {name}
          </div>
          <div style={{
            fontFamily: montserrat, fontSize: 7, fontWeight: 600,
            color: theme.colors.gold, letterSpacing: '0.16em',
            textTransform: 'uppercase' as const, opacity: 0.75,
          }}>
            {tier}
          </div>
        </div>
      ))}
    </div>
  </div>
);


// ── SECTION 5: HIGHLIGHTS ───────────────────────────────────────────────────

const HIGHLIGHTS = [
  { metric: 'Q2 Race Window',          title: 'National Finals Momentum',
    desc: 'Race-ready development roadmap aligned to the UAE F1 in Schools National Finals timeline.' },
  { metric: '0.1mm tolerance',         title: 'Engineering Precision',
    desc: 'End-to-end workflow from CAD surfacing to CFD iteration and CNC production accuracy.' },
  { metric: '100k+ impressions',       title: 'Sponsor ROI',
    desc: 'Activation strategy built for visibility, content production, and measurable outreach.' },
  { metric: '6,000+ student access',   title: 'Community Reach',
    desc: 'STEM engagement programs delivered through school and partner ecosystems.' },
];

const HighlightsSection: React.FC = () => (
  <div style={{
    width: '100%', height: SECTION_HIGHLIGHTS_H,
    background: 'rgba(5,5,5,0.99)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: sectionPad, position: 'relative',
  }}>
    <div style={sectionDivider} />

    <SectionHeader
      eyebrow="Highlights"
      title="Highlights"
      subtitle="High-performance execution across engineering, enterprise, and outreach."
    />

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 780, width: '100%' }}>
      {HIGHLIGHTS.map(({ metric, title, desc }) => (
        <div key={title} style={{
          ...cardStyle,
          padding: '14px 16px',
        }}>
          {/* Metric chip */}
          <div style={{
            fontFamily: orbitron, fontSize: 10, fontWeight: 700,
            color: theme.colors.gold, letterSpacing: '0.06em',
            marginBottom: 6,
            background: 'rgba(229,184,11,0.08)',
            border: '1px solid rgba(229,184,11,0.20)',
            borderRadius: 999, padding: '3px 10px',
            display: 'inline-block',
          }}>
            {metric}
          </div>
          <div style={{
            fontFamily: orbitron, fontSize: 13, fontWeight: 900,
            color: theme.colors.white, letterSpacing: '-0.01em',
            lineHeight: 1.15, marginBottom: 4,
          }}>
            {title}
          </div>
          <div style={{
            fontFamily: montserrat, fontSize: 9, fontWeight: 400,
            color: theme.colors.muted, lineHeight: 1.5,
          }}>
            {desc}
          </div>
        </div>
      ))}
    </div>
  </div>
);


// ── SECTION 6: ENGINEERING SNAPSHOT ──────────────────────────────────────────

const ENG_STAGES = [
  { stage: 'Design',      detail: 'Autodesk Fusion 360 aerodynamic modeling with rapid iteration loops.' },
  { stage: 'Analyze',     detail: 'Ansys CFD studies to cut drag, stabilize flow, and improve race performance.' },
  { stage: 'Manufacture', detail: 'Lunyee 3018 Pro Ultra CNC machining and controlled finishing workflow.' },
];

const EngineeringSnapshotSection: React.FC = () => (
  <div style={{
    width: '100%', height: SECTION_ENGINEERING_H,
    background: 'rgba(5,5,5,0.99)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: sectionPad, position: 'relative',
  }}>
    <div style={sectionDivider} />

    <SectionHeader
      eyebrow="Engineering"
      title="Engineering Snapshot"
      subtitle="From CAD to CFD to CNC, every phase is tightly measured."
    />

    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', maxWidth: 780, width: '100%' }}>
      {ENG_STAGES.map(({ stage, detail }) => (
        <div key={stage} style={{
          ...cardStyle,
          padding: '16px 16px',
          flex: 1,
          position: 'relative',
        }}>
          {/* Tech bracket corners */}
          <div style={{
            position: 'absolute', top: 8, left: 8, width: 10, height: 10,
            borderTop: '1.5px solid rgba(229,184,11,0.30)',
            borderLeft: '1.5px solid rgba(229,184,11,0.30)',
          }} />
          <div style={{
            position: 'absolute', bottom: 8, right: 8, width: 10, height: 10,
            borderBottom: '1.5px solid rgba(229,184,11,0.30)',
            borderRight: '1.5px solid rgba(229,184,11,0.30)',
          }} />

          <div style={{
            fontFamily: orbitron, fontSize: 9, fontWeight: 700,
            color: theme.colors.gold, letterSpacing: '0.20em',
            textTransform: 'uppercase' as const, marginBottom: 8,
          }}>
            {stage}
          </div>
          <div style={{
            fontFamily: montserrat, fontSize: 10, fontWeight: 400,
            color: theme.colors.muted, lineHeight: 1.55,
          }}>
            {detail}
          </div>
        </div>
      ))}
    </div>
  </div>
);


// ── SECTION 7: OUTREACH ─────────────────────────────────────────────────────

const OUTREACH_BULLETS = [
  'Charity Run and STEM campaign activations',
  'AI and innovation workshops for students',
  'Sustainable kit and operations partnerships',
];

const TRUST_METRICS = [
  { label: 'Student Reach',       value: '6,000+' },
  { label: 'LinkedIn Impressions', value: '100k+' },
  { label: 'Sustainable Ops',     value: '100%' },
  { label: 'National Finals',     value: 'UAE' },
];

const OutreachSection: React.FC = () => (
  <div style={{
    width: '100%', height: SECTION_OUTREACH_H,
    background: 'rgba(5,5,5,0.99)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: sectionPad, position: 'relative',
  }}>
    <div style={sectionDivider} />

    <SectionHeader
      eyebrow="Enterprise"
      title="Outreach That Moves Beyond The Track"
      subtitle="Our enterprise program links competition excellence with educational impact."
    />

    <div style={{ display: 'flex', gap: 10, maxWidth: 780, width: '100%' }}>
      {/* Left card: bullet list */}
      <div style={{ ...cardStyle, flex: 1.35, padding: '16px 18px' }}>
        {OUTREACH_BULLETS.map((bullet) => (
          <div key={bullet} style={{
            display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8,
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: theme.colors.gold, flexShrink: 0, marginTop: 4,
            }} />
            <div style={{
              fontFamily: montserrat, fontSize: 10, fontWeight: 400,
              color: theme.colors.textDim, lineHeight: 1.5,
            }}>
              {bullet}
            </div>
          </div>
        ))}
      </div>

      {/* Right card: trust metrics */}
      <div style={{ ...cardStyle, flex: 1, padding: '12px 16px' }}>
        {TRUST_METRICS.map(({ label, value }) => (
          <div key={label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '6px 0',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}>
            <span style={{
              fontFamily: montserrat, fontSize: 9, fontWeight: 500,
              color: theme.colors.muted, letterSpacing: '0.04em',
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: orbitron, fontSize: 13, fontWeight: 900,
              color: theme.colors.gold, letterSpacing: '-0.01em',
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);


// ── SECTION 8: PARTNERSHIP DECK ─────────────────────────────────────────────

const PartnershipDeckSection: React.FC = () => (
  <div style={{
    width: '100%', height: SECTION_PARTNERSHIP_H,
    background: 'rgba(5,5,5,0.99)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: sectionPad, position: 'relative',
  }}>
    <div style={sectionDivider} />

    <div style={{
      ...cardStyle,
      maxWidth: 700, width: '100%',
      padding: '24px 32px',
      textAlign: 'center',
      position: 'relative',
    }}>
      {/* Tech bracket corners */}
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

      {/* Eyebrow */}
      <div style={{
        fontFamily: orbitron, fontSize: 9, fontWeight: 700,
        color: theme.colors.gold, letterSpacing: '0.24em',
        textTransform: 'uppercase' as const, marginBottom: 8,
      }}>
        Partnership Deck
      </div>
      {/* Title */}
      <div style={{
        fontFamily: orbitron, fontSize: 22, fontWeight: 900,
        color: theme.colors.white, letterSpacing: '-0.01em',
        lineHeight: 1.15, marginBottom: 8,
      }}>
        Sponsor With Clear Outcomes
      </div>
      {/* Description */}
      <div style={{
        fontFamily: montserrat, fontSize: 10, fontWeight: 400,
        color: theme.colors.muted, lineHeight: 1.5, marginBottom: 14,
      }}>
        Access sponsorship benefits, activation models, and enterprise outcomes.
      </div>
      {/* CTA button */}
      <div style={{
        display: 'inline-block',
        background: 'linear-gradient(135deg, rgba(229,184,11,0.14), rgba(229,184,11,0.05))',
        border: '1px solid rgba(229,184,11,0.40)',
        borderRadius: 999, padding: '7px 22px',
        fontFamily: orbitron, fontSize: 9, fontWeight: 700,
        color: theme.colors.gold, letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
      }}>
        View Partnership Deck
      </div>
    </div>
  </div>
);


// ── SECTION 9: FOOTER ───────────────────────────────────────────────────────

const FOOTER_NAV = ['Home', 'Team', 'Engineering', 'Enterprise', 'Sponsors', 'FAQ', 'Contact'];

const FooterSection: React.FC = () => (
  <div style={{
    width: '100%', height: SECTION_FOOTER_H,
    background: 'rgba(5,5,5,1)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 40px',
    position: 'relative',
  }}>
    {/* Footer gradient overlay — real site footer-obsidian-haze */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, rgba(58,12,163,0.04) 0%, rgba(5,5,5,0) 40%, rgba(5,5,5,0) 100%)',
      pointerEvents: 'none',
    }} />

    {/* 3-column footer — matches real site */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr 1fr',
      gap: 28,
      marginBottom: 16,
    }}>
      {/* Column 1: Brand */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Img src={staticFile('assets/logo.svg')} style={{ width: 16, height: 16, objectFit: 'contain' }} />
          <span style={{
            fontFamily: orbitron, fontSize: 12, fontWeight: 700,
            color: theme.colors.gold, letterSpacing: '0.04em',
          }}>
            Successors
          </span>
        </div>
        <div style={{
          fontFamily: montserrat, fontSize: 9, fontWeight: 400,
          color: theme.colors.muted, lineHeight: 1.55,
        }}>
          Inheriting the Legacy. Defining the Future.
          A premium digital home for our F1 in Schools journey.
        </div>
      </div>

      {/* Column 2: Navigate */}
      <div>
        <div style={{
          fontFamily: orbitron, fontSize: 8, fontWeight: 700,
          color: theme.colors.muted, letterSpacing: '0.20em',
          textTransform: 'uppercase' as const, marginBottom: 8,
        }}>
          Navigate
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {FOOTER_NAV.map((link) => (
            <span key={link} style={{
              fontFamily: montserrat, fontSize: 9, fontWeight: 500,
              color: 'rgba(255,255,255,0.50)', letterSpacing: '0.02em',
            }}>
              {link}
            </span>
          ))}
        </div>
      </div>

      {/* Column 3: Contact */}
      <div>
        <div style={{
          fontFamily: orbitron, fontSize: 8, fontWeight: 700,
          color: theme.colors.muted, letterSpacing: '0.20em',
          textTransform: 'uppercase' as const, marginBottom: 8,
        }}>
          Contact
        </div>
        <div style={{
          fontFamily: montserrat, fontSize: 9, fontWeight: 500,
          color: 'rgba(255,255,255,0.50)', lineHeight: 1.6,
        }}>
          GEMS Founders School
          <br />
          Dubai, UAE
        </div>
        <div style={{
          display: 'flex', gap: 12, marginTop: 8,
        }}>
          <span style={{
            fontFamily: montserrat, fontSize: 8, fontWeight: 600,
            color: 'rgba(255,255,255,0.45)', letterSpacing: '0.10em',
            textTransform: 'uppercase' as const,
          }}>
            Instagram
          </span>
          <span style={{
            fontFamily: montserrat, fontSize: 8, fontWeight: 600,
            color: 'rgba(255,255,255,0.45)', letterSpacing: '0.10em',
            textTransform: 'uppercase' as const,
          }}>
            LinkedIn
          </span>
        </div>
      </div>
    </div>

    {/* Footer bottom divider + copyright */}
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      paddingTop: 10,
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: montserrat, fontSize: 8, fontWeight: 400,
        color: 'rgba(255,255,255,0.30)', letterSpacing: '0.03em',
      }}>
        © 2025 Successors. All rights reserved.
      </div>
    </div>
  </div>
);
