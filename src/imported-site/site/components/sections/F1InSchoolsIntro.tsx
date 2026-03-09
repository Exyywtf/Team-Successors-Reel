"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Container from "@/components/layout/Container";
import { CARD_DELAY_AFTER_HEADER } from "@/components/motion";
import Reveal from "@/components/Reveal";
import Section from "@/components/layout/Section";
import CountUpText from "@/components/ui/CountUpText";

const F1_IN_SCHOOLS_DESCRIPTION =
  "Running in the UAE since 2009, the Formula 1\u00AE STEM Challenge is one of the biggest international STEAM competitions in the world, seeing teams of 3 to 6 students plan, research, design, analyse, manufacture and test a miniature 'F1\u00AE car' using CAD/CAM/CNC tools.";
const F1_IN_SCHOOLS_SUBHEADING =
  "The World\u2019s Largest International STEM Challenge.";

const IMPACT_STATS = [
  {
    to: 113,
    label: "Schools Participating",
    ariaLabel: "113",
    suffix: "",
    durationMs: 800,
  },
  {
    to: 1140,
    label: "Students Participating",
    ariaLabel: "1,140",
    suffix: "",
    durationMs: 900,
  },
  {
    to: 85,
    label: "National Teams",
    ariaLabel: "85",
    suffix: "",
    durationMs: 800,
  },
  {
    to: 31000,
    label: "Online Views",
    ariaLabel: "31,000+",
    suffix: "+",
    durationMs: 900,
  },
] as const;

export default function F1InSchoolsIntro() {
  const [showStats, setShowStats] = useState(false);

  return (
    <Section
      atmoId="home-f1-in-schools"
      className="flow-root relative z-10 bg-transparent"
      title="What is F1 in Schools"
      subtitle={F1_IN_SCHOOLS_SUBHEADING}
    >
      <Container>
        <div className="mx-auto max-w-[1200px]">
          <Reveal
            variant="fadeUp"
            delay={CARD_DELAY_AFTER_HEADER}
            startChildrenAt={0.7}
            onRevealProgress={() => setShowStats(true)}
            onRevealComplete={() => setShowStats(true)}
          >
            <Card className="card-pad-default hover-info-v1" cardType="info">
              <p className="copy-sm max-w-4xl">{F1_IN_SCHOOLS_DESCRIPTION}</p>
            </Card>
          </Reveal>

          <div className="mt-6 sm:mt-8">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {IMPACT_STATS.map((stat, index) => (
                <Reveal
                  key={stat.label}
                  variant="fadeUp"
                  delay={CARD_DELAY_AFTER_HEADER + index * 0.06}
                  animate={showStats ? "visible" : "hidden"}
                >
                  <Card
                    className="card-pad-default hover-info-v1"
                    cardType="info"
                  >
                    <p className="font-heading text-2xl text-[var(--accent)] sm:text-3xl">
                      <CountUpText
                        to={stat.to}
                        durationMs={stat.durationMs}
                        start={showStats}
                        startDelayMs={0}
                        suffix={stat.suffix}
                        ariaLabel={stat.ariaLabel}
                      />
                    </p>
                    <p className="copy-sm mt-2">{stat.label}</p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
