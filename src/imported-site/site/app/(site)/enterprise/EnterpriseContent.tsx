"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Container from "@/components/layout/Container";
import GalleryGrid from "@/components/GalleryGrid";
import { CARD_DELAY_AFTER_HEADER } from "@/components/motion";
import Reveal from "@/components/Reveal";
import Section from "@/components/layout/Section";
import StatPills from "@/components/StatPills";
import EnterpriseBulletList from "@/components/ui/EnterpriseBulletList";
import CountUpText, { getCountUpPreset } from "@/components/ui/CountUpText";
import { siteContent } from "@/lib/content";

export default function EnterpriseContent() {
  const { enterprisePage } = siteContent;
  const [tiersCountStart, setTiersCountStart] = useState(false);
  const [performanceCountStart, setPerformanceCountStart] = useState(false);

  return (
    <>
      <Section
        atmoId="enterprise-overview"
        title={enterprisePage.title}
        subtitle={enterprisePage.subtitle}
      >
        <Container>
          <Reveal delay={CARD_DELAY_AFTER_HEADER}>
            <Card className="card-pad-roomy hover-info-v2">
              <p className="copy-sm">{enterprisePage.pitch}</p>
            </Card>
          </Reveal>
        </Container>
      </Section>

      <Section
        atmoId="enterprise-tiers"
        title="Sponsorship Tiers"
        subtitle="Flexible packages designed for depth, visibility, and trust."
      >
        <Container>
          <Reveal
            delay={CARD_DELAY_AFTER_HEADER}
            startChildrenAt={0.7}
            onRevealProgress={() => setTiersCountStart(true)}
            onRevealComplete={() => setTiersCountStart(true)}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {enterprisePage.tiers.map((tier) => {
                const tierPreset = getCountUpPreset(tier.minimumAed);

                return (
                  <Card
                    key={tier.name}
                    className="card-pad-default hover-info-v2"
                    cardType="pricing"
                  >
                    <p className="tier-chip mb-4 w-fit">
                      {tierPreset ? (
                        <CountUpText
                          from={tierPreset.from}
                          to={tierPreset.to}
                          durationMs={tierPreset.durationMs}
                          start={tiersCountStart}
                          startDelayMs={0}
                          decimals={tierPreset.decimals}
                          direction={tierPreset.direction}
                          prefix={tierPreset.prefix}
                          suffix={tierPreset.suffix}
                          ariaLabel={tierPreset.ariaLabel}
                        />
                      ) : (
                        tier.minimumAed
                      )}
                    </p>
                    <h3 className="font-heading text-xl">{tier.name}</h3>
                    <EnterpriseBulletList
                      items={tier.benefits}
                      className="mt-4"
                      itemKeyPrefix={tier.name}
                    />
                  </Card>
                );
              })}
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section
        atmoId="enterprise-performance"
        title="Performance and Reach"
        subtitle="High-performance engineering paired with measurable brand outcomes."
      >
        <Container>
          <Reveal
            delay={CARD_DELAY_AFTER_HEADER}
            startChildrenAt={0.7}
            onRevealProgress={() => setPerformanceCountStart(true)}
            onRevealComplete={() => setPerformanceCountStart(true)}
          >
            <Card className="card-pad-default hover-info-v2">
              <StatPills
                stats={enterprisePage.stats}
                countUpStart={performanceCountStart}
                countUpStartDelayMs={0}
              />
            </Card>
          </Reveal>
        </Container>
      </Section>

      <Section
        atmoId="enterprise-gallery"
        title="Strategic Outreach"
        subtitle="Building brand presence and driving community impact off the track."
      >
        <Container>
          <GalleryGrid
            items={enterprisePage.gallery}
            tabs={["All", "Events", "Outreach"] as const}
            defaultTab="All"
          />
        </Container>
      </Section>
    </>
  );
}
