export const theme = {
  colors: {
    bg: '#050505',
    surface: '#0a0a0a',
    surfaceRaised: '#141414',
    purple: '#3A0CA3',
    purpleSoft: '#8338ec',
    purpleGlow: 'rgba(131, 56, 236, 0.45)',
    purpleGlowStrong: 'rgba(131, 56, 236, 0.7)',
    gold: '#E5B80B',
    goldWarm: '#ffb700',
    goldGlow: 'rgba(229, 184, 11, 0.45)',
    white: '#ffffff',
    textDim: 'rgba(255,255,255,0.75)',
    muted: 'rgba(255,255,255,0.5)',
    border: 'rgba(255,255,255,0.08)',
    borderPurple: 'rgba(131, 56, 236, 0.35)',
    borderGold: 'rgba(229, 184, 11, 0.35)',
  },
  fonts: {
    heading: 'Orbitron, sans-serif',
    body: 'Montserrat, sans-serif',
  },
} as const;

export type Theme = typeof theme;
