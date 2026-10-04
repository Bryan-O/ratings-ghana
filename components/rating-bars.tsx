"use client";

import { useEffect, useRef, useState } from "react";

/** Star distribution bars. They fill from zero the first time they scroll into view. */
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
    <dl ref={ref} className="flex-1 space-y-2">
      {[5, 4, 3, 2, 1].map((star, i) => {
        const n = dist[star - 1];
        const pct = total ? Math.round((n / total) * 100) : 0;
        return (
          <div key={star} className="flex items-center gap-3 text-sm">
            <dt className="w-12 shrink-0 font-semibold text-ink">{star} star</dt>
            <dd className="flex flex-1 items-center gap-3">
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-paper">
                <span
                  className="block h-full origin-left rounded-full bg-star transition-transform duration-700 ease-out motion-reduce:!transform-none"
                  style={{ width: `${pct}%`, transform: `scaleX(${shown ? 1 : 0})`, transitionDelay: `${i * 70}ms` }}
                />
              </span>
              <span className="w-8 text-right text-muted">{n}</span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
