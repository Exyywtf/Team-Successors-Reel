import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import GlobalModalHost from "@/components/modals/GlobalModalHost";
import CinematicBackground from "@/components/layout/CinematicBackground";
import SiteLayoutFrame from "@/components/layout/SiteLayoutFrame";
import PersistentHeroVideo from "@/components/PersistentHeroVideo";

export const metadata: Metadata = {
  title: "Successors | F1 in Schools",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate min-h-[100dvh] bg-transparent text-main">
      <CinematicBackground />
      <div className="relative z-[1] flex min-h-[100dvh] flex-col bg-transparent">
        <PersistentHeroVideo />
        <Navbar />
        <SiteLayoutFrame>{children}</SiteLayoutFrame>
      </div>
      <GlobalModalHost />
    </div>
  );
}
