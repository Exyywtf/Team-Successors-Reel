export type SponsorTier = "Champion" | "Nitro" | "Turbo" | "Speed" | "Support";

export interface TeamInfo {
  name: string;
  tagline: string;
  school: string;
  location: string;
  email: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
  kineticWords: string[];
}

export interface HighlightItem {
  title: string;
  description: string;
  metric: string;
}

export interface SnapshotItem {
  stage: string;
  detail: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  achievements: string[];
  bio: string;
  image: string;
  imageSrc: string;
}

export interface Sponsor {
  name: string;
  tier: SponsorTier;
  description: string;
  logo: string;
}

export interface TimelineStep {
  title: string;
  tool: string;
  description: string;
  outcome: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "Renders" | "CFD" | "Events" | "Outreach";
  image: string;
  description?: string;
  tag?: "renders" | "cfd" | "events" | "outreach";
  mediaType?: "render" | "cfd" | "background";
  mediaSrc?: string;
  mediaAlt?: string;
  caption: string;
}

export interface SponsorshipTier {
  name: Exclude<SponsorTier, "Support">;
  minimumAed: string;
  benefits: string[];
}

export interface StatItem {
  label: string;
  value: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteContent {
  teamInfo: TeamInfo;
  navigation: NavigationItem[];
  hero: HeroContent;
  home: {
    sponsorStripTitle: string;
    highlights: HighlightItem[];
    engineeringSnapshot: SnapshotItem[];
    outreachSnapshot: {
      title: string;
      description: string;
      bullets: string[];
    };
    deck: {
      title: string;
      description: string;
    };
  };
  teamPage: {
    title: string;
    subtitle: string;
  };
  teamMembers: TeamMember[];
  sponsors: Sponsor[];
  engineeringPage: {
    title: string;
    subtitle: string;
    timeline: TimelineStep[];
    gallery: GalleryItem[];
  };
  enterprisePage: {
    title: string;
    subtitle: string;
    pitch: string;
    tiers: SponsorshipTier[];
    stats: StatItem[];
    gallery: GalleryItem[];
    outreach: {
      title: string;
      description: string;
      items: string[];
    };
    faqs: FaqItem[];
  };
  sponsorsPage: {
    title: string;
    subtitle: string;
    spotlightTitle: string;
    ctaTitle: string;
    ctaDescription: string;
  };
  contactPage: {
    title: string;
    subtitle: string;
    intro: string;
    socialPrompt: string;
  };
  buildBrief: {
    source: string;
    missingInputCheck: string[];
    brandVoice: string[];
    keyClaims: string[];
    sponsorshipTiers: string[];
    copyDraft: {
      heroHeadline: string;
      heroSubheadline: string;
      whatWeDo: string[];
      sponsorPitch: string;
    };
  };
}
