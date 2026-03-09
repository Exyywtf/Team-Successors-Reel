import type { HTMLAttributes, ReactNode } from "react";
import {
  SECTION_SUBTITLE_WORD_DURATION,
  SECTION_TITLE_WORD_STAGGER,
  SUBTITLE_DELAY_AFTER_TITLE,
} from "@/components/motion";
import { cn } from "@/lib/utils";
import TextReveal from "@/components/TextReveal";

type SectionSpacing = "tight" | "default" | "hero";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  spacing?: SectionSpacing;
  headerClassName?: string;
  atmoSection?: boolean;
  atmoId?: string;
  atmoAnchorX?: string;
  atmoAnchorY?: string;
  atmoSpot?: string;
  atmoSpotY?: string;
}

export default function Section({
  id,
  title,
  subtitle,
  className,
  children,
  spacing = "default",
  headerClassName,
  atmoSection = true,
  atmoId,
  atmoAnchorX,
  atmoAnchorY,
  atmoSpot,
  atmoSpotY,
  ...props
}: SectionProps) {
  const spacingClass =
    spacing === "hero"
      ? "section-hero"
      : spacing === "tight"
        ? "section-tight"
        : "section-pad";

  return (
    <section
      id={id}
      className={cn(spacingClass, className)}
      data-atmo-section={atmoSection ? "1" : undefined}
      data-atmo-id={atmoSection ? atmoId : undefined}
      data-atmo-anchor-x={atmoSection ? (atmoAnchorX ?? atmoSpot) : undefined}
      data-atmo-anchor-y={atmoSection ? (atmoAnchorY ?? atmoSpotY) : undefined}
      data-atmo-spot={atmoSection ? atmoSpot : undefined}
      data-atmo-spot-y={atmoSection ? atmoSpotY : undefined}
      {...props}
    >
      {(title || subtitle) && (
        <div
          className={cn(
            "mx-auto mb-[calc(var(--section-header-gap)*1.12)] max-w-[1200px] px-5 sm:px-7 lg:px-12 2xl:px-14",
            headerClassName,
          )}
        >
          {title ? (
            <TextReveal
              as="h2"
              className="gold-underline type-title"
              type="words"
              stagger={SECTION_TITLE_WORD_STAGGER}
            >
              {title}
            </TextReveal>
          ) : null}
          {subtitle ? (
            <TextReveal
              as="p"
              className="type-subtitle mt-[calc(var(--section-header-gap)*0.52)] max-w-3xl"
              type="words"
              stagger={SECTION_TITLE_WORD_STAGGER}
              duration={SECTION_SUBTITLE_WORD_DURATION}
              delay={SUBTITLE_DELAY_AFTER_TITLE}
            >
              {subtitle}
            </TextReveal>
          ) : null}
          <div
            className="divider-soft mt-[calc(var(--section-header-gap)*0.82)]"
            aria-hidden
          />
        </div>
      )}
      {children}
    </section>
  );
}
