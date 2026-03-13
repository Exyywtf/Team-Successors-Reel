import React from 'react';
import {theme} from '../lib/theme';

interface SearchBubbleProps {
  children: React.ReactNode;
  glowIntensity?: number;
  width?: number;
  height?: number;
  radius?: number;
  iconOffsetX?: number;
  iconScale?: number;
  contentOpacity?: number;
  contentTranslateX?: number;
}

export const SearchBubble: React.FC<SearchBubbleProps> = ({
  children,
  glowIntensity = 1,
  width = 700,
  height = 72,
  radius = height / 2,
  iconOffsetX = 0,
  iconScale = 1,
  contentOpacity = 1,
  contentTranslateX = 0,
}) => {
  const normalizedGlow = Math.min(Math.max(glowIntensity, 0), 1);
  const shellBorder = `rgba(255,255,255,${0.13 + normalizedGlow * 0.06})`;
  const shellGlowOpacity = 0.035 + normalizedGlow * 0.05;
  const shellShadow = [
    `0 20px 58px rgba(0,0,0,${0.58 + normalizedGlow * 0.08})`,
    `0 0 ${14 + normalizedGlow * 10}px rgba(131,56,236,${0.05 + normalizedGlow * 0.045})`,
    `0 0 ${20 + normalizedGlow * 12}px rgba(229,184,11,${0.012 + normalizedGlow * 0.014})`,
    'inset 0 1px 0 rgba(255,255,255,0.14)',
    `inset 0 0 0 1px rgba(131,56,236,${0.03 + normalizedGlow * 0.03})`,
    'inset 0 -18px 32px rgba(0,0,0,0.48)',
  ].join(', ');
  const textInsetLeft = Math.max(84, Math.round(height * 0.95));
  const iconSize = 23;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: radius,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -14,
          borderRadius: radius + 14,
          background:
            'radial-gradient(ellipse 58% 84% at 20% 50%, rgba(131,56,236,0.18) 0%, rgba(131,56,236,0.08) 42%, rgba(131,56,236,0) 78%), radial-gradient(ellipse 42% 58% at 82% 18%, rgba(229,184,11,0.10) 0%, rgba(229,184,11,0.035) 46%, rgba(229,184,11,0) 82%)',
          opacity: shellGlowOpacity,
          filter: 'blur(20px)',
          transform: 'scale(1.02)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          background:
            'linear-gradient(180deg, rgba(14,15,22,0.92) 0%, rgba(8,9,14,0.96) 42%, rgba(4,5,9,0.985) 100%)',
          border: `1px solid ${shellBorder}`,
          boxShadow: shellShadow,
          backdropFilter: 'blur(22px) saturate(122%)',
          WebkitBackdropFilter: 'blur(22px) saturate(122%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: -8,
          borderRadius: radius + 8,
          background:
            'radial-gradient(ellipse 62% 104% at 16% 50%, rgba(131,56,236,0.13) 0%, rgba(131,56,236,0.06) 34%, rgba(131,56,236,0.015) 58%, rgba(131,56,236,0) 82%), radial-gradient(ellipse 44% 62% at 84% 16%, rgba(229,184,11,0.09) 0%, rgba(229,184,11,0.032) 44%, rgba(229,184,11,0) 80%), linear-gradient(180deg, rgba(255,255,255,0.048) 0%, rgba(255,255,255,0.02) 32%, rgba(255,255,255,0.005) 100%)',
          opacity: 0.72,
          filter: 'blur(12px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 1,
          borderRadius: Math.max(0, radius - 1),
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.016) 28%, rgba(255,255,255,0) 58%)',
          maskImage:
            'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.58) 54%, rgba(0,0,0,0) 100%)',
          opacity: 0.88,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 1,
          right: 1,
          top: 1,
          height: Math.max(18, Math.round(height * 0.34)),
          borderRadius: Math.max(0, radius - 1),
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 42%, rgba(255,255,255,0) 100%)',
          opacity: 0.42 + normalizedGlow * 0.04,
          filter: 'blur(2px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: Math.round(height * 0.32),
          right: Math.round(height * 0.12),
          top: -3,
          height: Math.max(18, Math.round(height * 0.28)),
          borderRadius: 999,
          background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(131,56,236,0.032) 18%, rgba(255,255,255,0.034) 44%, rgba(229,184,11,0.065) 76%, rgba(255,255,255,0) 100%)',
          opacity: 0.18 + normalizedGlow * 0.04,
          filter: 'blur(5px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: -6,
          borderRadius: radius + 6,
          background:
            'linear-gradient(90deg, rgba(131,56,236,0.015) 0%, rgba(131,56,236,0.009) 26%, rgba(255,255,255,0) 46%, rgba(229,184,11,0.010) 74%, rgba(229,184,11,0.016) 100%)',
          mixBlendMode: 'screen',
          opacity: 0.62,
          filter: 'blur(10px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 8,
          bottom: 8,
          left: textInsetLeft - 16,
          right: 22,
          borderRadius: Math.max(18, radius - 10),
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.009) 0%, rgba(131,56,236,0.010) 20%, rgba(255,255,255,0.005) 48%, rgba(229,184,11,0.009) 82%, rgba(255,255,255,0.003) 100%)',
          opacity: 0.6,
          filter: 'blur(9px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: iconSize,
          height: iconSize,
          transform: `translate(-50%, -50%) translateX(${iconOffsetX}px) scale(${iconScale})`,
          transformOrigin: 'center center',
          opacity: 0.96,
          filter:
            'drop-shadow(0 0 7px rgba(255,255,255,0.11)) drop-shadow(0 0 10px rgba(131,56,236,0.08))',
        }}
      >
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 20 20"
          fill="none"
          shapeRendering="geometricPrecision"
        >
          <circle
            cx="8.2"
            cy="8.2"
            r="5.25"
            stroke={theme.colors.white}
            strokeOpacity="0.96"
            strokeWidth="1.55"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="12.2"
            y1="12.2"
            x2="17.6"
            y2="17.6"
            stroke={theme.colors.white}
            strokeOpacity="0.96"
            strokeWidth="1.55"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: textInsetLeft,
          right: 28,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          opacity: contentOpacity,
          transform: `translateX(${contentTranslateX}px)`,
          transformOrigin: 'left center',
          textShadow: '0 0 10px rgba(255,255,255,0.05)',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'geometricPrecision',
        }}
      >
        {children}
      </div>
    </div>
  );
};
