import React, { useLayoutEffect, useMemo, useRef, type CSSProperties } from "react";
import { montserrat, orbitron } from "../../../lib/fonts";
import SiteLayout from "@/app/(site)/layout";
import HomePage from "@/app/(site)/page";
import EnterprisePage from "@/app/(site)/enterprise/page";
import EngineeringPage from "@/app/(site)/engineering/page";
import { SitePreviewProvider, useSitePreviewContext } from "@/runtime/SitePreviewContext";

export const SITE_PREVIEW_WIDTH = 1440;
export const SITE_PREVIEW_HEIGHT = 800;

export type SitePreviewPath = "/" | "/enterprise" | "/engineering";

const routeMap = {
  "/": HomePage,
  "/enterprise": EnterprisePage,
  "/engineering": EngineeringPage,
} as const;

const RouteRenderer: React.FC = () => {
  const { pathname } = useSitePreviewContext();
  const RouteComponent = routeMap[pathname as SitePreviewPath] ?? HomePage;

  return <RouteComponent />;
};

export const SitePreviewPage: React.FC<{
  pathname: SitePreviewPath;
  scrollProgress: number;
  previewStyle?: CSSProperties;
}> = ({ pathname, scrollProgress, previewStyle }) => {
  const scrollRootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (scrollRootRef.current) {
      const maxScroll = Math.max(
        0,
        scrollRootRef.current.scrollHeight - scrollRootRef.current.clientHeight,
      );
      scrollRootRef.current.scrollTop = maxScroll * scrollProgress;
    }
  }, [scrollProgress]);

  const rootStyle = useMemo<CSSProperties>(
    () => ({
      ["--font-orbitron" as const]: orbitron,
      ["--font-montserrat" as const]: montserrat,
    }) as CSSProperties,
    [],
  );

  return (
    <SitePreviewProvider pathname={pathname}>
      <div
        style={{
          width: SITE_PREVIEW_WIDTH,
          height: SITE_PREVIEW_HEIGHT,
          overflow: "hidden",
          background: "#050505",
          color: "#ffffff",
          ...rootStyle,
          ...previewStyle,
        }}
      >
        <div
          ref={scrollRootRef}
          data-site-root
          style={{
            width: "100%",
            height: "100%",
            overflowX: "hidden",
            overflowY: "auto",
            position: "relative",
            background: "#050505",
          }}
        >
          <SiteLayout>
            <RouteRenderer />
          </SiteLayout>
        </div>
      </div>
    </SitePreviewProvider>
  );
};
