import type { CSSProperties } from "react";

export const TEAM_MEDIA_BACKGROUND_CLASS =
  "media-pop absolute inset-0 z-0 media-wrapper-gallery-bg bg-cover bg-center bg-no-repeat";

export const TEAM_MEDIA_OVERLAY_SIZE_CLASS = "h-[88%] w-[88%] object-contain";

export const TEAM_MEDIA_FADE_STYLE: CSSProperties = {
  maskImage:
    "linear-gradient(to bottom, rgba(0,0,0,1) 68%, rgba(0,0,0,0.95) 80%, rgba(0,0,0,0.8) 88%, rgba(0,0,0,0.56) 93%, rgba(0,0,0,0.3) 97%, rgba(0,0,0,0.12) 99%, rgba(0,0,0,0) 100%)",
  WebkitMaskImage:
    "linear-gradient(to bottom, rgba(0,0,0,1) 68%, rgba(0,0,0,0.95) 80%, rgba(0,0,0,0.8) 88%, rgba(0,0,0,0.56) 93%, rgba(0,0,0,0.3) 97%, rgba(0,0,0,0.12) 99%, rgba(0,0,0,0) 100%)",
  transform: "translateZ(0)",
  willChange: "transform, opacity",
};
