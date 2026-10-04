"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sticky header that slides out of the way while you scroll down on phones and tablets,
 * and comes back as soon as you scroll up. It stays put on desktop and while its menu is open.
 */
export function AutoHideHeader({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - last;
        if (Math.abs(delta) < 6) return;
        const menuOpen = ref.current?.querySelector('[aria-expanded="true"]');
        const focusInside = ref.current?.contains(document.activeElement);
        const wide = window.matchMedia("(min-width: 1024px)").matches;
        setHidden(delta > 0 && y > 120 && !menuOpen && !focusInside && !wide);
        last = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      ref={ref}
      data-hidden={hidden}
      className={`sticky top-0 z-40 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"} ${className}`}
    >
      {children}
    </header>
  );
}
