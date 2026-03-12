"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCurrentFrame, useRemotionEnvironment, useVideoConfig } from "remotion";
import {
  GLOBAL_MODAL_STATE_EVENT,
  type GlobalModalStateDetail,
  readGlobalModalOpenState,
} from "@/lib/modalRuntime";

const ATMO_SECTION_SELECTOR = "[data-atmo-section]";
const MOBILE_VIEWPORT_QUERY = "(max-width: 767px)";
const SPOT_LERP_FACTOR = 0.12;
const TARGET_UPDATE_MIN_MS = 80;
const SPOT_SNAP_THRESHOLD = 0.35;
const MODAL_BG_FADE_MS = 420;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function parseAnchorRatio(
  value: string | undefined,
  fallbackRatio: number,
): number {
  const numeric = Number.parseFloat(value ?? "");
  if (!Number.isFinite(numeric)) {
    return fallbackRatio;
  }
  if (numeric > 1) {
    return clamp(numeric, 0, 100) / 100;
  }
  return clamp(numeric, 0, 1);
}

function canElementScroll(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  const overflowY = style.overflowY;
  const scrollableOverflow = overflowY === "auto" || overflowY === "scroll";
  return scrollableOverflow && element.scrollHeight > element.clientHeight + 1;
}

function getScrollRoot(): HTMLElement | Window {
  if (typeof window === "undefined") {
    return window;
  }

  const scrollingElement = document.scrollingElement as HTMLElement | null;
  if (
    scrollingElement &&
    scrollingElement.scrollHeight > scrollingElement.clientHeight + 1
  ) {
    return scrollingElement;
  }

  let cursor =
    document.querySelector<HTMLElement>("[data-site-root]") ??
    document.querySelector<HTMLElement>("main");

  while (cursor) {
    if (canElementScroll(cursor)) {
      return cursor;
    }
    cursor = cursor.parentElement;
  }

  return window;
}

function isMobileViewport(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(MOBILE_VIEWPORT_QUERY).matches;
}

