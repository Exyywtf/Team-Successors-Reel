import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind classes with proper collision detection.
 * Uses `clsx` for conditional logic and `tailwind-merge` to resolve conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a properly encoded mailto link.
 * Ensures subject and body parameters are URL-safe.
 */
export function createMailtoLink({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
}
