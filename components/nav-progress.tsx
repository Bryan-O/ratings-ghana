"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Thin ink line along the top of the page while a navigation is in flight.
 * It starts on a same-site link click or GET form submit, and stops once the URL changes.
 */
export function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const here = search ? `${pathname}?${search}` : pathname;
  // The URL the navigation started from; the bar shows while we're still on it.
  const [from, setFrom] = useState<string | null>(null);
  const active = from === here;

  useEffect(() => {
    const start = (target: URL) => {
      if (target.origin !== location.origin) return;
      if (target.pathname + target.search === location.pathname + location.search) return;
      setFrom(location.pathname + location.search);
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      start(new URL(a.href, location.href));
    };
    const onSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (e.defaultPrevented || form.method.toLowerCase() !== "get") return;
      const url = new URL(form.action || location.href, location.href);
      url.search = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      start(url);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
    };
  }, []);

  // Give up after a while so a cancelled navigation never leaves the bar running.
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setFrom(null), 10000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden">
      <div
        className={`h-full w-full origin-left bg-coral transition-opacity duration-200 motion-safe:animate-progress ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
