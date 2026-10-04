"use client";

import { useEffect, useRef, useState } from "react";
import { FILTER_EVENT } from "@/components/review-list";

/**
 * Star distribution bars. They fill from zero the first time they scroll into view,
 * and each row filters the review list to that star rating.
 */
export function RatingBars({ dist, total }: { dist: number[]; total: number }) {
  const ref = useRef<HTMLDListElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <dl ref={ref} className="flex-1 space-y-0.5">
      {[5, 4, 3, 2, 1].map((star, i) => {
        const n = dist[star - 1];
        const pct = total ? Math.round((n / total) * 100) : 0;
        return (
          <div key={star}>
            <dt className="sr-only">{star} star</dt>
            <dd>
              <button
                type="button"
                disabled={n === 0}
                onClick={() => window.dispatchEvent(new CustomEvent(FILTER_EVENT, { detail: star }))}
                aria-label={`Show ${n} ${star}-star review${n === 1 ? "" : "s"}`}
                className="group -mx-2 flex min-h-10 w-[calc(100%+1rem)] cursor-pointer items-center gap-3 rounded-lg px-2 text-sm transition-colors duration-200 hover:bg-paper disabled:cursor-default disabled:hover:bg-transparent"
              >
              <span aria-hidden className="w-12 shrink-0 text-left font-semibold text-ink group-hover:text-brand group-disabled:text-ink">{star} star</span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-paper group-hover:bg-coral-soft">
                <span
                  className="block h-full origin-left rounded-full bg-star transition-transform duration-700 ease-out motion-reduce:!transform-none"
                  style={{ width: `${pct}%`, transform: `scaleX(${shown ? 1 : 0})`, transitionDelay: `${i * 70}ms` }}
                />
              </span>
              <span className="w-8 text-right text-muted">{n}</span>
              </button>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
