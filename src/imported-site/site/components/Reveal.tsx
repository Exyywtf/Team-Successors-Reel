"use client";

import { motion, type HTMLMotionProps, useReducedMotion } from "framer-motion";
import {
  Children,
  type ReactNode,
  type Ref,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  getRevealVariants,
  type RevealVariant,
  type SectionType,
  staggerItemVariants,
} from "@/components/motion";
import { useRevealOnce } from "@/components/useRevealOnce";
import { cn } from "@/lib/utils";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  delay?: number;
  variant?: RevealVariant;
  staggerChildren?: number;
  once?: boolean;
  amount?: number;
  priority?: boolean;
  revealId?: string;
  sectionType?: SectionType;
  onRevealComplete?: () => void;
  onRevealProgress?: (progress: number) => void;
  startChildrenAt?: number;
  triggerMode?: "viewport" | "immediate";
}

export default function Reveal({
  children,
  className,
  delay = 0,
  variant = "fadeUp",
  staggerChildren = 0.08,
  once = true,
  amount = 0.2,
  priority = false,
  revealId,
  sectionType = "default",
  onRevealComplete,
  onRevealProgress,
  startChildrenAt = 1,
  triggerMode = "viewport",
  animate: animateProp,
  onAnimationStart,
  onAnimationComplete,
  ...props
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const variants = getRevealVariants({
    variant,
    delay,
    staggerChildren,
    sectionType,
  });
  const generatedId = useId().replace(/[:]/g, "");
  const revealCompleteCalledRef = useRef(false);
  const revealProgressCalledRef = useRef(false);
  const revealProgressTimerRef = useRef<number | null>(null);
  const [hasImmediateTriggerStarted, setHasImmediateTriggerStarted] =
    useState(false);
  const { ref, isRevealed } = useRevealOnce(revealId ?? generatedId, {
    amount,
    disabled: prefersReducedMotion || !once || triggerMode === "immediate",
    priority,
  });
  useEffect(() => {
    if (triggerMode !== "immediate" || prefersReducedMotion) {
      setHasImmediateTriggerStarted(false);
      return;
    }

    const raf = window.requestAnimationFrame(() => {
      setHasImmediateTriggerStarted(true);
    });

    return () => window.cancelAnimationFrame(raf);
  }, [prefersReducedMotion, triggerMode]);

  const shouldShow =
    prefersReducedMotion ||
    (triggerMode === "immediate"
      ? hasImmediateTriggerStarted
      : !once || isRevealed);
  const visibleTransition = variants.visible;
  const revealDurationMs =
    typeof visibleTransition === "object" &&
    visibleTransition !== null &&
    "transition" in visibleTransition &&
    visibleTransition.transition &&
    typeof visibleTransition.transition === "object" &&
    "duration" in visibleTransition.transition &&
    typeof visibleTransition.transition.duration === "number"
      ? visibleTransition.transition.duration * 1000
      : 450;
  const clampedStartChildrenAt = Math.min(Math.max(startChildrenAt, 0), 1);

  const triggerRevealProgress = (progress: number) => {
    if (revealProgressCalledRef.current) {
      return;
    }

    revealProgressCalledRef.current = true;
    onRevealProgress?.(progress);
  };

  useEffect(() => {
    return () => {
      if (revealProgressTimerRef.current !== null) {
        window.clearTimeout(revealProgressTimerRef.current);
        revealProgressTimerRef.current = null;
      }
    };
  }, []);

  const handleAnimationStart: NonNullable<
    HTMLMotionProps<"div">["onAnimationStart"]
  > = (definition) => {
    onAnimationStart?.(definition);

    if (!onRevealProgress || revealProgressCalledRef.current) {
      return;
    }

    const startedVisibleAnimation =
      definition === "visible" ||
      (Array.isArray(definition) && definition.includes("visible"));

    if (!startedVisibleAnimation) {
      return;
    }

    if (clampedStartChildrenAt <= 0 || prefersReducedMotion) {
      triggerRevealProgress(0);
      return;
    }

    if (clampedStartChildrenAt >= 1) {
      return;
    }

    const progressDelayMs = Math.max(
      0,
      revealDurationMs * clampedStartChildrenAt,
    );
    revealProgressTimerRef.current = window.setTimeout(() => {
      triggerRevealProgress(clampedStartChildrenAt);
    }, progressDelayMs);
  };

  const handleAnimationComplete: NonNullable<
    HTMLMotionProps<"div">["onAnimationComplete"]
  > = (definition) => {
    onAnimationComplete?.(definition);

    if (revealCompleteCalledRef.current) {
      return;
    }

    const reachedVisible =
      prefersReducedMotion ||
      definition === "visible" ||
      (Array.isArray(definition) && definition.includes("visible"));

    if (!reachedVisible) {
      return;
    }

    if (revealProgressTimerRef.current !== null) {
      window.clearTimeout(revealProgressTimerRef.current);
      revealProgressTimerRef.current = null;
    }

    if (onRevealProgress && clampedStartChildrenAt >= 1) {
      triggerRevealProgress(1);
    }

    revealCompleteCalledRef.current = true;
    onRevealComplete?.();
  };

  return (
    <motion.div
      ref={ref as Ref<HTMLDivElement>}
      className={cn(className)}
      variants={prefersReducedMotion ? undefined : variants}
      initial={prefersReducedMotion ? false : shouldShow ? "visible" : "hidden"}
      animate={
        animateProp ??
        (!prefersReducedMotion
          ? shouldShow
            ? "visible"
            : "hidden"
          : undefined)
      }
      whileInView={
        !prefersReducedMotion && !once && triggerMode === "viewport"
          ? "visible"
          : undefined
      }
      viewport={
        !prefersReducedMotion && !once && triggerMode === "viewport"
          ? { once: false, amount }
          : undefined
      }
      onAnimationStart={handleAnimationStart}
      onAnimationComplete={handleAnimationComplete}
      {...props}
    >
      {variant === "stagger"
        ? Children.map(children, (child, index) => (
            <motion.div key={index} variants={staggerItemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
