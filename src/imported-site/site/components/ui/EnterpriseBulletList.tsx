"use client";

import { cn } from "@/lib/utils";

interface EnterpriseBulletListProps {
  items: string[];
  className?: string;
  itemClassName?: string;
  bulletClassName?: string;
  itemKeyPrefix?: string;
}

export default function EnterpriseBulletList({
  items,
  className,
  itemClassName,
  bulletClassName,
  itemKeyPrefix = "enterprise-bullet",
}: EnterpriseBulletListProps) {
  return (
    <ul className={cn("space-y-2 text-sm muted-copy", className)}>
      {items.map((item, index) => (
        <li
          key={`${itemKeyPrefix}-${index}-${item}`}
          className={cn("flex gap-2", itemClassName)}
        >
          <span
            aria-hidden
            className={cn("text-[var(--accent)]", bulletClassName)}
          >
            &bull;
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
