"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { pageTransitionVariants } from "@/lib/motion";

interface MotionPageProps {
  children: ReactNode;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
const EXIT_FALLBACK_RELEASE_MS = 380;

function createSsrInitialStyle(): CSSProperties {
  const initialVariant = pageTransitionVariants.initial;
  if (!initialVariant || typeof initialVariant !== "object") {
    return { opacity: 0 };
  }

  const initialState = initialVariant as {
    opacity?: number;
    x?: number;
    y?: number;
    scale?: number;
    filter?: string;
  };

  const opacity =
    typeof initialState.opacity === "number" ? initialState.opacity : 1;
  const x = typeof initialState.x === "number" ? initialState.x : 0;
  const y = typeof initialState.y === "number" ? initialState.y : 0;
  const scale = typeof initialState.scale === "number" ? initialState.scale : 1;

  return {
    opacity,
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    ...(typeof initialState.filter === "string"
      ? { filter: initialState.filter }
      : {}),
  };
}

const SSR_INITIAL_STYLE = createSsrInitialStyle();

export default function MotionPage({ children }: MotionPageProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const hiddenGuardPathRef = useRef(pathname);
  const hiddenGuardTimerRef = useRef<number | null>(null);
  const [incomingHidden, setIncomingHidden] = useState(false);
  const [motionReady, setMotionReady] = useState(false);

  const clearHiddenGuardTimer = () => {
    if (hiddenGuardTimerRef.current !== null) {
      window.clearTimeout(hiddenGuardTimerRef.current);
      hiddenGuardTimerRef.current = null;
    }
  };

  useIsomorphicLayoutEffect(() => {
    setMotionReady(true);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (pathname === hiddenGuardPathRef.current) {
      return;
    }

    hiddenGuardPathRef.current = pathname;
    setIncomingHidden(true);
    clearHiddenGuardTimer();
    hiddenGuardTimerRef.current = window.setTimeout(() => {
      hiddenGuardTimerRef.current = null;
      setIncomingHidden(false);
    }, EXIT_FALLBACK_RELEASE_MS);
  }, [pathname]);

  useEffect(() => () => clearHiddenGuardTimer(), []);

  const handleExitComplete = () => {
    clearHiddenGuardTimer();
    setIncomingHidden(false);
  };

  if (prefersReducedMotion) {
    return <div className="relative isolate min-h-[100dvh]">{children}</div>;
  }

  return (
    <div className="relative isolate min-h-[100dvh]">
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={handleExitComplete}
      >
        <motion.div
          key={pathname}
          variants={pageTransitionVariants}
          initial="initial"
          animate={incomingHidden ? "initial" : "enter"}
          exit="exit"
          style={
            !motionReady
              ? SSR_INITIAL_STYLE
              : incomingHidden
                ? {
                    ...SSR_INITIAL_STYLE,
                    pointerEvents: "none",
                    willChange: "opacity, transform",
                  }
                : { willChange: "opacity, transform" }
          }
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
