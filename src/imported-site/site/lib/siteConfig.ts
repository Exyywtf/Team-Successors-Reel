import type { NavigationItem } from "@/types/content";
import { CONTACT_EMAIL_ADDRESS } from "@/lib/emailCompose";

export const siteConfig = {
  teamName: "Successors",
  siteName: "Successors | F1 in Schools Team",
  siteUrl: "https://successorsf1.com",
  contactEmail: CONTACT_EMAIL_ADDRESS,
  locationText: "GEMS Founders School, Dubai, UAE.",
  socialLinks: [
    {
      label: "Instagram",
      href: "https://instagram.com/teamsuccessors",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/team-successors",
    },
  ] as const,
  defaultNavigation: [
    { label: "Home", href: "/" },
    { label: "Team", href: "/team" },
    { label: "Engineering", href: "/engineering" },
    { label: "Enterprise", href: "/enterprise" },
    { label: "Sponsors", href: "/sponsors" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ] as NavigationItem[],
};

export type SiteConfig = typeof siteConfig;
