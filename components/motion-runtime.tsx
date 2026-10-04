"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Site-wide motion helpers, mounted once in the root layout:
 * - marks the page ready, so scroll reveals take over from the CSS safety net;
 * - lets :active press states fire on iOS touch (Safari needs a touchstart listener);
 * - adds the colour-wash ripple to elements with the `ripple` class, from the tap point.
 */
export function MotionRuntime() {
  useEffect(() => {
    const root = document.documentElement;
    // On a slow load the CSS safety net may already have shown hidden items; keep them shown.
    if (performance.now() > 2400) {
      document.querySelectorAll<HTMLElement>("[data-reveal-group] > *").forEach((el) => (el.dataset.shown = ""));
    }
    root.dataset.motionReady = "";

    const onTouch = () => {};
    document.addEventListener("touchstart", onTouch, { passive: true });

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || prefersReducedMotion()) return;
      const host = (e.target as Element).closest?.<HTMLElement>(".ripple");
      if (!host || host.matches(":disabled, [aria-disabled='true']")) return;
      const rect = host.getBoundingClientRect();
      const size = Math.hypot(rect.width, rect.height) * 2;
      const dot = document.createElement("span");
      dot.setAttribute("aria-hidden", "true");
      dot.className = "pointer-events-none absolute animate-ripple rounded-full bg-current";
      Object.assign(dot.style, {
        left: `${e.clientX - rect.left}px`,
        top: `${e.clientY - rect.top}px`,
        width: `${size}px`,
        height: `${size}px`,
      });
      host.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove(), { once: true });
    };
    document.addEventListener("pointerdown", onPointerDown, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouch);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return null;
}
