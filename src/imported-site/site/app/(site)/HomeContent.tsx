"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import DeckCTA from "@/components/DeckCTA";
import ImageWithFallback from "@/components/ImageWithFallback";
import Reveal from "@/components/Reveal";
import Section from "@/components/layout/Section";
import StatPills from "@/components/StatPills";
import TextReveal from "@/components/TextReveal";
import dynamic from "next/dynamic";
const F1InSchoolsIntro = dynamic(
  () => import("@/components/sections/F1InSchoolsIntro"),
);
const SeasonRoadmap = dynamic(
  () => import("@/components/sections/SeasonRoadmap"),
);
import { buttonClasses } from "@/components/ui/Button";
import EnterpriseBulletList from "@/components/ui/EnterpriseBulletList";
import CountUpText, {
  splitLeadingCountUpMetric,
} from "@/components/ui/CountUpText";
import {
  CARD_DELAY_AFTER_HEADER,
  SECTION_SUBTITLE_WORD_DURATION,
  SECTION_TITLE_WORD_STAGGER,
  SUBTITLE_DELAY_AFTER_TITLE,
  stagger,
} from "@/components/motion";
import { siteContent } from "@/lib/content";
import { SHOW_PARTNERSHIP_DECK } from "@/lib/featureFlags";

/**
 * HomeContent
 *
 * The main landing experience. Composed of:
 * 1. Hero (Immediate load, LCP optimized)
 * 2. Intro & Roadmap (Lazy loaded via dynamic imports for TBT reduction)
 * 3. Feature Sections (Sponsors, Highlights, Engineering, Outreach)
 *
 * Uses 'TextReveal' and 'Reveal' components to orchestrate entrance animations on scroll.
 */
