"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CountUpPreset {
  from?: number;
  to: number;
  durationMs: number;
  decimals?: number;
  direction?: "up" | "down";
  prefix?: string;
  suffix?: string;
  ariaLabel: string;
}

const COUNT_UP_PRESETS: Record<string, Omit<CountUpPreset, "ariaLabel">> = {
  "15,000+ AED": { to: 15000, durationMs: 1100, suffix: "+ AED" },
  "10,000+ AED": { to: 10000, durationMs: 1100, suffix: "+ AED" },
  "5,000+ AED": { to: 5000, durationMs: 1100, suffix: "+ AED" },
  "1,000+ AED": { to: 1000, durationMs: 1100, suffix: "+ AED" },
  "6,000+": { to: 6000, durationMs: 900, suffix: "+" },
  "100k+": { to: 100, durationMs: 800, suffix: "k+" },
  "100%": { to: 100, durationMs: 800, suffix: "%" },
  "0.1mm": {
    from: 10,
    to: 0.1,
    durationMs: 1100,
    decimals: 1,
    direction: "down",
    suffix: "mm",
  },
};

const COUNT_UP_TOKENS = Object.keys(COUNT_UP_PRESETS).sort(
  (a, b) => b.length - a.length,
);
const defaultNumberFormatter = new Intl.NumberFormat("en-US");

export function getCountUpPreset(value: string): CountUpPreset | null {
  const normalizedValue = value.trim();
  const preset = COUNT_UP_PRESETS[normalizedValue];

  if (!preset) {
    return null;
  }

  return {
    ...preset,
    ariaLabel: normalizedValue,
  };
}

export function splitLeadingCountUpMetric(
  metric: string,
): { preset: CountUpPreset; trailingText: string } | null {
  const normalizedMetric = metric.trim();

  for (const token of COUNT_UP_TOKENS) {
    if (normalizedMetric.startsWith(token)) {
      const preset = getCountUpPreset(token);

      if (!preset) {
        return null;
      }

      return {
        preset: {
          ...preset,
          ariaLabel: normalizedMetric,
        },
        trailingText: normalizedMetric.slice(token.length),
      };
    }
  }

  return null;
}

interface CountUpTextProps {
  to?: number;
  value?: number;
  from?: number;
  durationMs?: number;
  start?: boolean;
  startDelayMs?: number;
  startOffsetMs?: number;
  decimals?: number;
  direction?: "up" | "down";
  prefix?: string;
  suffix?: string;
  ariaLabel?: string;
  className?: string;
  formatter?: (value: number) => string;
  reserveWidth?: boolean;
}

function easeOutSuper(progress: number) {
  if (progress >= 1) {
    return 1;
  }

  return 1 - Math.pow(1 - progress, 10);
}

export default function CountUpText({
  to,
  value,
  from,
  durationMs = 1000,
  start = false,
  startDelayMs = 0,
  startOffsetMs = 0,
  decimals = 0,
  direction,
  prefix = "",
  suffix = "",
  ariaLabel,
  className,
  formatter,
  reserveWidth = true,
}: CountUpTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const parsedTo = to ?? value ?? 0;
  const parsedFrom = from ?? (direction === "down" ? 1 : 0);
  const fractionDigits = Math.max(0, decimals);
  const [displayValue, setDisplayValue] = useState(parsedFrom);
  const animationStartedRef = useRef(false);
  const formatNumber = useMemo(() => {
    if (formatter) {
      return formatter;
    }

    if (fractionDigits <= 0) {
      return (nextValue: number) => defaultNumberFormatter.format(nextValue);
    }

    const decimalFormatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });

    return (nextValue: number) => decimalFormatter.format(nextValue);
  }, [formatter, fractionDigits]);
  const roundedFrom = useMemo(
    () => Number(parsedFrom.toFixed(fractionDigits)),
    [fractionDigits, parsedFrom],
  );
  const roundedTo = useMemo(
    () => Number(parsedTo.toFixed(fractionDigits)),
    [fractionDigits, parsedTo],
  );
  const formattedFromValue = useMemo(
    () => `${prefix}${formatNumber(roundedFrom)}${suffix}`,
    [formatNumber, prefix, roundedFrom, suffix],
  );
  const formattedToValue = useMemo(
    () => `${prefix}${formatNumber(roundedTo)}${suffix}`,
    [formatNumber, prefix, roundedTo, suffix],
  );
  const reserveValue =
    formattedFromValue.length >= formattedToValue.length
      ? formattedFromValue
      : formattedToValue;

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(roundedTo);
      return;
    }

    if (!animationStartedRef.current) {
      setDisplayValue(roundedFrom);
    }
  }, [prefersReducedMotion, roundedFrom, roundedTo]);

  useEffect(() => {
    if (prefersReducedMotion || !start || animationStartedRef.current) {
      return;
    }

    let frameId = 0;
    let timeoutId = 0;
    const safeDurationMs = Math.max(1, durationMs);

    const effectiveStartDelayMs = Math.max(0, startDelayMs + startOffsetMs);

    timeoutId = window.setTimeout(() => {
      if (animationStartedRef.current) {
        return;
      }

      animationStartedRef.current = true;
      const animationStart = performance.now();

      const animate = (timestamp: number) => {
        const progress = Math.min(
          1,
          (timestamp - animationStart) / safeDurationMs,
        );
        if (progress >= 1) {
          setDisplayValue(roundedTo);
          return;
        }

        const easedProgress = easeOutSuper(progress);
        const interpolatedValue =
          parsedFrom + (parsedTo - parsedFrom) * easedProgress;
        setDisplayValue(Number(interpolatedValue.toFixed(fractionDigits)));

        frameId = window.requestAnimationFrame(animate);
      };

      frameId = window.requestAnimationFrame(animate);
    }, effectiveStartDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(frameId);
    };
  }, [
    durationMs,
    fractionDigits,
    parsedFrom,
    parsedTo,
    prefersReducedMotion,
    roundedTo,
    start,
    startDelayMs,
    startOffsetMs,
  ]);

  const activeValue = prefersReducedMotion ? roundedTo : displayValue;
  const formattedActiveValue = `${prefix}${formatNumber(activeValue)}${suffix}`;
  const motionAriaLabel = ariaLabel ?? formattedToValue;

  if (!reserveWidth) {
    return (
      <span
        role="text"
        aria-label={motionAriaLabel}
        className={cn("tabular-nums font-extrabold", className)}
      >
        {formattedActiveValue}
      </span>
    );
  }

  return (
    <span
      role="text"
      aria-label={motionAriaLabel}
      className={cn(
        "relative inline-grid tabular-nums font-extrabold",
        className,
      )}
      style={{ minWidth: `${Math.max(1, reserveValue.length)}ch` }}
    >
      <span aria-hidden className="invisible">
        {reserveValue}
      </span>
      <span aria-hidden className="absolute inset-0">
        {formattedActiveValue}
      </span>
    </span>
  );
}
