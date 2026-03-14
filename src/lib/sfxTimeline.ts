import {SCENE_DURATIONS, TRANSITION_DURATIONS} from './timing';
import {
  URL_INTRO_TYPE_START,
  URL_INTRO_TEXT,
  URL_INTRO_FRAMES_PER_CHAR,
} from './urlIntroTiming';
import {ENABLE_SFX} from './sfxConfig';

export interface SfxCue {
  src: string;
  frame: number;
  volume: number;
  playbackRate?: number;
  fadeInFrames?: number;
  fadeOutFrames?: number;
  durationFrames?: number;
}

// Compute absolute start frame for each scene and transition in the reel.
// TransitionSeries overlaps: each transition eats into the end of the outgoing
// scene and the start of the incoming one. The effective start of scene N+1 is:
//   absStart[N+1] = absStart[N] + sceneDuration[N] - transitionDuration[N]
const sceneKeys = ['S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S07', 'S08', 'S09'] as const;
const transKeys = ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08'] as const;

function computeAbsoluteStarts() {
  const sceneStart: Record<string, number> = {};
  const transStart: Record<string, number> = {};

  sceneStart.S01 = 0;
  for (let i = 1; i < sceneKeys.length; i++) {
    const prevScene = sceneKeys[i - 1];
    const trans = transKeys[i - 1];
    sceneStart[sceneKeys[i]] =
      sceneStart[prevScene] +
      SCENE_DURATIONS[prevScene] -
      TRANSITION_DURATIONS[trans];
    transStart[trans] = sceneStart[sceneKeys[i]];
  }

  return {sceneStart, transStart};
}

const {sceneStart, transStart} = computeAbsoluteStarts();

// Helper: scene-relative frame → absolute
function s(scene: string, relativeFrame: number): number {
  return sceneStart[scene] + relativeFrame;
}

// Helper: transition midpoint (absolute)
function tMid(trans: string): number {
  const dur = TRANSITION_DURATIONS[trans as keyof typeof TRANSITION_DURATIONS];
  return transStart[trans] + Math.round(dur / 2);
}

// Build typing cues: one key-click per character
function buildTypingCues(): SfxCue[] {
  const cues: SfxCue[] = [];
  const charCount = URL_INTRO_TEXT.length;
  for (let i = 0; i < charCount; i++) {
    const vol = 0.06 + (i % 3 === 0 ? 0.02 : 0);
    cues.push({
      src: 'assets/sfx/key-click.mp3',
      frame: s('S01', URL_INTRO_TYPE_START + i * URL_INTRO_FRAMES_PER_CHAR),
      volume: vol,
    });
  }
  return cues;
}