export default function HomeContent() {
  const { hero, home, sponsors, enterprisePage } = siteContent;
  const [highlightsCountStart, setHighlightsCountStart] = useState(false);
  const [outreachCountStart, setOutreachCountStart] = useState(false);
  const heroHeadlinePrimaryDelay = 0.1;
  const heroHeadlineSecondaryDelay = 0.25;
  const heroSubheadlineDelay = 0.5;
  const heroSubheadlineDuration = 1.0;
  const heroTextStagger = stagger.tight;
  const heroButtonsStagger = stagger.tight;
  const heroSubheadlineWordCount = hero.subheadline.trim().split(/\s+/).length;
  const heroSubheadlineCompletionDelay =
    heroSubheadlineDelay +
    Math.max(0, heroSubheadlineWordCount - 1) * heroTextStagger +
    heroSubheadlineDuration;
  const heroPrimaryButtonDelay = heroSubheadlineCompletionDelay;
  const heroSecondaryButtonDelay = heroPrimaryButtonDelay + heroButtonsStagger;

  return (
    <>
      <div data-home-hero-wrap className="relative overflow-hidden">
        <section
          data-atmosphere-hero
          className="hero-stage relative z-10 isolate flex min-h-[var(--hero-stage-height)] items-end overflow-hidden bg-transparent pb-16 pt-[var(--hero-pt-mobile)] md:pb-24 md:pt-[var(--hero-pt-desktop)] lg:pb-28"
        >
          {/* <HeroBackgroundVideo /> - Moved to persistent layout to prevent flickering */}
          <Container className="relative z-20">
            <div className="max-w-[1200px]">
              <div className="hero-ornament-column max-w-4xl">
                <Reveal variant="fadeIn" delay={0.1}>
                  <p className="type-label mb-5 text-[14px] text-[var(--accent)]">
                    Successors
                  </p>
                </Reveal>

                <h1 className="type-display">
                  <TextReveal
                    as="span"
                    delay={heroHeadlinePrimaryDelay}
                    priority
                    className="block lg:inline"
                  >
                    Inheriting the Legacy.
                  </TextReveal>{" "}
                  <TextReveal
                    as="span"
                    delay={heroHeadlineSecondaryDelay}
                    priority
                    className="block lg:inline"
                  >
                    Defining the Future.
                  </TextReveal>
                </h1>

                <div className="mt-5 max-w-2xl">
                  <TextReveal
                    as="p"
                    className="type-subtitle"
                    delay={heroSubheadlineDelay}
                    duration={heroSubheadlineDuration}
                    stagger={heroTextStagger}
                    priority
                  >
                    {hero.subheadline}
                  </TextReveal>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Reveal
                    variant="fadeUp"
                    delay={heroPrimaryButtonDelay}
                    triggerMode="immediate"
                    revealId="hero-cta-primary"
                  >
                    <Link
                      href={hero.ctaPrimary.href}
                      className={buttonClasses({
                        variant: "primary",
                        size: "lg",
                        className: "hero-cta-button",
                      })}
                    >
                      {hero.ctaPrimary.label}
                    </Link>
                  </Reveal>
                  <Reveal
                    variant="fadeUp"
                    delay={heroSecondaryButtonDelay}
                    triggerMode="immediate"
                    revealId="hero-cta-secondary"
                  >
                    <Link
                      href={hero.ctaSecondary.href}
                      className={buttonClasses({
                        variant: "gold",
                        size: "lg",
                        className: "hero-cta-button",
                      })}
                    >
                      {hero.ctaSecondary.label}
                    </Link>
                  </Reveal>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <F1InSchoolsIntro />
        <SeasonRoadmap />

        <Section
          atmoId="home-sponsor-strip"
          className="flow-root relative z-10 bg-transparent"
        >
          <Container>
            <Reveal variant="fadeIn">
              <div className="mx-auto mb-[calc(var(--section-header-gap)*1.12)] max-w-[1200px] px-5 sm:px-7 lg:px-12 2xl:px-14">
                <h2 className="gold-underline type-title">
                  Sponsor Trust Strip
                </h2>
                <TextReveal
                  as="p"
                  className="type-subtitle mt-[calc(var(--section-header-gap)*0.52)] max-w-3xl"
                  type="words"
                  stagger={SECTION_TITLE_WORD_STAGGER}
                  duration={SECTION_SUBTITLE_WORD_DURATION}
                  delay={SUBTITLE_DELAY_AFTER_TITLE}
                >
                  {home.sponsorStripTitle}
                </TextReveal>
                <div
                  className="divider-soft mt-[calc(var(--section-header-gap)*0.82)]"
                  aria-hidden
                />
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {sponsors.map((sponsor, index) => (
                  <Reveal
                    key={sponsor.name}
                    delay={CARD_DELAY_AFTER_HEADER + index * 0.06}
                    variant="fadeUp"
                  >
                    <Card
                      className="card-pad-default hover-info-v1 flex items-center justify-center"
                      cardType="info"
                    >
                      <div
                        className="sponsor-logo-frame"
                        data-sponsor-size="strip"
                      >
                        <ImageWithFallback
                          src={sponsor.logo}
                          alt={`${sponsor.name} sponsor logo`}
                          width={180}
                          height={72}
                          className="sponsor-logo-image media-fade-hover"
                          data-sponsor-size="strip"
                        />
                      </div>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </Reveal>
          </Container>
        </Section>
      </div>

      <Section
        atmoId="home-highlights"
        title="Highlights"
        subtitle="High-performance execution across engineering, enterprise, and outreach."
      >
        <Container>
          <Reveal
            variant="stagger"
            delay={CARD_DELAY_AFTER_HEADER}
            startChildrenAt={0.6}
            onRevealProgress={() => setHighlightsCountStart(true)}
            onRevealComplete={() => setHighlightsCountStart(true)}
          >
            <div className="bento-grid">
              {home.highlights.map((item) => {
                const countUpMetric = splitLeadingCountUpMetric(item.metric);
                const metricLabel =
                  countUpMetric?.trailingText.trimStart() ?? "";
                const isToleranceMetric =
                  item.metric.trim().toLowerCase() === "0.1mm tolerance target";
                const isStaticQ2Metric =
                  item.metric.trim().toUpperCase() === "Q2 RACE WINDOW";

                return (
                  <Card
                    key={item.title}
                    className="card-pad-default hover-info-v1 md:col-span-3"
                    cardType="feature"
                  >
                    <p className="tier-chip mb-4 w-fit">
                      {countUpMetric ? (
                        <>
                          <CountUpText
                            from={countUpMetric.preset.from}
                            to={countUpMetric.preset.to}
                            durationMs={countUpMetric.preset.durationMs}
                            start={highlightsCountStart}
                            startDelayMs={0}
                            decimals={countUpMetric.preset.decimals}
                            direction={countUpMetric.preset.direction}
                            prefix={countUpMetric.preset.prefix}
                            suffix={countUpMetric.preset.suffix}
                            ariaLabel={countUpMetric.preset.ariaLabel}
                            reserveWidth={!isToleranceMetric}
                          />
                          {metricLabel ? (
                            <span className="ml-1">{metricLabel}</span>
                          ) : null}
                        </>
                      ) : isStaticQ2Metric ? (
                        <>
                          <span
                            role="text"
                            aria-label={item.metric}
                            className="tabular-nums font-extrabold"
                          >
                            Q2
                          </span>
                          <span className="ml-1">Race Window</span>
                        </>
                      ) : (
                        item.metric
                      )}
                    </p>
                    <h3 className="font-heading text-xl">{item.title}</h3>
                    <p className="copy-sm mt-3">{item.description}</p>
                  </Card>
                );
              })}
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section
        atmoId="home-engineering-snapshot"
        title="Engineering Snapshot"
        subtitle="From CAD to CFD to CNC, every phase is tightly measured."
      >
        <Container>
          <Reveal variant="stagger" delay={CARD_DELAY_AFTER_HEADER}>
            <div className="grid gap-4 md:grid-cols-3">
              {home.engineeringSnapshot.map((item) => (
                <Card
                  key={item.stage}
                  className="card-pad-default hover-info-v1"
                  cardType="feature"
                >
                  <p className="font-heading eyebrow text-[var(--accent)]">
                    {item.stage}
                  </p>
                  <p className="copy-sm mt-4">{item.detail}</p>
                </Card>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section
        atmoId="home-outreach"
        title={home.outreachSnapshot.title}
        subtitle={home.outreachSnapshot.description}
        headerClassName="lg:[&_.type-subtitle]:max-w-none lg:[&_.type-subtitle]:whitespace-nowrap"
      >
        <Container>
          <Reveal
            variant="fadeUp"
            delay={CARD_DELAY_AFTER_HEADER}
            startChildrenAt={0.7}
            onRevealProgress={() => setOutreachCountStart(true)}
            onRevealComplete={() => setOutreachCountStart(true)}
          >
            <div className="grid gap-6 lg:grid-cols-[1.35fr,1fr]">
              <Card className="card-pad-default hover-info-v1" cardType="info">
                <EnterpriseBulletList
                  items={home.outreachSnapshot.bullets}
                  itemKeyPrefix="home-outreach"
                />
              </Card>
              <Card className="card-pad-default hover-info-v1" cardType="info">
                <p className="eyebrow mb-4 muted-copy">Trust Metrics</p>
                <StatPills
                  stats={enterprisePage.stats}
                  countUpStart={outreachCountStart}
                  countUpStartDelayMs={0}
                />
              </Card>
            </div>
          </Reveal>
        </Container>
      </Section>

      {SHOW_PARTNERSHIP_DECK ? (
        <Section atmoId="home-partnership-deck">
          <Container>
            <Reveal
              variant="scaleIn"
              sectionType="showcase"
              delay={CARD_DELAY_AFTER_HEADER}
            >
              <Card className="card-pad-roomy hover-info-v1" cardType="feature">
                <p className="eyebrow text-[var(--accent)]">
                  {home.deck.title}
                </p>
                <h2 className="gold-underline mt-3 font-heading text-2xl sm:text-3xl">
                  Sponsor With Clear Outcomes
                </h2>
                <p className="copy-sm mt-3 max-w-2xl">
                  {home.deck.description}
                </p>
                <div className="mt-6">
                  <DeckCTA />
                </div>
              </Card>
            </Reveal>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
