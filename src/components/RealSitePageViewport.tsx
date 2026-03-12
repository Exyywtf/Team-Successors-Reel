import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SiteAtmosphere } from './SiteAtmosphere';
import { theme } from '../lib/theme';
import { orbitron } from '../lib/fonts';
import { softSpring } from '../lib/springs';
import {
  SITE_PREVIEW_HEIGHT,
  SITE_PREVIEW_WIDTH,
  SitePreviewPage,
  type SitePreviewPath,
} from '../imported-site/site/runtime/SitePreviewPage';

const VP_WIDTH = 920;
const VP_CHROME = 44;
const VP_CONTENT_H = 510;
const VP_HEIGHT = VP_CHROME + VP_CONTENT_H;
const CONTENT_SCALE = Math.min(
  VP_WIDTH / SITE_PREVIEW_WIDTH,
  VP_CONTENT_H / SITE_PREVIEW_HEIGHT,
);
const CONTENT_OFFSET_X = (VP_WIDTH - SITE_PREVIEW_WIDTH * CONTENT_SCALE) / 2;
const CONTENT_OFFSET_Y = (VP_CONTENT_H - SITE_PREVIEW_HEIGHT * CONTENT_SCALE) / 2;

interface RealSitePageViewportProps {
  path: SitePreviewPath;
  urlLabel: string;
  sceneTotal: number;
  fadeInEnd: number;
  pushEnd: number;
  scrollStart: number;
  scrollEnd: number;
  fadeOutStart: number;
  maxScrollProgress?: number;
  driftXAmp?: number;
  driftYAmp?: number;
  driftXDiv?: number;
  driftYDiv?: number;
  tiltXStart?: number;
  tiltXEnd?: number;
  tiltYStart?: number;
  tiltYEnd?: number;
  scaleStart?: number;
  scaleEnd?: number;
  entryYOffset?: number;
  glowOpacityBase?: number;
  previewStyle?: React.CSSProperties;
}

export const RealSitePageViewport: React.FC<RealSitePageViewportProps> = ({
  path,
  urlLabel,
  sceneTotal,
  fadeInEnd,
  pushEnd,
  scrollStart,
  scrollEnd,
  fadeOutStart,
  maxScrollProgress = 0.92,
  driftXAmp = 4.6,
  driftYAmp = 2.8,
  driftXDiv = 42,
  driftYDiv = 58,
  tiltXStart = 10,
  tiltXEnd = 3,
  tiltYStart = -4.5,
  tiltYEnd = 1.1,
  scaleStart = 0.85,
  scaleEnd = 1.01,
  entryYOffset = 60,
  glowOpacityBase = 0.84,
  previewStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeInEase = Easing.bezier(0.22, 0.61, 0.36, 1);
  const popInEase = Easing.bezier(0.32, 0.04, 0.18, 1);

  const sceneIn = interpolate(frame, [0, fadeInEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: fadeInEase,
  });
  const fadeToBlack = interpolate(frame, [fadeOutStart, sceneTotal], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cameraPush = interpolate(frame, [0, pushEnd], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: popInEase,
  });

  const cameraDriftX = Math.sin(frame / driftXDiv) * driftXAmp;
  const cameraDriftY = Math.cos(frame / driftYDiv) * driftYAmp;
  const tiltX = tiltXStart - cameraPush * (tiltXStart - tiltXEnd) + Math.sin(frame / 58) * 0.6;
  const tiltY = tiltYStart + cameraPush * (tiltYEnd - tiltYStart) + Math.cos(frame / 62) * 0.5;
  const vpScale = scaleStart + cameraPush * (scaleEnd - scaleStart);
  const vpEntryY = (1 - sceneIn) * entryYOffset;

  const scrollProgress = interpolate(frame, [scrollStart, scrollEnd], [0, maxScrollProgress], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const prevScrollProgress = interpolate(Math.max(0, frame - 1), [scrollStart, scrollEnd], [0, maxScrollProgress], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const scrollVelocity = Math.abs(scrollProgress - prevScrollProgress);
  const glowEnvelope = interpolate(
    frame,
    [scrollStart, scrollStart + 8, scrollEnd - 8, scrollEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );
  const glowLift =
    interpolate(scrollVelocity, [0, 0.01, 0.022], [0, 0.2, 0.72], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) * glowEnvelope;

  const urlBadgeSpring = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: softSpring,
    durationInFrames: 22,
  });
  const urlFadeOut = interpolate(frame, [fadeOutStart, sceneTotal], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: theme.colors.bg, overflow: 'hidden' }}>
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
            opacity: glowOpacityBase + glowLift * 0.1,
          }}
        />
      </AbsoluteFill>

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
            boxShadow: `0 60px 160px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,${0.09 + glowLift * 0.06}), 0 0 ${130 + glowLift * 40}px rgba(58,12,163,${0.32 + glowLift * 0.12}), 0 0 ${200 + glowLift * 60}px rgba(131,56,236,${0.08 + glowLift * 0.08})`,
          }}
        >
          {/* Glass edge highlight — top edge catch light */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
              background: `linear-gradient(90deg, transparent 5%, rgba(255,255,255,${0.12 + glowLift * 0.08}) 30%, rgba(255,255,255,${0.18 + glowLift * 0.1}) 50%, rgba(255,255,255,${0.12 + glowLift * 0.08}) 70%, transparent 95%)`,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />
          <BrowserChrome />

          <div
            style={{
              width: '100%',
              height: VP_CONTENT_H,
              overflow: 'hidden',
              position: 'relative',
              background: '#050505',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: CONTENT_OFFSET_X,
                top: CONTENT_OFFSET_Y,
                width: SITE_PREVIEW_WIDTH,
                height: SITE_PREVIEW_HEIGHT,
                transform: `scale(${CONTENT_SCALE})`,
                transformOrigin: 'top left',
              }}
            >
              <SitePreviewPage
                pathname={path}
                scrollProgress={scrollProgress}
                previewStyle={previewStyle}
              />
            </div>
          </div>
        </div>
      </AbsoluteFill>

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
          {urlLabel}
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
      <span style={{ fontFamily: orbitron, fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.01em' }}>
        successorsf1.com
      </span>
    </div>
  </div>
);
