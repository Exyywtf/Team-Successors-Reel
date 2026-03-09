import type { SpringConfig } from 'remotion';

/** Hero-scale entries: smooth settle, slight overshoot allowed */
export const heroSpring: SpringConfig = {
  damping: 20,
  stiffness: 180,
  mass: 1,
  overshootClamping: false,
};

/** Card entries: snappy with minimal bounce */
export const cardSpring: SpringConfig = {
  damping: 28,
  stiffness: 280,
  mass: 0.8,
  overshootClamping: false,
};

/** Smooth glide — high damping, no overshoot, for card entries that settle cleanly */
export const glideSpring: SpringConfig = {
  damping: 34,
  stiffness: 150,
  mass: 1,
  overshootClamping: true,
};

/** Ultra-snappy slam entries */
export const snappySpring: SpringConfig = {
  damping: 40,
  stiffness: 420,
  mass: 0.6,
  overshootClamping: true,
};

/** Soft reveal / fade-in style */
export const softSpring: SpringConfig = {
  damping: 35,
  stiffness: 120,
  mass: 1.2,
  overshootClamping: true,
};
