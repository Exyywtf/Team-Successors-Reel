"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { useMemo, type ElementType, type Ref } from "react";
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
  const text = typeof children === "string" ? children : children.join(" ");

  const items = useMemo(() => {
    if (type === "lines" && Array.isArray(children)) return children;
    if (type === "lines" && typeof children === "string")
      return children.split("\n");
    if (type === "words") return text.split(" ");
    if (type === "chars") return text.split("");
    return [text];
  }, [children, type, text]);
  const { ref, isRevealed } = useRevealOnce(undefined, {
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
