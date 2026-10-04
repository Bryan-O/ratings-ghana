"use client";

import { useEffect, useRef, useState } from "react";
import { ReviewCard } from "@/components/review-card";
import { ChevronDownIcon, StarIcon } from "@/components/icons";
import { chip } from "@/components/ui";

export type ListReview = {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: Date;
  user: { name: string | null };
  canReport: boolean;
  isMine: boolean;
};

type Sort = "newest" | "highest" | "lowest";
const SORTS: { value: Sort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];
const STEP = 8;

/** Event the rating bars send to filter this list (detail = star count, or 0 for all). */
export const FILTER_EVENT = "reviews:filter";

/** Reviews with a star filter, a sort order and "Show more". Your own review always stays on top. */
export function ReviewList({ reviews }: { reviews: ListReview[] }) {
  const [stars, setStars] = useState(0);
  const [sort, setSort] = useState<Sort>("newest");
  const [limit, setLimit] = useState(STEP);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onFilter = (e: Event) => {
      const n = (e as CustomEvent<number>).detail;
      setStars((cur) => (cur === n ? 0 : n));
      setLimit(STEP);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      top.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    };
    window.addEventListener(FILTER_EVENT, onFilter);
    return () => window.removeEventListener(FILTER_EVENT, onFilter);
  }, []);

  const counts = [1, 2, 3, 4, 5].map((n) => reviews.filter((r) => r.rating === n).length);
  const filtered = reviews
    .filter((r) => !stars || r.rating === stars)
    .sort((a, b) => {
      if (a.isMine !== b.isMine) return a.isMine ? -1 : 1;
      if (sort === "highest") return b.rating - a.rating || +b.createdAt - +a.createdAt;
      if (sort === "lowest") return a.rating - b.rating || +b.createdAt - +a.createdAt;
      return +b.createdAt - +a.createdAt;
    });
  const shown = filtered.slice(0, limit);

  return (
    <div ref={top} className="scroll-mt-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by rating" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <button type="button" aria-pressed={stars === 0} onClick={() => { setStars(0); setLimit(STEP); }} className={chip(stars === 0)}>
            All <span className="opacity-70">{reviews.length}</span>
          </button>
          {[5, 4, 3, 2, 1].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={stars === n}
              aria-label={`${n} star reviews (${counts[n - 1]})`}
              disabled={counts[n - 1] === 0}
              onClick={() => { setStars(stars === n ? 0 : n); setLimit(STEP); }}
              className={`${chip(stars === n)} disabled:cursor-not-allowed disabled:opacity-40`}
            >
              {n} <StarIcon size={14} className={stars === n ? "text-coral" : "text-star"} />
              <span className="opacity-70">{counts[n - 1]}</span>
            </button>
          ))}
        </div>
        <label className="flex shrink-0 items-center gap-2 text-sm text-muted">
          Sort
          <span className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-11 cursor-pointer appearance-none rounded-xl border border-line-strong bg-paper pr-10 pl-3 font-semibold text-ink transition-[border-color,box-shadow] duration-200 hover:border-ink/60 focus:border-brand focus:ring-4 focus:ring-brand/20 focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDownIcon size={18} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink" />
          </span>
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} of {filtered.length} reviews{stars ? ` with ${stars} stars` : ""}.
      </p>

      <ul key={`${stars}-${sort}`} className="mt-4 space-y-4">
        {shown.map((r, i) => (
          <li key={r.id} className="animate-rise" style={{ animationDelay: `${Math.min(i % STEP, 6) * 40}ms` }}>
            <ReviewCard review={r} canReport={r.canReport} isMine={r.isMine} />
          </li>
        ))}
      </ul>

      {filtered.length > shown.length && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <button type="button" onClick={() => setLimit((l) => l + STEP)} className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl border-2 border-ink bg-paper px-6 font-semibold text-ink transition-colors duration-200 hover:bg-ink hover:text-white active:translate-y-px">
            Show more reviews
          </button>
          <p className="text-sm text-muted">
            {shown.length} of {filtered.length}
          </p>
        </div>
      )}
    </div>
  );
}
