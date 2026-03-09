import { cn } from "@/lib/utils";

export type LinkVariant = "inline" | "footer";
export type LinkTone = "default" | "accent";

export function linkClasses({
  variant = "inline",
  tone = "default",
  className,
}: {
  variant?: LinkVariant;
  tone?: LinkTone;
  className?: string;
}) {
  return cn(
    "focus-ring",
    variant === "inline"
      ? "link-inline rounded px-1 py-0.5 transition-colors duration-200"
      : "footer-link-lightup rounded-md px-1 py-0.5",
    tone === "accent" && "text-[var(--accent)]",
    className,
  );
}

export type NavItemVariant = "desktop" | "mobileLabel" | "tab";

export function navItemClasses({
  variant,
  active = false,
  className,
}: {
  variant: NavItemVariant;
  active?: boolean;
  className?: string;
}) {
  if (variant === "desktop") {
    return cn(
      "nav-link focus-ring relative px-5 py-2 transition-colors duration-200",
      active ? "text-white font-medium" : "text-white/60 hover:text-white",
      className,
    );
  }

  if (variant === "mobileLabel") {
    return cn(
      "relative z-10 nav-link whitespace-nowrap !px-0 !py-0 text-xs tracking-widest",
      active ? "text-white font-medium" : "text-white/60",
      className,
    );
  }

  return cn(
    "focus-ring relative overflow-hidden rounded-full border px-4 py-2 text-xs uppercase tracking-[0.1em] transition-colors duration-200",
    active
      ? "border-[color:color-mix(in_srgb,var(--accent)_52%,transparent)] text-[var(--accent)]"
      : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-main",
    className,
  );
}

export function inputClasses(className?: string) {
  return cn("field-input", className);
}
