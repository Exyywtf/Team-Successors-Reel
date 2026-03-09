"use client";

import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
  useSpring,
  type TargetAndTransition,
  type Variants,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  NAV_INNER_GLASS_CLASS,
  NAV_MENU_PANEL_CLASS,
  NAV_MOBILE_DROPDOWN_CONTACT_RADIUS_CLASS,
  NAV_MOBILE_DROPDOWN_INSET_CLASS,
  NAV_MOBILE_DROPDOWN_INNER_RADIUS_CLASS,
  NAV_MOBILE_DROPDOWN_STACK_GAP_CLASS,
  NAV_MOBILE_OUTER_RADIUS_CLASS,
  NAV_MOBILE_RADIUS_VARS,
  NAV_OUTER_CLASS,
  navOuterSurfaceClass,
} from "@/components/navbar/navbarStyles";
import { buttonClasses } from "@/components/ui/Button";
import { navIndicatorTransition } from "@/components/motion";
import type { NavigationItem } from "@/types/content";
import { navItemClasses } from "@/components/uiClasses";
import { siteContent } from "@/lib/content";
import {
  GLOBAL_MODAL_STATE_EVENT,
  type GlobalModalStateDetail,
  readGlobalModalOpenState,
} from "@/lib/modalRuntime";
import { easeOutExpo, stagger } from "@/lib/motion";
import { siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

const mobileMenuItemVariants: Variants = {
  closed: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.18, ease: easeOutExpo },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: easeOutExpo },
  },
};

const mobileMenuListVariants: Variants = {
  closed: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: stagger.tight,
    },
  },
};

/**
 * Mobile Menu State Machine
 * 
 * Uses explicit phases to coordinate the multi-part exit animation:
 * 1. closed -> opening -> open
 * 2. open -> closingItems (Fades out links first)
 * 3. closingItems -> closingShell (Collapse the container afterwards)
 * 4. closingShell -> closed
 */
type MobileMenuPhase =
  | "closed"
  | "opening"
  | "open"
  | "closingItems"
  | "closingShell";

const mobilePrimaryRouteOrder = [
  "/",
  "/team",
  "/engineering",
  "/enterprise",
  "/sponsors",
  "/faq",
] as const;
const NAV_SCROLL_DOWNSHIFT_PX = 8;

function getScrollRoot(): Window | HTMLElement {
  if (typeof window === "undefined") {
    return window;
  }

  const previewRoot = document.querySelector<HTMLElement>("[data-site-root]");
  if (previewRoot) {
    return previewRoot;
  }

  return window;
}

function isRouteActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

interface NavbarDesktopProps {
  isScrolled: boolean;
  pathname: string;
  navLinks: NavigationItem[];
  prefersReducedMotion: boolean;
}

