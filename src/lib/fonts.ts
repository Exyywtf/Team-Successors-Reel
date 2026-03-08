// Loaded at module level so Remotion can prefetch before render.
// Only exact weights/subsets needed — no overhead from unused variants.
import { loadFont as loadOrbitron } from '@remotion/google-fonts/Orbitron';
import { loadFont as loadMontserrat } from '@remotion/google-fonts/Montserrat';

export const { fontFamily: orbitron } = loadOrbitron('normal', {
  weights: ['700', '900'],
  subsets: ['latin'],
});

export const { fontFamily: montserrat } = loadMontserrat('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});
