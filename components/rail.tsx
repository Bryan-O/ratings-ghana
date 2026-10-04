"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { useReveal } from "@/components/reveal";
import { press } from "@/components/ui";

type Props = {
  children: React.ReactNode;
  /** Accessible name for the scrolling region. */
  label: string;
  /** Classes for the scrolling list. Add breakpoint classes (e.g. `lg:grid lg:grid-cols-4`) to turn it into a grid on wide screens. */
  className?: string;
  /** Show the previous/next buttons (hidden automatically when nothing overflows). */
  arrows?: boolean;
};

/**
 * A swipeable row: horizontal scroll with snap points on narrow screens, with optional
 * previous/next buttons. The item marked aria-current is scrolled into view on load.
 */
export function Rail({ children, label, className = "", arrows = true }: Props) {
  const ref = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  useReveal(ref);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });

    // Bring the selected chip into view without moving the page.
    const current = el.querySelector<HTMLElement>("[aria-current]");
    if (current && el.scrollWidth > el.clientWidth) {
      el.scrollLeft = current.offsetLeft - el.clientWidth / 2 + current.offsetWidth / 2 - el.offsetLeft;
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  function page(dir: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  }

  const overflow = !(edges.start && edges.end);
  const arrow =
    `absolute top-[calc(50%-1.375rem)] z-10 hidden size-11 cursor-pointer items-center justify-center rounded-full border-2 border-ink bg-paper text-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-0 sm:flex ${press}`;

  return (
    <div className="relative">
      <ul
        ref={ref}
        aria-label={label}
        data-reveal-group=""
        className={`flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      >
        {children}
      </ul>
      {arrows && overflow && (
        <>
          <button type="button" aria-label="Scroll back" onClick={() => page(-1)} disabled={edges.start} className={`${arrow} -left-3`}>
            <ChevronLeftIcon size={20} />
          </button>
          <button type="button" aria-label="Scroll forward" onClick={() => page(1)} disabled={edges.end} className={`${arrow} -right-3`}>
            <ChevronRightIcon size={20} />
          </button>
        </>
      )}
    </div>
  );
}