export function buildSfxTimeline(): SfxCue[] {
  if (!ENABLE_SFX) return [];

  return [
    // ── S01 — URL Intro ──
    {src: 'assets/sfx/swoosh-simple.mp3', frame: s('S01', 6), volume: 0.12},
    {src: 'assets/sfx/tonal-whoosh.mp3', frame: s('S01', 12), volume: 0.08},
    ...buildTypingCues(),
    {src: 'assets/sfx/futuristic-type.mp3', frame: s('S01', URL_INTRO_TYPE_START), volume: 0.04, fadeInFrames: 3, fadeOutFrames: 5, durationFrames: 45},

    // ── T01 — pushBloom S01→S02 ──
    {src: 'assets/sfx/whoosh-clean.mp3', frame: tMid('T01'), volume: 0.10, fadeInFrames: 2, fadeOutFrames: 3, durationFrames: 20},

    // ── S02 — Desktop Showcase ──
    {src: 'assets/sfx/deep-swoosh.mp3', frame: s('S02', 8), volume: 0.08, fadeInFrames: 2, fadeOutFrames: 4, durationFrames: 25},
    {src: 'assets/sfx/swoosh-simple.mp3', frame: s('S02', 60), volume: 0.04},

    // ── T02 — depthWeld S02→S03 ──
    {src: 'assets/sfx/tonal-whoosh.mp3', frame: tMid('T02'), volume: 0.08, fadeInFrames: 2, fadeOutFrames: 3, durationFrames: 20},

    // ── S03 — Hero Reveal ──
    {src: 'assets/sfx/tonal-whoosh.mp3', frame: s('S03', 10), volume: 0.08, playbackRate: 0.8, fadeInFrames: 2, fadeOutFrames: 3, durationFrames: 20},

    // ── T03 — driftDissolve S03→S04 ──
    {src: 'assets/sfx/swoosh-simple.mp3', frame: tMid('T03'), volume: 0.08, fadeInFrames: 1, fadeOutFrames: 2, durationFrames: 20},

    // ── S04 — Timeline ──
    {src: 'assets/sfx/ui-click.mp3', frame: s('S04', 6), volume: 0.10},
    {src: 'assets/sfx/ui-click.mp3', frame: s('S04', 26), volume: 0.08},

    // ── T04 — pushBloom S04→S05 ──
    {src: 'assets/sfx/whoosh-clean.mp3', frame: tMid('T04'), volume: 0.10, fadeInFrames: 2, fadeOutFrames: 3, durationFrames: 20},

    // ── S05 — Enterprise 2.5D ──
    {src: 'assets/sfx/deep-swoosh.mp3', frame: s('S05', 8), volume: 0.08, fadeInFrames: 2, fadeOutFrames: 4, durationFrames: 25},
    {src: 'assets/sfx/swoosh-simple.mp3', frame: s('S05', 60), volume: 0.04},

    // ── T05 — depthWeld S05→S06 ──
    {src: 'assets/sfx/tonal-whoosh.mp3', frame: tMid('T05'), volume: 0.08, fadeInFrames: 2, fadeOutFrames: 3, durationFrames: 20},

    // ── S06 — Metrics ──
    {src: 'assets/sfx/whoosh-clean.mp3', frame: s('S06', 2), volume: 0.07, playbackRate: 1.3},
    {src: 'assets/sfx/ui-click.mp3', frame: s('S06', 19), volume: 0.05},
    {src: 'assets/sfx/whoosh-clean.mp3', frame: s('S06', 38), volume: 0.06, playbackRate: 1.3},
    {src: 'assets/sfx/ui-click.mp3', frame: s('S06', 57), volume: 0.05},

    // ── T06 — pushBloom S06→S07 ──
    {src: 'assets/sfx/whoosh-clean.mp3', frame: tMid('T06'), volume: 0.10, fadeInFrames: 2, fadeOutFrames: 3, durationFrames: 20},

    // ── S07 — Engineering 2.5D ──
    {src: 'assets/sfx/deep-swoosh.mp3', frame: s('S07', 8), volume: 0.08, fadeInFrames: 2, fadeOutFrames: 4, durationFrames: 25},
    {src: 'assets/sfx/swoosh-simple.mp3', frame: s('S07', 42), volume: 0.04},

    // ── T07 — depthWeld S07→S08 ──
    {src: 'assets/sfx/tonal-whoosh.mp3', frame: tMid('T07'), volume: 0.08, fadeInFrames: 2, fadeOutFrames: 3, durationFrames: 20},

    // ── S08 — Engineering Deep-Dive (191f) ──
    // Beta card appearance swell
    {src: 'assets/sfx/tonal-whoosh.mp3', frame: s('S08', 14), volume: 0.06, playbackRate: 0.85, fadeInFrames: 2, fadeOutFrames: 3, durationFrames: 20},
    {src: 'assets/sfx/ui-click.mp3', frame: s('S08', 16), volume: 0.06},
    {src: 'assets/sfx/ui-click.mp3', frame: s('S08', 24), volume: 0.05},
    // Gamma card appearance swell
    {src: 'assets/sfx/tonal-whoosh.mp3', frame: s('S08', 94), volume: 0.05, playbackRate: 0.85, fadeInFrames: 2, fadeOutFrames: 3, durationFrames: 20},
    // Morph/switch whoosh
    {src: 'assets/sfx/swoosh-simple.mp3', frame: s('S08', 96), volume: 0.06},
    {src: 'assets/sfx/ui-click.mp3', frame: s('S08', 96), volume: 0.06},
    {src: 'assets/sfx/ui-click.mp3', frame: s('S08', 104), volume: 0.05},

    // ── T08 — driftDissolve S08→S09 ──
    {src: 'assets/sfx/swoosh-simple.mp3', frame: tMid('T08'), volume: 0.06, fadeInFrames: 1, fadeOutFrames: 2, durationFrames: 20},

    // ── S09 — CTA End Frame ──
    {src: 'assets/sfx/deep-swoosh.mp3', frame: s('S09', 6), volume: 0.08, playbackRate: 0.75, fadeInFrames: 2, fadeOutFrames: 4, durationFrames: 25},
    {src: 'assets/sfx/tonal-whoosh.mp3', frame: s('S09', 22), volume: 0.06, fadeInFrames: 2, fadeOutFrames: 3, durationFrames: 20},
    {src: 'assets/sfx/ui-click.mp3', frame: s('S09', 46), volume: 0.04},
    {src: 'assets/sfx/ui-click.mp3', frame: s('S09', 53), volume: 0.04},
    {src: 'assets/sfx/ui-click.mp3', frame: s('S09', 60), volume: 0.04},
    {src: 'assets/sfx/ui-click.mp3', frame: s('S09', 67), volume: 0.04},
  ];
}
