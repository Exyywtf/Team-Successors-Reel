import React from 'react';

interface TypewriterResult {
  visible: string;
  /** True while still typing or just finished (before cursor hides) */
  showCursor: boolean;
}

/**
 * Pure hook — no render, no spring, just frame math.
 * Returns the visible substring and cursor state.
 */
export function useTypewriter(
  text: string,
  frame: number,
  startFrame: number,
  framesPerChar: number,
  cursorHideAfter?: number
): TypewriterResult {
  const elapsed = Math.max(0, frame - startFrame);
  const charCount = Math.min(Math.floor(elapsed / framesPerChar), text.length);
  const doneAt = text.length * framesPerChar;
  const showCursor =
    cursorHideAfter !== undefined
      ? elapsed < doneAt + cursorHideAfter
      : elapsed <= doneAt + 20;

  return {
    visible: text.slice(0, charCount),
    showCursor,
  };
}

interface TypewriterTextProps {
  text: string;
  frame: number;
  startFrame?: number;
  framesPerChar?: number;
  cursorHideAfter?: number;
  color?: string;
  cursorColor?: string;
  fontFamily?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  letterSpacing?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  frame,
  startFrame = 0,
  framesPerChar = 2.5,
  cursorHideAfter = 20,
  color = '#ffffff',
  cursorColor,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
}) => {
  const { visible, showCursor } = useTypewriter(
    text,
    frame,
    startFrame,
    framesPerChar,
    cursorHideAfter
  );

  // Cursor blinks every 15 frames
  const cursorVisible = showCursor && Math.floor(frame / 15) % 2 === 0;

  return (
    <span
      style={{
        fontFamily,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        whiteSpace: 'nowrap',
      }}
    >
      {visible}
      <span
        style={{
          display: 'inline-block',
          width: '2px',
          height: '1em',
          background: cursorColor ?? color,
          marginLeft: '2px',
          verticalAlign: 'text-bottom',
          opacity: cursorVisible ? 1 : 0,
          transition: 'none',
        }}
      />
    </span>
  );
};
