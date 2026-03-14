"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import ImageWithFallback from "@/components/ImageWithFallback";
import {
  TEAM_MEDIA_BACKGROUND_CLASS,
  TEAM_MEDIA_FADE_STYLE,
  TEAM_MEDIA_OVERLAY_SIZE_CLASS,
} from "@/components/media/teamMediaStyles";
import { navIndicatorTransition } from "@/components/motion";
import { navItemClasses } from "@/components/uiClasses";
import type { GalleryItem } from "@/types/content";

const defaultTabs = ["All", "Renders", "CFD", "Events", "Outreach"] as const;
type GalleryTab = (typeof defaultTabs)[number];

interface GalleryGridProps {
  items: GalleryItem[];
  tabs?: readonly GalleryTab[];
  defaultTab?: GalleryTab;
  hideTabNotch?: boolean;
  showTabs?: boolean;
}

export default function GalleryGrid({
  items,
  tabs = defaultTabs,
  defaultTab,
  hideTabNotch = false,
  showTabs = true,
}: GalleryGridProps) {
  const prefersReducedMotion = useReducedMotion();
  const resolvedDefaultTab =
    defaultTab && tabs.includes(defaultTab) ? defaultTab : (tabs[0] ?? "All");
  const [activeTab, setActiveTab] = useState<GalleryTab>(resolvedDefaultTab);

  useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab(resolvedDefaultTab);
    }
  }, [activeTab, resolvedDefaultTab, tabs]);

  /*
   * Filter Logic
   * 
   * Memoized filtering based on the active tab.
   * Matches item tags/categories against the selected tab (case-insensitive).
   * Returns all items if "All" is selected.
   */
  const filteredItems = useMemo(() => {
    if (activeTab === "All") {
      return items;
    }

    const activeTag = activeTab.toLowerCase();
    return items.filter((item) => {
      const itemTag = item.tag ?? item.category.toLowerCase();
      return itemTag === activeTag;
    });
  }, [activeTab, items]);

  return (
    <div>
      {showTabs ? (
        <div
          role="tablist"
          aria-label="Engineering gallery filters"
          className="mb-6 flex flex-wrap gap-2"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                id={`gallery-tab-${tab.toLowerCase()}`}
                role="tab"
                aria-selected={isActive}
                aria-controls="gallery-panel"
                type="button"
                onClick={() => setActiveTab(tab)}
                className={navItemClasses({ variant: "tab", active: isActive })}
              >
                {isActive && !hideTabNotch ? (
                  <motion.span
                    layoutId="gallery-tab-indicator"
                    className="absolute inset-0 rounded-full bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)]"
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : navIndicatorTransition
                    }
                  />
                ) : null}
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        role="tabpanel"
        id="gallery-panel"
        aria-labelledby={`gallery-tab-${activeTab.toLowerCase()}`}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
          {filteredItems.map((item) => {
            const usesEngineeringMedia = Boolean(
              item.mediaType && item.mediaSrc,
            );
            const isRenderMedia =
              usesEngineeringMedia && item.mediaType === "render";
            const isCfdMedia = usesEngineeringMedia && item.mediaType === "cfd";
            const isBackgroundMedia =
              usesEngineeringMedia && item.mediaType === "background";

            return (
              <div
                key={item.id}
              >
                <Card className="overflow-hidden">
                  <div
                    className="relative h-52 w-full overflow-hidden"
                    data-engineering-media-wrapper={
                      usesEngineeringMedia ? "1" : undefined
                    }
                  >
                    {isRenderMedia ? (
                      <>
                        <div
                          aria-hidden="true"
                          className={TEAM_MEDIA_BACKGROUND_CLASS}
                          style={TEAM_MEDIA_FADE_STYLE}
                        />
                        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                          <ImageWithFallback
                            src={item.mediaSrc ?? item.image}
                            alt={item.mediaAlt ?? item.title}
                            width={900}
                            height={620}
                            className={TEAM_MEDIA_OVERLAY_SIZE_CLASS}
                          />
                        </div>
                      </>
                    ) : isCfdMedia || isBackgroundMedia ? (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 overflow-hidden"
                        style={TEAM_MEDIA_FADE_STYLE}
                      >
                        <ImageWithFallback
                          src={item.mediaSrc ?? item.image}
                          alt={item.mediaAlt ?? item.title}
                          width={900}
                          height={620}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <>
                        <ImageWithFallback
                          src={item.image}
                          alt={item.title}
                          width={900}
                          height={620}
                          className="h-52 w-full object-cover"
                        />
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(58, 12, 163, 0) 20%, rgba(10, 10, 14, 0.52) 66%, rgba(5, 5, 5, 0.82) 100%)",
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div className="card-pad-compact">
                    <p className="tier-chip mb-3 w-fit">{item.category}</p>
                    <h3 className="font-heading text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm muted-copy">{item.caption}</p>
                  </div>
                </Card>
              </div>
            );
          })}
      </div>
    </div>
  );
}
