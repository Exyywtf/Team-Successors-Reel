"use client";

import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import Footer from "@/components/layout/Footer";
import MotionPage from "@/components/MotionPage";
import { easeOutExpo } from "@/components/motion";

interface SiteLayoutFrameProps {
  children: React.ReactNode;
}

export default function SiteLayoutFrame({ children }: SiteLayoutFrameProps) {
  const prefersReducedMotion = useReducedMotion();
  const layoutTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.26, ease: easeOutExpo };

  return (
    <LayoutGroup id="site-layout-frame">
      <motion.main
        className="relative flex-1"
        layout={prefersReducedMotion ? false : "position"}
        transition={{ layout: layoutTransition }}
      >
        <MotionPage>{children}</MotionPage>
      </motion.main>

      <motion.div
        layout={prefersReducedMotion ? false : "position"}
        transition={{ layout: layoutTransition }}
      >
        <Footer />
      </motion.div>
    </LayoutGroup>
  );
}
