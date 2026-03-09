"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import type { CardType } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  sheen?: boolean;
  cardType?: CardType;
}

export default function Card({
  className,
  children,
  hover = true,
  sheen = true,
  cardType,
  ...props
}: CardProps) {
  const prefersReducedMotion = useReducedMotion();
  const cardTypeClass =
    cardType === "feature"
      ? "card-feature"
      : cardType === "pricing"
        ? "card-pricing"
        : cardType === "info"
          ? "card-info"
          : undefined;

  return (
    <div
      className={cn(
        "card-pro card-glow-rest tech-brackets group",
        sheen && "sheen",
        hover && !prefersReducedMotion && "card-hover",
        cardTypeClass,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
