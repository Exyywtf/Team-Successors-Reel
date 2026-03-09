export const NAV_OUTER_CLASS = "nav-shell";

export const NAV_OUTER_SURFACE_IDLE_CLASS =
  "border-transparent bg-[var(--nav-bg-idle)]";

export const NAV_OUTER_SURFACE_SCROLLED_CLASS =
  "border-[color:color-mix(in_srgb,var(--accent)_58%,transparent)] bg-[var(--nav-bg-scrolled)] shadow-[var(--glow-purple-soft)]";

export const NAV_INNER_GLASS_CLASS =
  "nav-inner-glass border border-[rgba(255,255,255,0.10)] bg-[var(--nav-inner-bg)] shadow-inner";

export const NAV_MENU_PANEL_CLASS = NAV_OUTER_CLASS;

export const NAV_MOBILE_RADIUS_VARS =
  "[--nav-outer-r:calc(var(--radius)+8px)] [--nav-inset:0.5rem] sm:[--nav-inset:0.75rem] [--nav-inner-r:calc(var(--nav-outer-r)-var(--nav-inset))] [--nav-contact-r:calc(var(--nav-outer-r)-var(--nav-inset))] [--nav-outer-pad:var(--nav-inset)]";

export const NAV_MOBILE_OUTER_RADIUS_CLASS =
  "[border-radius:var(--nav-outer-r)]";

export const NAV_MOBILE_DROPDOWN_INNER_RADIUS_CLASS =
  "[border-radius:var(--nav-inner-r)]";

export const NAV_MOBILE_DROPDOWN_CONTACT_RADIUS_CLASS =
  "[border-radius:var(--nav-contact-r)]";

export const NAV_MOBILE_DROPDOWN_INSET_CLASS = "[padding:var(--nav-outer-pad)]";

export const NAV_MOBILE_DROPDOWN_STACK_GAP_CLASS = "gap-[var(--nav-inset)]";

export function navOuterSurfaceClass(isScrolled: boolean) {
  return isScrolled
    ? NAV_OUTER_SURFACE_SCROLLED_CLASS
    : NAV_OUTER_SURFACE_IDLE_CLASS;
}
