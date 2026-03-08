import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SCENES, dur } from '../lib/timing';
import { theme } from '../lib/theme';
import { S01UrlIntro } from '../scenes/S01UrlIntro';
import { S02HeroReveal } from '../scenes/S02HeroReveal';
import { S03Engineering } from '../scenes/S03Engineering';
import { S04DesktopShowcase } from '../scenes/S04DesktopShowcase';
import { S05MetricsRoadmap } from '../scenes/S05MetricsRoadmap';
import { S06CtaEndFrame } from '../scenes/S06CtaEndFrame';

export const Reel: React.FC = () => (
  <AbsoluteFill style={{ background: theme.colors.bg }}>
    {/* ── S01: URL Search Intro · 0:00–0:02.4 ─────────────────────────────── */}
    <Sequence from={SCENES.S01.start} durationInFrames={dur('S01')}>
      <S01UrlIntro />
    </Sequence>

    {/* ── S02: Hero Reveal · 0:02.1–0:08.1 ────────────────────────────────── */}
    {/* 10-frame overlap with S01 for bloom push-through transition */}
    <Sequence from={SCENES.S02.start} durationInFrames={dur('S02')}>
      <S02HeroReveal />
    </Sequence>

    {/* ── S03: Engineering · 0:08.1–0:14.1 ────────────────────────────────── */}
    <Sequence from={SCENES.S03.start} durationInFrames={dur('S03')}>
      <S03Engineering />
    </Sequence>

    {/* ── S04: Desktop Website Showcase · 0:14.1–0:17.0 ───────────────────── */}
    <Sequence from={SCENES.S04.start} durationInFrames={dur('S04')}>
      <S04DesktopShowcase />
    </Sequence>

    {/* ── S05: Metrics & Roadmap · 0:17.0–0:19.4 ──────────────────────────── */}
    <Sequence from={SCENES.S05.start} durationInFrames={dur('S05')}>
      <S05MetricsRoadmap />
    </Sequence>

    {/* ── S06: CTA End Frame · 0:19.4–0:22.0 ──────────────────────────────── */}
    <Sequence from={SCENES.S06.start} durationInFrames={dur('S06')}>
      <S06CtaEndFrame />
    </Sequence>
  </AbsoluteFill>
);
