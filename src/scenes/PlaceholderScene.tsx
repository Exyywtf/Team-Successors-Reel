import React from 'react';
import { AbsoluteFill } from 'remotion';
import { theme } from '../lib/theme';
import { orbitron } from '../lib/fonts';

interface PlaceholderSceneProps {
  label: string;
  color?: string;
}

export const PlaceholderScene: React.FC<PlaceholderSceneProps> = ({
  label,
  color = theme.colors.purpleSoft,
}) => (
  <AbsoluteFill
    style={{
      background: theme.colors.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        border: `1px solid ${color}`,
        borderRadius: 20,
        padding: '32px 56px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        opacity: 0.5,
      }}
    >
      <div
        style={{
          fontFamily: orbitron,
          fontSize: 22,
          fontWeight: 700,
          color,
          letterSpacing: '0.1em',
          textAlign: 'center',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: orbitron,
          fontSize: 13,
          color: theme.colors.muted,
          letterSpacing: '0.12em',
        }}
      >
        COMING IN PHASE 2
      </div>
    </div>
  </AbsoluteFill>
);
