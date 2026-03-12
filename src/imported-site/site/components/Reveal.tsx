"use client";

import { motion, type HTMLMotionProps, useReducedMotion } from "framer-motion";
import {
  Children,
  type CSSProperties,
  type ReactNode,
  type Ref,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  Easing,
  interpolate,
  useCurrentFrame,
  useRemotionEnvironment,
  useVideoConfig,
} from "remotion";
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

const renderRevealEase = Easing.bezier(0.16, 1, 0.3, 1);

const parseBlur = (value: unknown): number => {
  if (typeof value !== "string") {
    return 0;
  }

  const match = /blur\(([\d.]+)px\)/.exec(value);
  return match ? Number(match[1]) : 0;
};

const getRenderAnimatedStyle = (
  hidden: Record<string, unknown> | undefined,
  visible: Record<string, unknown> | undefined,
  progress: number,
): CSSProperties => {
  const hiddenOpacity = typeof hidden?.opacity === "number" ? hidden.opacity : 0;
  const visibleOpacity =
    typeof visible?.opacity === "number" ? visible.opacity : 1;
  const hiddenX = typeof hidden?.x === "number" ? hidden.x : 0;
  const visibleX = typeof visible?.x === "number" ? visible.x : 0;
  const hiddenY = typeof hidden?.y === "number" ? hidden.y : 0;
  const visibleY = typeof visible?.y === "number" ? visible.y : 0;
  const hiddenScale = typeof hidden?.scale === "number" ? hidden.scale : 1;
  const visibleScale = typeof visible?.scale === "number" ? visible.scale : 1;
  const hiddenBlur = parseBlur(hidden?.filter);
  const visibleBlur = parseBlur(visible?.filter);

  const opacity = interpolate(progress, [0, 1], [hiddenOpacity, visibleOpacity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: renderRevealEase,
  });
  const x = interpolate(progress, [0, 1], [hiddenX, visibleX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: renderRevealEase,
  });
  const y = interpolate(progress, [0, 1], [hiddenY, visibleY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: renderRevealEase,
  });
  const scale = interpolate(progress, [0, 1], [hiddenScale, visibleScale], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: renderRevealEase,
  });
  const blur = interpolate(progress, [0, 1], [hiddenBlur, visibleBlur], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: renderRevealEase,
  });

  return {
    opacity,
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    filter: blur > 0.001 ? `blur(${blur}px)` : "blur(0px)",
    willChange: "opacity, transform, filter",
  };
};

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
  style,
  ...props
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isRendering } = useRemotionEnvironment();
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
  const { ref, isRevealed, revealedAtFrame } = useRevealOnce(
    revealId ?? generatedId,
    {
      amount,
      disabled: prefersReducedMotion || !once || triggerMode === "immediate",
      priority,
    },
  );

  useEffect(() => {
    if (triggerMode !== "immediate" || prefersReducedMotion || isRendering) {
      setHasImmediateTriggerStarted(false);
      return;
    }

    const raf = window.requestAnimationFrame(() => {
      setHasImmediateTriggerStarted(true);
    });

    return () => window.cancelAnimationFrame(raf);
  }, [isRendering, prefersReducedMotion, triggerMode]);

  const shouldShow =
    prefersReducedMotion ||
    (triggerMode === "immediate"
      ? isRendering
        ? revealedAtFrame !== null
        : hasImmediateTriggerStarted
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
  const renderDurationFrames = Math.max(
    1,
    Math.round((revealDurationMs / 1000) * fps),
  );
  const renderDelayFrames = Math.max(0, Math.round(delay * fps));
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

  const renderRevealProgress =
    revealedAtFrame === null
      ? 0
      : interpolate(
          frame,
          [
            revealedAtFrame + renderDelayFrames,
            revealedAtFrame + renderDelayFrames + renderDurationFrames,
          ],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: renderRevealEase,
          },
        );

  useEffect(() => {
    if (!isRendering) {
      return;
    }

    if (
      onRevealProgress &&
      !revealProgressCalledRef.current &&
      renderRevealProgress >= clampedStartChildrenAt
    ) {
      triggerRevealProgress(clampedStartChildrenAt);
    }

    if (onRevealComplete && !revealCompleteCalledRef.current && renderRevealProgress >= 1) {
      revealCompleteCalledRef.current = true;
      onRevealComplete();
    }
  }, [
    clampedStartChildrenAt,
    isRendering,
    onRevealComplete,
    onRevealProgress,
    renderRevealProgress,
  ]);

  if (isRendering && !prefersReducedMotion) {
    const renderStyle = getRenderAnimatedStyle(
      variants.hidden as Record<string, unknown> | undefined,
      variants.visible as Record<string, unknown> | undefined,
      renderRevealProgress,
    );

    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        className={cn(className)}
        style={{ ...(style as CSSProperties | undefined), ...renderStyle }}
      >
        {variant === "stagger"
          ? Children.map(children, (child, index) => {
              const childProgress =
                revealedAtFrame === null
                  ? 0
                  : interpolate(
                      frame,
                      [
                        revealedAtFrame +
                          renderDelayFrames +
                          Math.round(index * staggerChildren * fps),
                        revealedAtFrame +
                          renderDelayFrames +
                          Math.round(index * staggerChildren * fps) +
                          Math.max(1, Math.round(0.4 * fps)),
                      ],
                      [0, 1],
                      {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                        easing: renderRevealEase,
                      },
                    );

              return (
                <div
                  key={index}
                  style={getRenderAnimatedStyle(
                    staggerItemVariants.hidden as Record<string, unknown>,
                    staggerItemVariants.visible as Record<string, unknown>,
                    childProgress,
                  )}
                >
                  {child}
                </div>
              );
            })
          : children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref as Ref<HTMLDivElement>}
      className={cn(className)}
      style={style}
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
