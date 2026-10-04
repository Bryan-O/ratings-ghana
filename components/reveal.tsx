"use client";

import { useEffect, useRef } from "react";
import { STAGGER, prefersReducedMotion } from "@/lib/motion";

/**
 * Reveal the direct children of `ref` as they scroll into view: each fades and slides up 16px,
 * with a 60ms stagger between items that appear together. New children (filters, "Show more")
 * are picked up automatically. The hidden starting state lives in globals.css.
 */
/** `resetKey`: change it when the list element itself is replaced (e.g. a keyed remount). */
export function useReveal<T extends HTMLElement>(ref: React.RefObject<T | null>, resetKey?: unknown) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const showAll = () => root.childNodes.forEach((n) => n instanceof HTMLElement && (n.dataset.shown = ""));
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      showAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entering = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        entering.forEach((el, i) => {
          el.style.setProperty("--reveal-delay", `${i * STAGGER.cards}ms`);
          el.dataset.shown = "";
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const watch = () =>
      root.childNodes.forEach((n) => {
        if (n instanceof HTMLElement && !("shown" in n.dataset)) io.observe(n);
      });
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(root, { childList: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [ref, resetKey]);
}

type Props = React.HTMLAttributes<HTMLElement> & { as?: "ul" | "div"; children: React.ReactNode };

/** A list or block whose direct children reveal on scroll (see useReveal). */
export function Reveal({ as = "div", children, ...rest }: Props) {
  const ulRef = useRef<HTMLUListElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  useReveal<HTMLElement>((as === "ul" ? ulRef : divRef) as React.RefObject<HTMLElement | null>);
  return as === "ul" ? (
    <ul ref={ulRef} data-reveal-group="" {...rest}>
      {children}
    </ul>
  ) : (
    <div ref={divRef} data-reveal-group="" {...rest}>
      {children}
    </div>
  );
}
