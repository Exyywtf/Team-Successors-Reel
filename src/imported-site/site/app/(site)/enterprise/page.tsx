import EnterpriseContent from "./EnterpriseContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise Portfolio | Successors",
  description:
    "Explore our enterprise strategy, sponsorship value, and financial planning. We deliver measurable ROI for our sponsors.",
  alternates: {
    canonical: "/enterprise",
  },
};

export default function EnterprisePage() {
  return <EnterpriseContent />;
}
