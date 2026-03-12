"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import {
  Easing,
  interpolate,
  useCurrentFrame,
  useRemotionEnvironment,
  useVideoConfig,
} from "remotion";
import { useMemo, type CSSProperties, type ElementType, type Ref } from "react";
import { easeOutExpo } from "@/components/motion";
import { cn } from "@/lib/utils";
import { useRevealOnce } from "@/components/useRevealOnce";

interface TextRevealProps extends HTMLMotionProps<"div"> {
  children: string | string[];
  as?: ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  type?: "lines" | "words" | "chars";
  priority?: boolean;
}

const renderTextEase = Easing.bezier(0.16, 1, 0.3, 1);

export default function TextReveal({
  children,
  as: Component = "div",
  className,
  delay = 0,
  duration = 0.8,
  stagger = 0.08,
  type = "words",
  priority = false,
  ...props
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isRendering } = useRemotionEnvironment();
  const text = typeof children === "string" ? children : children.join(" ");

  const items = useMemo(() => {
    if (type === "lines" && Array.isArray(children)) return children;
    if (type === "lines" && typeof children === "string") {
      return children.split("\n");
    }
    if (type === "words") return text.split(" ");
    if (type === "chars") return text.split("");
    return [text];
  }, [children, type, text]);
  const { ref, isRevealed, revealedAtFrame } = useRevealOnce(undefined, {
    amount: 0.2,
    priority,
  });
  const shouldShow = prefersReducedMotion || isRevealed;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: easeOutExpo,
      },
    },
  };

  const reducedVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2, delay },
    },
  };

  if (isRendering && !prefersReducedMotion) {
    const delayFrames = Math.round(delay * fps);
    const durationFrames = Math.max(1, Math.round(duration * fps));
    const staggerFrames = Math.round(stagger * fps);
    const baseRevealFrame = revealedAtFrame ?? frame + 9999;

    return (
      <Component className={cn("whitespace-pre-wrap", className)} {...props}>
        <span ref={ref as Ref<HTMLSpanElement>} className="inline-block">
          {items.map((item, index) => {
            const itemStartFrame =
              baseRevealFrame + delayFrames + index * staggerFrames;
            const itemProgress = interpolate(
              frame,
              [itemStartFrame, itemStartFrame + durationFrames],
              [0, 1],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: renderTextEase,
              },
            );
            const opacity = itemProgress;
            const y = interpolate(itemProgress, [0, 1], [20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: renderTextEase,
            });
            const blur = interpolate(itemProgress, [0, 1], [4, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: renderTextEase,
            });
            const itemStyle: CSSProperties = {
              opacity,
              transform: `translate3d(0, ${y}px, 0)`,
              filter: blur > 0.001 ? `blur(${blur}px)` : "blur(0px)",
              willChange: "opacity, transform, filter",
            };

            return (
              <span
                key={index}
                className="inline-block mr-[0.2em] last:mr-0"
                style={itemStyle}
              >
                {item}
              </span>
            );
          })}
        </span>
      </Component>
    );
  }

  return (
    <Component className={cn("whitespace-pre-wrap", className)} {...props}>
      <motion.span
        ref={ref as Ref<HTMLSpanElement>}
        variants={prefersReducedMotion ? reducedVariants : containerVariants}
        initial="hidden"
        animate={shouldShow ? "visible" : "hidden"}
        className="inline-block"
      >
        {items.map((item, index) => (
          <motion.span
            key={index}
            variants={prefersReducedMotion ? undefined : itemVariants}
            className="inline-block mr-[0.2em] last:mr-0"
          >
            {item}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}
