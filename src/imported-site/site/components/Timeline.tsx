import { Gauge, Workflow, Wrench } from "lucide-react";
import Card from "@/components/ui/Card";
import { CARD_DELAY_AFTER_HEADER } from "@/components/motion";
import Reveal from "@/components/Reveal";
import type { TimelineStep } from "@/types/content";

const icons = [Gauge, Workflow, Wrench];

interface TimelineProps {
  steps: TimelineStep[];
}

export default function Timeline({ steps }: TimelineProps) {
  return (
    <div className="relative grid gap-4 md:grid-cols-3">
      <div className="pointer-events-none absolute left-12 right-12 top-9 hidden h-px bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--accent)_34%,transparent),transparent)] md:block" />

      {steps.map((step, index) => {
        const Icon = icons[index % icons.length];

        return (
          <Reveal
            key={step.title}
            delay={CARD_DELAY_AFTER_HEADER + index * 0.08}
            variant="fadeUp"
          >
            <Card className="card-pad-default relative">
              <div className="mb-4 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--accent)]">
                <Icon size={18} aria-hidden />
              </div>
              <p className="tier-chip mb-4 w-fit">{step.tool}</p>
              <h3 className="font-heading text-xl">{step.title}</h3>
              <p className="copy-sm mt-3">{step.description}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.15em] text-[var(--accent)]">
                {step.outcome}
              </p>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}
