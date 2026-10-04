/**
 * Shared motion settings. CSS tokens with the same values live in app/globals.css
 * (--ease-spring, --ease-out-soft, the keyframes and the reveal rules); keep the two in sync.
 */
export const EASE_SPRING = "cubic-bezier(0.34, 1.56, 0.64, 1)";
export const EASE_OUT_SOFT = "cubic-bezier(0.22, 1, 0.36, 1)";

export const DURATION = {
  /** Hovers, presses, focus. */
  fast: 180,
  /** Page-load and scroll reveals. */
  reveal: 500,
} as const;

/** Gap between items that animate in one after another. */
export const STAGGER = {
  words: 70,
  cards: 60,
  stars: 45,
} as const;

/** True when the visitor asked for less motion (or when there is no window, e.g. on the server). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Inline script for <head>: turns motion on before first paint, so scroll-reveal items can
 * start hidden without a flash. Reduced-motion visitors never get the attribute.
 */
export const MOTION_BOOT_SCRIPT = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.motion="on"}catch(e){}`;

/** Shake an element once (validation errors). Uses the Web Animations API; no-op with reduced motion. */
export function shake(el: Element | null | undefined) {
  if (!el || prefersReducedMotion() || !("animate" in el)) return;
  (el as HTMLElement).animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(-3px)" },
      { transform: "translateX(2px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 300, easing: "ease-in-out" },
  );
}
