import React from 'react';
import { Img, staticFile, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { heroSpring } from '../lib/springs';

interface LogoMarkProps {
  size?: number;
  glowColor?: string;
  delay?: number;
}

export const LogoMark: React.FC<LogoMarkProps> = ({
  size = 120,
  glowColor = 'rgba(131, 56, 236, 0.5)',
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: heroSpring,
    durationInFrames: 40,
  });

  const scale = progress > 0.96 ? 1 : 0.6 + progress * 0.4;
  const opacity = progress > 0.96 ? 1 : progress;

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${scale})`,
        opacity,
        filter: glowColor ? `drop-shadow(0 0 20px ${glowColor})` : undefined,
      }}
    >
      <Img
        src={staticFile('assets/logo.svg')}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};
