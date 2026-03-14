"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCurrentFrame, useRemotionEnvironment } from "remotion";

interface UseRevealOnceOptions {
  amount?: number; // 0 to 1 (0 = immediately when 1px is in view)
  once?: boolean; // If true, stays revealed. If false, toggles (not used likely, but good for completeness)
  disabled?: boolean;
  threshold?: number; // Optional override for IntersectionObserver threshold
  rootMargin?: string;
  priority?: boolean; // If true, checks immediately on mount more aggressively
}

export function useRevealOnce(
  _id?: string, // Legacy ID argument (unused now as we rely on component lifecycle)
  {
    amount = 0.2,
    disabled = false,
    priority = false, // Use for Hero elements
    rootMargin = "0px 0px -10% 0px", // Standard margin: trigger when 10% from bottom
  }: UseRevealOnceOptions = {},
) {
  const elementRef = useRef<HTMLElement | null>(null);
  const amountThreshold = Math.min(Math.max(amount, 0), 1);
  const frame = useCurrentFrame();
  const { isRendering } = useRemotionEnvironment();

  // If disabled (reduced motion), show immediately
  const [isRevealed, setIsRevealed] = useState(disabled);
  const [revealedAtFrame, setRevealedAtFrame] = useState<number | null>(
    disabled ? 0 : null,
  );

  useEffect(() => {
    if (disabled) {
      setIsRevealed(true);
      setRevealedAtFrame((currentFrame) => currentFrame ?? frame);
    }
  }, [disabled, frame]);

  useEffect(() => {
    if (disabled || isRendering) {
      return;
    }

    const node = elementRef.current;
    if (!node) return;

    // 1. Immediate check for Priority elements (Hero)
    const checkImmediate = () => {
      const rect = node.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Priority elements: trigger if *any* part is in view or mostly likely in view
      // Standard elements: use the 'amount' logic
      const isVisible =
        rect.top <
        windowHeight - windowHeight * (priority ? 0 : amountThreshold);

      if (isVisible) {
        setIsRevealed(true);
        setRevealedAtFrame((currentFrame) => currentFrame ?? frame);
      }
    };

    if (priority) {
      // Force a check ASAP for hero elements
      checkImmediate();
    }

    // 2. Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          setRevealedAtFrame((currentFrame) => currentFrame ?? frame);
          observer.disconnect(); // Trigger once and stop
        }
      },
      {
        threshold: amountThreshold > 0.5 ? 0.5 : [0, amountThreshold], // Cap threshold for safety
        rootMargin: priority ? "0px 0px 0px 0px" : rootMargin, // Hero gets zero margin (eager trigger)
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [amountThreshold, disabled, frame, isRendering, priority, rootMargin]);

  useLayoutEffect(() => {
    if (!isRendering || disabled || isRevealed) {
      return;
    }

    const node = elementRef.current;
    if (!node || typeof window === "undefined") {
      return;
    }

    const rect = node.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const revealLine = windowHeight - windowHeight * amountThreshold;
    const isVisible = rect.top < revealLine && rect.bottom > 0;

    if (!isVisible) {
      return;
    }

    setIsRevealed(true);
    setRevealedAtFrame(0);
  }, [amountThreshold, disabled, frame, isRendering, isRevealed]);

  return { ref: elementRef, isRevealed, revealedAtFrame };
}
