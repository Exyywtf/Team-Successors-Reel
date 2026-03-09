import rawContent from "@/content/siteContent.json";
import { normalizeBrandValue } from "@/lib/brandText";
import type { SiteContent } from "@/types/content";

export const siteContent = normalizeBrandValue(rawContent) as SiteContent;
