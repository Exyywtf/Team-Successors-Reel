import React from 'react';

interface GlowTextProps {
  text: string;
  size: number | string;
  color?: string;
  /** CSS color string for the glow, e.g. 'rgba(131,56,236,0.6)' */
  glowColor?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  letterSpacing?: string;
  textAlign?: React.CSSProperties['textAlign'];
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const GlowText: React.FC<GlowTextProps> = ({
  text,
  size,
  color = '#ffffff',
  glowColor,
  fontFamily,
  fontWeight = 700,
  letterSpacing,
  textAlign,
  style,
}) => {
  const textShadow = glowColor
    ? `0 0 20px ${glowColor}, 0 0 50px ${glowColor}, 0 0 90px ${glowColor}`
    : undefined;

  return (
    <div
      style={{
        fontFamily,
        fontSize: size,
        fontWeight,
        color,
        letterSpacing,
        textShadow,
        lineHeight: 1.0,
        textAlign,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
