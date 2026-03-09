"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { OffthreadVideo, staticFile } from "remotion";
import {
  GLOBAL_MODAL_STATE_EVENT,
  type GlobalModalStateDetail,
  readGlobalModalOpenState,
} from "@/lib/modalRuntime";

export default function PersistentHeroVideo() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isHome = pathname === "/";

  // 1. Using strict rgba() instead of "transparent" fixes cross-browser hard lines.
  // 2. Ending at 95% ensures it hits true zero opacity *before* the container ends.
  const heroMediaMaskStyle: CSSProperties = {
    maskImage:
      "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)",
    WebkitMaskImage:
      "linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 95%)",
    transform: "translateZ(0)",
  };

  useEffect(() => {
    if (typeof window === "undefined") {
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

  const shouldShowHeroVideo = isHome && !isModalOpen;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 w-full overflow-hidden"
      style={{
        zIndex: 0,
        height: "var(--hero-stage-height)", // Matches hero section height
        opacity: shouldShowHeroVideo ? 1 : 0,
        pointerEvents: "none",
      }}
    >
      <div
        data-hero-bg-stack
        className="absolute inset-0 left-1/2 -translate-x-1/2 w-screen h-full"
        style={heroMediaMaskStyle}
      >
        {/* Because the mask is on the parent, this matte background now fades out too */}
        <div data-hero-matte className="absolute inset-0 bg-[#050505]" />

        <div
          data-hero-media-wrapper
          className="absolute inset-x-0 top-0 h-full overflow-hidden"
        >
          {/* 
            High-priority static image serves as immediate LCP element.
            Fades out or stays behind video as a fallback.
           */}
          <Image
            src="/brand/hero.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />

          <OffthreadVideo
            src={staticFile("brand/hero.mp4")}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: shouldShowHeroVideo ? 1 : 0,
              willChange: "opacity",
            }}
            muted
          />
        </div>
      </div>
    </div>
  );
}
