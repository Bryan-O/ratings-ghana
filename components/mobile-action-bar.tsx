"use client";

import { useEffect, useState } from "react";

/**
 * Phone-only bar pinned to the bottom of the screen with the page's one main action.
 * It appears once `watch` (e.g. the header button) scrolls away, and hides while `target` is on screen.
 */
export function MobileActionBar({ watch, target, children }: { watch: string; target: string; children: React.ReactNode }) {
  const [watchGone, setWatchGone] = useState(false);
  const [targetShown, setTargetShown] = useState(false);

  useEffect(() => {
    const w = document.getElementById(watch);
    const t = document.getElementById(target);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === w) setWatchGone(!e.isIntersecting && e.boundingClientRect.top < 0);
        if (e.target === t) setTargetShown(e.isIntersecting);
      }
    });
    if (w) io.observe(w);
    if (t) io.observe(t);
    return () => io.disconnect();
  }, [watch, target]);

  const shown = watchGone && !targetShown;
  return (
    <div
      data-action-bar={shown ? "shown" : "hidden"}
      aria-hidden={!shown}
      inert={!shown}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 lg:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {children}
    </div>
  );
}
