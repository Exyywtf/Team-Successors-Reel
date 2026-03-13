"use client";

import Image from "next/image";
import Card from "@/components/ui/Card";
import Container from "@/components/layout/Container";
import { CARD_DELAY_AFTER_HEADER } from "@/components/motion";
import Reveal from "@/components/Reveal";
import Section from "@/components/layout/Section";

const ROADMAP_TITLE = "Season Roadmap";
const ROADMAP_SUBTITLE =
  "Our strategic project phases from team orientation to the starting grid.";

const ROW_1_WITH_CAR_IMAGE_SRC = "/brand/roadmap/timeline-row1-with-car.png";
const ROW_2_IMAGE_SRC = "/brand/roadmap/timeline-row2.png";
const TIMELINE_IMAGE_SIZES = "(max-width: 768px) 100vw, 900px";

// Pre-computed aspect ratios to prevent layout shift during loading
const ROW_1_ASPECT_RATIO = "30 / 6";
const ROW_2_ASPECT_RATIO = "30 / 6";

/**
 * SeasonRoadmap Component
 * 
 * visualization of the team's journey.
 * Uses optimized Next.js images with intrinsic aspect ratios to maintain layout stability.
 */

export default function SeasonRoadmap() {
  return (
    <Section
      atmoId="home-season-roadmap"
      className="flow-root relative z-10 bg-transparent"
      title={ROADMAP_TITLE}
      subtitle={ROADMAP_SUBTITLE}
    >
      <Container>
        <div className="mx-auto max-w-[1200px]">
          <Reveal
            variant="fadeUp"
            delay={CARD_DELAY_AFTER_HEADER}
            startChildrenAt={0.7}
          >
            <div className="grid gap-6">
              <Card className="card-pad-dense hover-info-v1" cardType="info">
                <div
                  className="relative w-full overflow-hidden min-h-[96px] md:min-h-[120px] lg:min-h-[140px] lg:max-w-[72%] xl:max-w-[66%] mx-auto"
                  style={{ aspectRatio: ROW_1_ASPECT_RATIO }}
                >
                  <Image
                    src={ROW_1_WITH_CAR_IMAGE_SRC}
                    alt="Season roadmap timeline row 1"
                    fill
                    priority
                    sizes={TIMELINE_IMAGE_SIZES}
                    className="pointer-events-none object-contain object-center origin-center select-none"
                  />
                </div>
              </Card>

              <Card className="card-pad-dense hover-info-v1" cardType="info">
                <div
                  className="relative w-full overflow-hidden min-h-[96px] md:min-h-[120px] lg:min-h-[140px] lg:max-w-[72%] xl:max-w-[66%] mx-auto"
                  style={{ aspectRatio: ROW_2_ASPECT_RATIO }}
                >
                  <Image
                    src={ROW_2_IMAGE_SRC}
                    alt="Season roadmap timeline row 2"
                    fill
                    loading="eager"
                    sizes={TIMELINE_IMAGE_SIZES}
                    className="pointer-events-none object-contain object-center origin-center select-none"
                  />
                </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
