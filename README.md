# TeamSuccessorsReel

Premium Remotion-based social promo reel workspace for Team Successors. This repository is intentionally separate from the main website repository so reel production can move independently.

## Why this repo exists

The reel has a different workflow from the website: frame-accurate sequencing, motion tuning, and render/export iteration. Keeping this codebase isolated makes it safer to experiment on scenes, timings, and visual direction without coupling those changes to website delivery.

## Current status

- In-progress production base for a premium vertical reel.
- Active composition: `SuccessorsReel` in `1080x1920`, `30fps`, `660` total frames (~22s).
- Core scene stack, shared components, theme tokens, motion helpers, and local assets are in place.
- Timing is currently mid-refinement: scene comments in some files are older than the sequence wiring, so treat `src/compositions/Reel.tsx` and `src/lib/timing.ts` as the source of truth.

## What's in the reel

Current render order in `src/compositions/Reel.tsx`:

1. `S01UrlIntro` - URL search bubble intro with typewriter and atmospheric bloom.
2. `S02HeroReveal` - hero video reveal with logo, headline, and team positioning copy.
3. `S03Engineering` - engineering proof sequence (CFD visual + design/validation cards).
4. `S04DesktopShowcase` - 2.5D desktop website showcase with parallax and sponsor section reveal.
5. `S05MetricsRoadmap` - rapid impact beats (nationals, impressions, student reach).
6. `S06CtaEndFrame` - sponsor-focused CTA end frame with URL and partner logos.

## Project structure

```text
TeamSuccessorsReel/
  public/
    assets/                  # Local reel assets (video, images, SVG logos)
  src/
    compositions/
      Reel.tsx               # Main scene assembly using Sequences
    scenes/                  # Scene-level motion and layout
    components/              # Reusable visual building blocks
    lib/                     # Timing map, springs, theme, fonts, helpers
    Root.tsx                 # Composition registration (SuccessorsReel)
    index.ts                 # Remotion entry
  remotion.config.ts         # Remotion CLI config + Tailwind integration
  package.json               # Scripts and dependencies
```

## Assets

All reel media required for rendering is stored locally under `public/assets`. This includes hero media, engineering visuals, timeline graphics, and sponsor marks used by the current scenes. Assets are kept inside this repository so renders are reproducible without dependency on the website repo.

## Development

Install dependencies:

```bash
npm install
```

Start Remotion Studio:

```bash
npm run dev
```

Type/lint check:

```bash
npm run lint
```

Bundle project:

```bash
npm run build
```

## Rendering

Render the current composition to MP4:

```bash
npx remotion render SuccessorsReel out/TeamSuccessorsReel.mp4
```

## Tech stack

- Remotion `4.0.434` + `@remotion/cli`
- React `19.2.3` + React DOM
- TypeScript `5.9`
- Tailwind CSS `v4` via `@remotion/tailwind-v4`
- Google font loading via `@remotion/google-fonts` (Orbitron, Montserrat)
- ESLint + Prettier for code quality

## Notes for future edits

- Keep timeline edits centralized in `src/lib/timing.ts`, then verify scene sequencing in `src/compositions/Reel.tsx`.
- Treat scene-level frame comments as advisory and re-sync them whenever timings change.
- Reuse `src/lib/springs.ts`, `src/lib/theme.ts`, and `src/lib/fonts.ts` before adding one-off motion/style values.
- Preserve visual continuity between scenes, especially overlap transitions and fade envelopes.
- Keep all new reel media in `public/assets` and reference via `staticFile(...)` for deterministic renders.

## Website repo separation

This reel repo is separate from the main Team Successors website repo. Work done here should not modify `C:\Users\Admin\dev\TeamSuccessors`.