export default function CinematicBackground() {
  const pathname = usePathname();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { isRendering } = useRemotionEnvironment();
  const [isMobile, setIsMobile] = useState(false);
  const [debugAtmo, setDebugAtmo] = useState(false); // Toggle via ?atmoDebug query param
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAtmoWorkPaused, setIsAtmoWorkPaused] = useState(false);

  // Physics state for the "Pulse" orb
  const pulseAnchorRef = useRef<HTMLDivElement | null>(null);
  const targetSpotRef = useRef({ x: 0, y: 0 }); // Where the orb wants to go
  const currentSpotRef = useRef({ x: 0, y: 0 }); // Where the orb currently is
  
  // RAF references for the physics loop and target scanning
  const movementRafRef = useRef<number | null>(null);
  const targetUpdateRafRef = useRef<number | null>(null);
  
  // Setup & Cleanup refs
  const setupRafOneRef = useRef<number | null>(null);
  const setupRafTwoRef = useRef<number | null>(null);
  const fallbackTimeoutRef = useRef<number | null>(null);
  const pauseAtmoWorkTimerRef = useRef<number | null>(null);
  
  // Throttling for scroll events
  const lastTargetUpdateTsRef = useRef(0);
  const updateTargetNowRef = useRef<((force?: boolean) => void) | null>(null);
  
  const isDev = process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (typeof window === "undefined" || isRendering) {
      return;
    }

    setIsModalOpen(readGlobalModalOpenState());

    const handleModalState = (event: Event) => {
      const modalEvent = event as CustomEvent<GlobalModalStateDetail>;
      setIsModalOpen(Boolean(modalEvent.detail?.open));
    };

    window.addEventListener(
      GLOBAL_MODAL_STATE_EVENT,
      handleModalState as EventListener,
    );

    return () => {
      window.removeEventListener(
        GLOBAL_MODAL_STATE_EVENT,
        handleModalState as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (pauseAtmoWorkTimerRef.current !== null) {
      window.clearTimeout(pauseAtmoWorkTimerRef.current);
      pauseAtmoWorkTimerRef.current = null;
    }

    if (isModalOpen) {
      pauseAtmoWorkTimerRef.current = window.setTimeout(() => {
        setIsAtmoWorkPaused(true);
        pauseAtmoWorkTimerRef.current = null;
      }, MODAL_BG_FADE_MS);
    } else {
      setIsAtmoWorkPaused(false);
    }

    return () => {
      if (pauseAtmoWorkTimerRef.current !== null) {
        window.clearTimeout(pauseAtmoWorkTimerRef.current);
        pauseAtmoWorkTimerRef.current = null;
      }
    };
  }, [isModalOpen, isRendering]);

  useEffect(() => {
    if (!isDev || typeof window === "undefined" || isRendering) {
      setDebugAtmo(false);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setDebugAtmo(params.has("atmoDebug"));
  }, [isDev, isRendering, pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || isRendering) {
      return;
    }

    const mobileQuery = window.matchMedia(MOBILE_VIEWPORT_QUERY);
    const syncMobile = () => {
      setIsMobile(mobileQuery.matches);
    };
    syncMobile();

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", syncMobile);
      return () => {
        mobileQuery.removeEventListener("change", syncMobile);
      };
    }

    return () => {
      mobileQuery.removeListener(syncMobile);
    };
  }, [isRendering]);

  useEffect(() => {
    if (typeof window === "undefined" || isRendering) {
      return;
    }

    if (isAtmoWorkPaused || isMobileViewport()) {
      return;
    }

    const anchorElement = pulseAnchorRef.current;
    if (!anchorElement) {
      return;
    }

    const applyAnchorPosition = (x: number, y: number) => {
      anchorElement.style.left = `${x}px`;
      anchorElement.style.top = `${y}px`;
    };

    const getFocusPoint = () => ({
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.45,
    });

    const resetSpotToFocus = () => {
      const focusPoint = getFocusPoint();
      lastTargetUpdateTsRef.current = 0;
      targetSpotRef.current = focusPoint;
      currentSpotRef.current = focusPoint;
      applyAnchorPosition(focusPoint.x, focusPoint.y);
    };

    resetSpotToFocus();

    /*
     * Target Selection Logic
     * 
     * Scans all elements with `data-atmo-section` to find the "best" section currently in view.
     * "Best" is defined by the largest visible area and proximity to the center of the screen.
     * Calculates a target coordinates (x, y) based on the section's anchor points.
     */
    const updateTargetNow = (force = false) => {
      if (!force) {
        const now = performance.now();
        if (now - lastTargetUpdateTsRef.current < TARGET_UPDATE_MIN_MS) {
          return;
        }
        lastTargetUpdateTsRef.current = now;
      }

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>(ATMO_SECTION_SELECTOR),
      );
      if (sections.length === 0) {
        targetSpotRef.current = getFocusPoint();
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const focusPoint = getFocusPoint();
      let bestSection: HTMLElement | null = null;
      let bestVisibleArea = 0;
      let bestDistance = Number.POSITIVE_INFINITY;
      let bestIntersection: {
        ix0: number;
        ix1: number;
        iy0: number;
        iy1: number;
        visibleW: number;
        visibleH: number;
      } | null = null;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const ix0 = Math.max(rect.left, 0);
        const ix1 = Math.min(rect.right, viewportWidth);
        const iy0 = Math.max(rect.top, 0);
        const iy1 = Math.min(rect.bottom, viewportHeight);
        const visibleW = Math.max(0, ix1 - ix0);
        const visibleH = Math.max(0, iy1 - iy0);
        const visibleArea = visibleW * visibleH;

        if (visibleArea <= 0) {
          continue;
        }

        const sectionCenterX = clamp((ix0 + ix1) * 0.5, 0, viewportWidth);
        const sectionCenterY = clamp((iy0 + iy1) * 0.5, 0, viewportHeight);
        const dx = sectionCenterX - focusPoint.x;
        const dy = sectionCenterY - focusPoint.y;
        const distance = dx * dx + dy * dy;

        if (
          visibleArea > bestVisibleArea + 1 ||
          (Math.abs(visibleArea - bestVisibleArea) <= 1 &&
            distance < bestDistance)
        ) {
          bestVisibleArea = visibleArea;
          bestDistance = distance;
          bestSection = section;
          bestIntersection = { ix0, ix1, iy0, iy1, visibleW, visibleH };
        }
      }

      if (!bestSection || !bestIntersection) {
        targetSpotRef.current = getFocusPoint();
        return;
      }

      // Calculate final target position based on the section's specific anchor preferences
      const xRatio = parseAnchorRatio(
        bestSection.dataset.atmoAnchorX ?? bestSection.dataset.atmoSpot,
        0.5,
      );
      const yRatio = parseAnchorRatio(
        bestSection.dataset.atmoAnchorY ?? bestSection.dataset.atmoSpotY,
        0.42,
      );
      targetSpotRef.current = {
        x: clamp(
          bestIntersection.ix0 + bestIntersection.visibleW * xRatio,
          0,
          viewportWidth,
        ),
        y: clamp(
          bestIntersection.iy0 + bestIntersection.visibleH * yRatio,
          0,
          viewportHeight,
        ),
      };
    };
    updateTargetNowRef.current = updateTargetNow;

    const schedulePick = () => {
      if (targetUpdateRafRef.current !== null) {
        return;
      }
      targetUpdateRafRef.current = window.requestAnimationFrame(() => {
        targetUpdateRafRef.current = null;
        updateTargetNow();
      });
    };

    const handleViewportChange = () => {
      schedulePick();
    };

    const scrollRoot = getScrollRoot();
    window.addEventListener("scroll", handleViewportChange, { passive: true });
    if (scrollRoot instanceof HTMLElement) {
      scrollRoot.addEventListener("scroll", handleViewportChange, {
        passive: true,
      });
    }
    window.addEventListener("resize", handleViewportChange, { passive: true });

    setupRafOneRef.current = window.requestAnimationFrame(() => {
      setupRafTwoRef.current = window.requestAnimationFrame(() => {
        updateTargetNow(true);
      });
    });
    fallbackTimeoutRef.current = window.setTimeout(() => {
      updateTargetNow(true);
    }, 80);

    return () => {
      window.removeEventListener("scroll", handleViewportChange);
      if (scrollRoot instanceof HTMLElement) {
        scrollRoot.removeEventListener("scroll", handleViewportChange);
      }
      window.removeEventListener("resize", handleViewportChange);
      updateTargetNowRef.current = null;
      if (targetUpdateRafRef.current !== null) {
        window.cancelAnimationFrame(targetUpdateRafRef.current);
      }
      if (setupRafOneRef.current !== null) {
        window.cancelAnimationFrame(setupRafOneRef.current);
      }
      if (setupRafTwoRef.current !== null) {
        window.cancelAnimationFrame(setupRafTwoRef.current);
      }
      if (fallbackTimeoutRef.current !== null) {
        window.clearTimeout(fallbackTimeoutRef.current);
      }
      targetUpdateRafRef.current = null;
      setupRafOneRef.current = null;
      setupRafTwoRef.current = null;
      fallbackTimeoutRef.current = null;
    };
  }, [isAtmoWorkPaused, isMobile, isRendering, pathname]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      isRendering ||
      isAtmoWorkPaused ||
      isMobileViewport()
    ) {
      return;
    }

    const anchorElement = pulseAnchorRef.current;
    if (!anchorElement) {
      return;
    }

    const animateMovement = () => {
      const current = currentSpotRef.current;
      const target = targetSpotRef.current;
      const dx = target.x - current.x;
      const dy = target.y - current.y;

      current.x += dx * SPOT_LERP_FACTOR;
      current.y += dy * SPOT_LERP_FACTOR;

      if (Math.abs(dx) < SPOT_SNAP_THRESHOLD) {
        current.x = target.x;
      }
      if (Math.abs(dy) < SPOT_SNAP_THRESHOLD) {
        current.y = target.y;
      }

      anchorElement.style.left = `${current.x}px`;
      anchorElement.style.top = `${current.y}px`;
      movementRafRef.current = window.requestAnimationFrame(animateMovement);
    };

    movementRafRef.current = window.requestAnimationFrame(animateMovement);

    return () => {
      if (movementRafRef.current !== null) {
        window.cancelAnimationFrame(movementRafRef.current);
      }
      movementRafRef.current = null;
    };
  }, [isAtmoWorkPaused, isMobile, isRendering, pathname]);

  useEffect(() => {
    if (isRendering || isAtmoWorkPaused || isMobileViewport()) {
      return;
    }
    updateTargetNowRef.current?.(true);
  }, [isAtmoWorkPaused, isMobile, isRendering, pathname]);

  if (isMobile) {
    return null;
  }

  const atmoStrength = 1.35;
  const mobileMultiplier = isMobile ? 0.85 : 1;
  const liftedPurpleRgb = "122, 77, 255"; // #7A4DFF fallback for lifted purple
  const goldSize = isMobile ? "29.75vw" : "35vw";
  const purpleSize = isMobile ? "32.3vw" : "38vw";
  const pulseSize = isMobile ? "130vw" : "110vw";
  const goldBlur = debugAtmo ? "0px" : isMobile ? "84px" : "96px";
  const purpleBlur = debugAtmo ? "0px" : isMobile ? "90px" : "104px";
  const pulseBlur = debugAtmo ? "0px" : isMobile ? "72px" : "64px";
  const pulseDurationSeconds = isMobile ? 7.2 : 6.4;
  const pulseDuration = `${pulseDurationSeconds}s`;
  const renderPulseProgress = isRendering
    ? ((frame % Math.round(pulseDurationSeconds * fps)) /
        Math.max(1, Math.round(pulseDurationSeconds * fps)))
    : 0;
  const renderPulseWave = isRendering
    ? (Math.sin(renderPulseProgress * Math.PI * 2 - Math.PI / 2) + 1) / 2
    : 0;

  const overlayStyle: CSSProperties & Record<string, string | number> = {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: 0,
    mixBlendMode: "normal",
    opacity: isModalOpen ? 0 : 1,
    transition: "opacity var(--duration-modal-bg-fade) var(--ease-modal-fade)",
    willChange: "opacity",
    "--atmo-strength": atmoStrength,
    "--atmo-mobile-multiplier": mobileMultiplier,
    "--atmo-effective-strength":
      "calc(var(--atmo-strength) * var(--atmo-mobile-multiplier))",
    "--atmo-leak-opacity":
      "clamp(0, calc(0.255 * var(--atmo-effective-strength)), 0.55)",
  };

  const layerBaseStyle: CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
  };

  const goldStyle: CSSProperties = {
    ...layerBaseStyle,
    top: "-12vh",
    right: "-12vw",
    width: goldSize,
    height: goldSize,
    background: debugAtmo
      ? "#ffd602"
      : "radial-gradient(circle at 70% 30%, rgba(255,214,2,0.34) 0%, rgba(255,214,2,0.16) 26%, rgba(255,214,2,0.00) 62%)",
    filter: `blur(${goldBlur})`,
    opacity: debugAtmo ? 1 : "var(--atmo-leak-opacity)",
  };

  const purpleStyle: CSSProperties = {
    ...layerBaseStyle,
    bottom: "-12vh",
    left: "-12vw",
    width: purpleSize,
    height: purpleSize,
    background: debugAtmo
      ? "#3a0ca3"
      : `radial-gradient(circle at 30% 70%, rgba(${liftedPurpleRgb},0.4) 0%, rgba(${liftedPurpleRgb},0.22) 22%, rgba(${liftedPurpleRgb},0) 62%)`,
    filter: `blur(${purpleBlur})`,
    opacity: debugAtmo ? 1 : "var(--atmo-leak-opacity)",
  };

  const pulseTrackStyle: CSSProperties = {
    ...layerBaseStyle,
    position: "absolute",
    left: "50%",
    top: "50%",
    width: pulseSize,
    height: pulseSize,
    transform: "translate(-50%, -50%)",
    borderRadius: "9999px",
    pointerEvents: "none",
    zIndex: 0,
    willChange: "left, top",
  };

  const pulseStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "9999px",
    background: debugAtmo
      ? "rgba(0, 0, 0, 0.92)"
      : "radial-gradient(circle, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.38) 18%, rgba(58,12,163,0.14) 36%, rgba(5,5,5,0) 72%, rgba(5,5,5,0) 100%)",
    filter: `blur(${pulseBlur})`,
    opacity: debugAtmo ? 0.9 : 0.55,
    willChange: "transform, opacity",
    transform: isRendering
      ? `translateZ(0) scale(${0.98 + renderPulseWave * 0.035})`
      : "translateZ(0)",
    backfaceVisibility: "hidden",
    contain: "paint",
    pointerEvents: "none",
  };

  const pulseHaloStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: "9999px",
    background: debugAtmo
      ? "rgba(58, 12, 163, 0.4)"
      : "radial-gradient(circle, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.38) 18%, rgba(58,12,163,0.18) 36%, rgba(5,5,5,0) 72%, rgba(5,5,5,0) 100%)",
    filter: `blur(${pulseBlur})`,
    opacity: isRendering
      ? 0.1 + renderPulseWave * 0.16
      : debugAtmo
        ? 0.22
        : 0.14,
    willChange: "transform, opacity",
    transform: isRendering
      ? `translateZ(0) scale(${0.94 + renderPulseWave * 0.13})`
      : "translateZ(0) scale(0.94)",
    backfaceVisibility: "hidden",
    contain: "paint",
    transformOrigin: "center center",
    pointerEvents: "none",
    animation: debugAtmo
      ? "none"
      : isRendering
        ? "none"
        : `atmoPulseHalo ${pulseDuration} ease-in-out infinite`,
  };

  const debugBadgeStyle: CSSProperties = {
    position: "fixed",
    top: "0.9rem",
    left: "0.9rem",
    zIndex: 9999,
    pointerEvents: "none",
    padding: "0.45rem 0.6rem",
    borderRadius: "10px",
    border: "1px solid #7dff2f",
    background: "rgba(0, 0, 0, 0.85)",
    color: "#7dff2f",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: "0.75rem",
    letterSpacing: "0.06em",
    fontWeight: 700,
  };

  return (
    <>
      <div
        id="atmo-overlay"
        aria-hidden="true"
        data-hide={isModalOpen ? "1" : "0"}
        style={overlayStyle}
      >
        <div id="atmo-gold" style={goldStyle} />
        <div id="atmo-purple" style={purpleStyle} />
        <div id="atmo-pulse-anchor" style={pulseTrackStyle}>
          <div id="atmo-pulse-base" style={pulseStyle} />
          <div id="atmo-pulse-halo" style={pulseHaloStyle} />
        </div>
      </div>
      {debugAtmo ? <div style={debugBadgeStyle}>ATMO ON</div> : null}
      <style>{`
        @keyframes atmoPulseHalo {
          0%,
          100% {
            transform: scale(0.94);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.07);
            opacity: 0.26;
          }
        }
      `}</style>
    </>
  );
}
