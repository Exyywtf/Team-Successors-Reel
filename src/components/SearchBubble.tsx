import React from 'react';
import { theme } from '../lib/theme';

interface SearchBubbleProps {
  children: React.ReactNode;
  /** 0–1 glow intensity */
  glowIntensity?: number;
  width?: number;
  height?: number;
}

export const SearchBubble: React.FC<SearchBubbleProps> = ({
  children,
  glowIntensity = 1,
  width = 700,
  height = 72,
}) => {
  const glow = `0 0 ${40 * glowIntensity}px rgba(131,56,236,${0.55 * glowIntensity}), 0 0 ${80 * glowIntensity}px rgba(131,56,236,${0.25 * glowIntensity})`;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 999,
        background: 'linear-gradient(180deg, rgba(18,18,24,0.88) 0%, rgba(10,10,14,0.84) 100%)',
        border: `1.5px solid rgba(131,56,236,${0.5 * glowIntensity})`,
        boxShadow: glow,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 28,
        paddingRight: 28,
        gap: 16,
        overflow: 'hidden',
      }}
    >
      {/* Search icon — minimal circle + line */}
      <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        style={{ flexShrink: 0, opacity: 0.5 }}
      >
        <circle cx="8.5" cy="8.5" r="5.5" stroke={theme.colors.muted} strokeWidth="1.5" />
        <line
          x1="12.5"
          y1="12.5"
          x2="18"
          y2="18"
          stroke={theme.colors.muted}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* URL text slot */}
      <div style={{ flex: 1, overflow: 'hidden' }}>{children}</div>

    </div>
  );
};
