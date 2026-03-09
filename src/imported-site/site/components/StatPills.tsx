"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId, type Ref } from "react";
import { useRevealOnce } from "@/components/useRevealOnce";
import CountUpText, { getCountUpPreset } from "@/components/ui/CountUpText";
import type { StatItem } from "@/types/content";

interface StatPillsProps {
  stats: StatItem[];
  countUpStart?: boolean;
  countUpStartDelayMs?: number;
}

export default function StatPills({
  stats,
  countUpStart = true,
  countUpStartDelayMs = 100,
}: StatPillsProps) {
  const prefersReducedMotion = useReducedMotion();
  const id = useId().replace(/[:]/g, "");
  const { ref, isRevealed } = useRevealOnce(`stat-pills-${id}`, {
    amount: 0.3,
    disabled: Boolean(prefersReducedMotion),
  });
  const targetAnimation =
    prefersReducedMotion || isRevealed
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: 10 };

  return (
    <div ref={ref as Ref<HTMLDivElement>} className="flex flex-wrap gap-2">
      {stats.map((stat, index) => {
        const preset = getCountUpPreset(stat.value);

        return (
          <motion.span
            key={`${stat.label}-${stat.value}`}
            className="stat-pill"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={targetAnimation}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : {
                    duration: 0.35,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
          >
            <strong className="mr-2 font-heading text-[var(--accent)]">
              {preset ? (
                <CountUpText
                  from={preset.from}
                  to={preset.to}
                  durationMs={preset.durationMs}
                  start={countUpStart}
                  startDelayMs={countUpStartDelayMs}
                  decimals={preset.decimals}
                  direction={preset.direction}
                  prefix={preset.prefix}
                  suffix={preset.suffix}
                  ariaLabel={preset.ariaLabel}
                />
              ) : (
                <span className="tabular-nums font-extrabold">{stat.value}</span>
              )}
            </strong>
            <span>{stat.label}</span>
          </motion.span>
        );
      })}
    </div>
  );
}
