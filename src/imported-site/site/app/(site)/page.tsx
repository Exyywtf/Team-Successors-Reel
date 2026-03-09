import HomeContent from "./HomeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Successors | F1 in Schools",
  description:
    "Official website of Successors. Inheriting the Legacy. Defining the Future.",
};

export default function HomePage() {
  return <HomeContent />;
}