function NavbarDesktop({
  isScrolled,
  pathname,
  navLinks,
  prefersReducedMotion,
}: NavbarDesktopProps) {
  return (
    <motion.div
      layout
      data-navbar-outer
      className={cn(
        NAV_OUTER_CLASS,
        "hidden w-full md:mx-auto md:w-max md:flex-col xl:flex",
        navOuterSurfaceClass(isScrolled),
      )}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        data-navbar-row
        className="flex items-center gap-4 px-4 py-2.5 md:px-5"
      >
        <div data-navbar-brand className="flex shrink-0 items-center">
          <Link
            href="/"
            className="focus-ring inline-flex shrink-0 items-center gap-3 rounded-lg py-1 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <Image
                src="/brand/logo.svg"
                alt={`${siteConfig.teamName} logo`}
                width={36}
                height={36}
                priority
                className="relative z-10"
              />
            </div>
            <span className="whitespace-nowrap font-heading text-sm tracking-[0.14em] sm:text-base text-white/90 group-hover:text-white transition-colors">
              {siteConfig.teamName}
            </span>
          </Link>
        </div>

        <div
          data-navbar-inner
          className={cn(
            NAV_INNER_GLASS_CLASS,
            "relative hidden w-fit shrink-0 items-center gap-4 rounded-full p-1.5 md:inline-flex",
          )}
        >
          <nav
            className="flex w-fit items-center gap-1.5"
            aria-label="Main navigation"
          >
            {navLinks.map((item) => {
              const isActive = isRouteActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={navItemClasses({
                    variant: "desktop",
                    active: isActive,
                  })}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active-pill-desktop"
                      className="absolute inset-0 rounded-full bg-white/10 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : navIndicatorTransition
                      }
                    />
                  ) : null}
                  <span className="relative z-10 text-[0.8rem] tracking-widest">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div data-navbar-contact className="flex shrink-0 items-center">
          <Link
            href="/contact"
            className={cn(
              buttonClasses({ variant: "gold", size: "md" }),
              "hidden min-w-[130px] md:inline-flex",
            )}
          >
            Contact
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

interface NavbarMobileProps {
  isScrolled: boolean;
  pathname: string;
  navLinks: NavigationItem[];
  contactLink: NavigationItem;
  prefersReducedMotion: boolean;
  menuPhase: MobileMenuPhase;
  interactionLocked: boolean;
  onToggle: () => void;
  onNavigateRequest: (href: string) => void;
  onOpenComplete: () => void;
  onItemsClosed: () => void;
  onShellClosed: () => void;
}

function NavbarMobile({
  isScrolled,
  pathname,
  navLinks,
  contactLink,
  prefersReducedMotion,
  menuPhase,
  interactionLocked,
  onToggle,
  onNavigateRequest,
  onOpenComplete,
  onItemsClosed,
  onShellClosed,
}: NavbarMobileProps) {
  const isOpen = menuPhase !== "closed";
  const outerShellControls = useAnimationControls();
  const innerShellControls = useAnimationControls();
  const menuListControls = useAnimationControls();
  const contactControls = useAnimationControls();

  useEffect(() => {
    let cancelled = false;

    const syncPhase = async () => {
      const outerClosedClipPath = "inset(0 0 100% 0 round var(--nav-outer-r))";
      const outerOpenClipPath = "inset(0 0 0% 0 round var(--nav-outer-r))";
      const innerClosedClipPath = "inset(0 0 100% 0 round var(--nav-inner-r))";
      const innerOpenClipPath = "inset(0 0 0% 0 round var(--nav-inner-r))";
      const outerOpenTarget = {
        opacity: 1,
        clipPath: outerOpenClipPath,
        transition: prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.24, ease: easeOutExpo },
      } as unknown as TargetAndTransition;
      const outerClosedTarget = {
        opacity: 0,
        clipPath: outerClosedClipPath,
        transition: prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.22, ease: easeOutExpo },
      } as unknown as TargetAndTransition;
      const innerOpenTarget = {
        opacity: 1,
        clipPath: innerOpenClipPath,
        transition: prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.24, ease: easeOutExpo },
      } as unknown as TargetAndTransition;
      const innerClosedTarget = {
        opacity: 0,
        clipPath: innerClosedClipPath,
        transition: prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.22, ease: easeOutExpo },
      } as unknown as TargetAndTransition;
      const outerOpeningTarget = prefersReducedMotion
        ? outerOpenTarget
        : ({
            opacity: [0, 1, 1],
            clipPath: [
              outerClosedClipPath,
              outerOpenClipPath,
              outerOpenClipPath,
            ],
            transition: {
              duration: 0.24,
              ease: easeOutExpo,
              times: [0, 0.9, 1],
            },
          } as unknown as TargetAndTransition);
      const innerOpeningTarget = prefersReducedMotion
        ? innerOpenTarget
        : ({
            opacity: [0, 1, 1],
            clipPath: [
              innerClosedClipPath,
              innerOpenClipPath,
              innerOpenClipPath,
            ],
            transition: {
              duration: 0.24,
              ease: easeOutExpo,
              times: [0, 0.9, 1],
            },
          } as unknown as TargetAndTransition);

      if (menuPhase === "opening") {
        const shellReveal = Promise.all([
          outerShellControls.start(outerOpeningTarget),
          innerShellControls.start(innerOpeningTarget),
        ]);
        void menuListControls.start("open");
        void contactControls.start("open");
        await shellReveal;
        if (!cancelled) {
          onOpenComplete();
        }
        return;
      }

      if (menuPhase === "open") {
        void outerShellControls.start(outerOpenTarget);
        void innerShellControls.start(innerOpenTarget);
        void menuListControls.start("open");
        void contactControls.start("open");
        return;
      }

      if (menuPhase === "closingItems") {
        await Promise.all([
          menuListControls.start("closed"),
          contactControls.start("closed"),
        ]);
        if (!cancelled) {
          onItemsClosed();
        }
        return;
      }

      if (menuPhase === "closingShell") {
        await outerShellControls.start({
          "--nav-outer-pad": "0px",
          transition: prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.16, ease: easeOutExpo },
        } as unknown as TargetAndTransition);
        await Promise.all([
          outerShellControls.start(outerClosedTarget),
          innerShellControls.start(innerClosedTarget),
        ]);
        outerShellControls.set({
          "--nav-outer-pad": "var(--nav-inset)",
        } as unknown as TargetAndTransition);
        if (!cancelled) {
          onShellClosed();
        }
        return;
      }

      outerShellControls.set(outerClosedTarget);
      innerShellControls.set(innerClosedTarget);
      menuListControls.set("closed");
      contactControls.set("closed");
    };

    void syncPhase();

    return () => {
      cancelled = true;
    };
  }, [
    contactControls,
    innerShellControls,
    menuListControls,
    menuPhase,
    onItemsClosed,
    onOpenComplete,
    onShellClosed,
    outerShellControls,
    prefersReducedMotion,
  ]);

  return (
    <div className={cn("relative xl:hidden", NAV_MOBILE_RADIUS_VARS)}>
      <motion.div
        layout
        data-navbar-mobile-shell
        className={cn(
          NAV_OUTER_CLASS,
          "w-full",
          navOuterSurfaceClass(isScrolled),
        )}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          data-navbar-row
          className="flex items-center justify-between gap-[11px] px-[14px] py-[6px] md:gap-3 md:px-5 md:py-2.5"
        >
          <div data-navbar-brand className="flex shrink-0 items-center">
            <Link
              href="/"
              className="focus-ring inline-flex shrink-0 items-center gap-[11px] rounded-lg py-[3px] group md:gap-3 md:py-1"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                <Image
                  src="/brand/logo.svg"
                  alt={`${siteConfig.teamName} logo`}
                  width={36}
                  height={36}
                  priority
                  className="relative z-10 h-[25px] w-[25px] md:h-9 md:w-9"
                />
              </div>
              <span className="whitespace-nowrap font-heading text-[12px] leading-[18px] tracking-[0.14em] md:text-base md:leading-normal text-white/90 group-hover:text-white transition-colors">
                {siteConfig.teamName}
              </span>
            </Link>
          </div>

          <motion.button
            type="button"
            onClick={onToggle}
            aria-controls="mobile-nav-dropdown"
            aria-expanded={isOpen}
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            disabled={interactionLocked}
            className={cn(
              "focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-colors duration-200 hover:text-white",
              NAV_INNER_GLASS_CLASS,
            )}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={isOpen ? "close" : "open"}
                initial={
                  prefersReducedMotion
                    ? false
                    : { opacity: 0, rotate: -60, scale: 0.92 }
                }
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={
                  prefersReducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, rotate: 60, scale: 0.92 }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.18, ease: easeOutExpo }
                }
                className="inline-flex"
              >
                {isOpen ? (
                  <X className="h-[13px] w-[13px] md:h-[18px] md:w-[18px]" />
                ) : (
                  <Menu className="h-[13px] w-[13px] md:h-[18px] md:w-[18px]" />
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      <div
        id="mobile-nav-dropdown"
        className="absolute left-0 right-0 top-full z-[55] mt-3"
        style={{
          pointerEvents: isOpen && !interactionLocked ? "auto" : "none",
        }}
      >
        <div className="mx-auto w-full max-w-[760px]">
          <motion.div
            animate={outerShellControls}
            initial={false}
            className={cn(
              NAV_MENU_PANEL_CLASS,
              "overflow-hidden",
              NAV_MOBILE_DROPDOWN_INSET_CLASS,
              NAV_MOBILE_OUTER_RADIUS_CLASS,
              navOuterSurfaceClass(isScrolled),
            )}
            style={{
              opacity: 0,
              clipPath: "inset(0 0 100% 0 round var(--nav-outer-r))",
              willChange: "clip-path, opacity, transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          >
            <div
              className={cn(
                "flex flex-col",
                NAV_MOBILE_DROPDOWN_STACK_GAP_CLASS,
              )}
            >
              <motion.div
                animate={innerShellControls}
                initial={false}
                className={cn(
                  NAV_INNER_GLASS_CLASS,
                  NAV_MOBILE_DROPDOWN_INNER_RADIUS_CLASS,
                  "p-2 sm:p-2.5",
                )}
                style={{
                  opacity: 0,
                  clipPath: "inset(0 0 100% 0 round var(--nav-inner-r))",
                  willChange: "clip-path, opacity, transform",
                  transform: "translateZ(0)",
                  backfaceVisibility: "hidden",
                }}
              >
                <motion.ul
                  animate={menuListControls}
                  initial="closed"
                  variants={mobileMenuListVariants}
                  className="space-y-1.5"
                  aria-label="Mobile navigation"
                >
                  {navLinks.map((item) => {
                    const isActive = isRouteActive(pathname, item.href);

                    return (
                      <motion.li
                        key={`mobile-menu-${item.href}`}
                        variants={mobileMenuItemVariants}
                      >
                        <Link
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          onClick={(event) => {
                            event.preventDefault();
                            onNavigateRequest(item.href);
                          }}
                          className={cn(
                            navItemClasses({
                              variant: "desktop",
                              active: isActive,
                            }),
                            "relative flex w-full items-center rounded-full !px-4 !py-3 text-left",
                          )}
                        >
                          {isActive ? (
                            <motion.span
                              layoutId="nav-active-pill-mobile-dropdown"
                              className="absolute inset-0 rounded-full bg-white/10 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                              transition={
                                prefersReducedMotion
                                  ? { duration: 0 }
                                  : navIndicatorTransition
                              }
                            />
                          ) : null}
                          <span className="relative z-10 text-[0.8rem] tracking-widest">
                            {item.label}
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </motion.div>

              <motion.div
                animate={contactControls}
                initial="closed"
                variants={mobileMenuItemVariants}
                className="w-full"
              >
                <Link
                  href={contactLink.href}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigateRequest(contactLink.href);
                  }}
                  className={cn(
                    buttonClasses({ variant: "gold", size: "md" }),
                    "w-full justify-center",
                    NAV_MOBILE_DROPDOWN_CONTACT_RADIUS_CLASS,
                  )}
                >
                  {contactLink.label}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const desktopNavLinks = siteContent.navigation.filter(
    (item) => item.href !== "/contact",
  );
  const mobileNavLinks = mobilePrimaryRouteOrder
    .map((href) => siteContent.navigation.find((item) => item.href === href))
    .filter((item): item is NavigationItem => Boolean(item));
  const contactLink = siteContent.navigation.find(
    (item) => item.href === "/contact",
  ) ?? {
    label: "Contact",
    href: "/contact",
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [isGlobalModalOpen, setIsGlobalModalOpen] = useState(false);
  const [mobileMenuPhase, setMobileMenuPhase] =
    useState<MobileMenuPhase>("closed");
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const isScrolledRef = useRef(false);
  const pathnameRef = useRef(pathname);
  const closeSequenceResolveRef = useRef<(() => void) | null>(null);
  const closeSequencePromiseRef = useRef<Promise<void> | null>(null);
  const isMobileMenuOpen = mobileMenuPhase !== "closed";
  const isMobileInteractionLocked =
    pendingHref !== null ||
    mobileMenuPhase === "closingItems" ||
    mobileMenuPhase === "closingShell";
  const navbarY = useSpring(isScrolled ? 0 : NAV_SCROLL_DOWNSHIFT_PX, {
    stiffness: 280,
    damping: 34,
    mass: 1,
    restDelta: 0.5,
  });

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    navbarY.set(isScrolled ? 0 : NAV_SCROLL_DOWNSHIFT_PX);
  }, [isScrolled, navbarY, prefersReducedMotion]);

  const resolveCloseSequence = useCallback(() => {
    closeSequenceResolveRef.current?.();
    closeSequenceResolveRef.current = null;
    closeSequencePromiseRef.current = null;
  }, []);

  const ensureMobileMenuClosed = useCallback((): Promise<void> => {
    if (mobileMenuPhase === "closed") {
      return Promise.resolve();
    }

    if (!closeSequencePromiseRef.current) {
      closeSequencePromiseRef.current = new Promise<void>((resolve) => {
        closeSequenceResolveRef.current = resolve;
      });
    }

    setMobileMenuPhase((previousPhase) => {
      if (previousPhase === "closed" || previousPhase === "closingShell") {
        return previousPhase;
      }
      return "closingItems";
    });

    return closeSequencePromiseRef.current;
  }, [mobileMenuPhase]);

  const requestMobileMenuClose = useCallback(() => {
    void ensureMobileMenuClosed();
  }, [ensureMobileMenuClosed]);

  const toggleMobileMenu = useCallback(() => {
    if (isMobileInteractionLocked) {
      return;
    }

    setMobileMenuPhase((previousPhase) => {
      if (previousPhase === "closed") {
        return "opening";
      }
      if (previousPhase === "opening" || previousPhase === "open") {
        return "closingItems";
      }
      return previousPhase;
    });
  }, [isMobileInteractionLocked]);

  const navigateAfterClose = useCallback(
    async (href: string) => {
      if (isMobileInteractionLocked) {
        return;
      }

      setPendingHref(href);
      await ensureMobileMenuClosed();
      setPendingHref(null);

      if (href !== pathnameRef.current) {
        router.push(href);
      }
    },
    [ensureMobileMenuClosed, isMobileInteractionLocked, router],
  );

  const handleMobileOpenComplete = useCallback(() => {}, []);

  const handleMobileItemsClosed = useCallback(() => {
    setMobileMenuPhase((previousPhase) =>
      previousPhase === "closingItems" ? "closingShell" : previousPhase,
    );
  }, []);

  const handleMobileShellClosed = useCallback(() => {
    setMobileMenuPhase("closed");
    resolveCloseSequence();
  }, [resolveCloseSequence]);

  /* 
   * Scroll Sync Logic
   * 
   * Uses `requestAnimationFrame` for performance-friendly scroll detection.
   * Toggles `isScrolled` state which drives the navbar's appearance (glass effect/opacity).
   */
  useEffect(() => {
    setIsGlobalModalOpen(readGlobalModalOpenState());

    const handleModalState = (event: Event) => {
      const modalEvent = event as CustomEvent<GlobalModalStateDetail>;
      setIsGlobalModalOpen(Boolean(modalEvent.detail?.open));
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
    const threshold = 12;
    const scrollRoot = getScrollRoot();

    const syncScrollState = () => {
      rafRef.current = null;
      const nextScrollTop =
        scrollRoot instanceof Window ? scrollRoot.scrollY : scrollRoot.scrollTop;
      const nextScrolled = nextScrollTop > threshold;
      if (nextScrolled !== isScrolledRef.current) {
        isScrolledRef.current = nextScrolled;
        setIsScrolled(nextScrolled);
      }
    };

    const handleScroll = () => {
      if (isGlobalModalOpen) {
        return;
      }
      if (rafRef.current !== null) {
        return;
      }
      rafRef.current = window.requestAnimationFrame(syncScrollState);
    };

    syncScrollState();
    scrollRoot.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      scrollRoot.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isGlobalModalOpen, pathname]);

  useEffect(() => {
    setMobileMenuPhase("closed");
    setPendingHref(null);
    resolveCloseSequence();
  }, [pathname, resolveCloseSequence]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestMobileMenuClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen, requestMobileMenuClose]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    const handleBreakpointChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMobileMenuPhase("closed");
        setPendingHref(null);
        resolveCloseSequence();
      }
    };

    if (mediaQuery.matches) {
      setMobileMenuPhase("closed");
      setPendingHref(null);
      resolveCloseSequence();
    }

    mediaQuery.addEventListener("change", handleBreakpointChange);

    return () => {
      mediaQuery.removeEventListener("change", handleBreakpointChange);
    };
  }, [resolveCloseSequence]);

  return (
    <>
      <AnimatePresence initial={false}>
        {isMobileMenuOpen ? (
          <motion.button
            key="mobile-nav-backdrop"
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-0 z-40 bg-black/48 backdrop-blur-[2px] xl:hidden"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.22, ease: easeOutExpo }
            }
            onClick={requestMobileMenuClose}
          />
        ) : null}
      </AnimatePresence>

      <motion.header
        className={cn(
          "fixed inset-x-0 z-50 mx-auto w-[calc(100%-2rem)] max-w-[1200px] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-5rem)] 2xl:w-[calc(100%-6rem)]",
          "top-[10px] md:top-[21px]",
        )}
        style={{
          y: prefersReducedMotion
            ? isScrolled
              ? 0
              : NAV_SCROLL_DOWNSHIFT_PX
            : navbarY,
          willChange: "transform",
        }}
      >
        <NavbarDesktop
          isScrolled={isScrolled}
          pathname={pathname}
          navLinks={desktopNavLinks}
          prefersReducedMotion={Boolean(prefersReducedMotion)}
        />
        <NavbarMobile
          isScrolled={isScrolled}
          pathname={pathname}
          navLinks={mobileNavLinks}
          contactLink={contactLink}
          prefersReducedMotion={Boolean(prefersReducedMotion)}
          menuPhase={mobileMenuPhase}
          interactionLocked={isMobileInteractionLocked}
          onToggle={toggleMobileMenu}
          onNavigateRequest={navigateAfterClose}
          onOpenComplete={handleMobileOpenComplete}
          onItemsClosed={handleMobileItemsClosed}
          onShellClosed={handleMobileShellClosed}
        />
      </motion.header>
    </>
  );
}
