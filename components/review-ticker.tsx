"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/icons";
import { Stars } from "@/components/stars";

export type TickerReview = { id: string; rating: number; title: string; name: string; business: string; slug: string };

const INTERVAL = 6000;

/** Hero card: one useful sentence from a recent verified review, cycling every few seconds. */
export function ReviewTicker({ reviews }: { reviews: TickerReview[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reviews.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % reviews.length), INTERVAL);
    return () => clearTimeout(t);
  }, [index, paused, reviews.length]);

  const r = reviews[index];
  if (!r) return null;

  return (
    <figure
      className="relative flex min-h-80 flex-col rounded-3xl bg-brand p-7 text-white sm:p-9"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Recent verified reviews"
    >
      <div key={r.id} className="flex flex-1 animate-rise flex-col" aria-live={paused ? "polite" : "off"}>
        <blockquote className="font-display text-2xl leading-tight font-bold break-words sm:text-[2rem]">&ldquo;{r.title}&rdquo;</blockquote>
        <p className="mt-5 flex flex-wrap items-center gap-2 text-sm font-semibold">
          <Stars rating={r.rating} size={18} onDark />
          <span>{r.rating.toFixed(1)} · Verified review</span>
        </p>
        <figcaption className="mt-auto pt-8 text-sm text-white/80">
          {r.name} on{" "}
          <Link href={`/businesses/${r.slug}`} className="font-semibold text-white underline underline-offset-2 transition-colors duration-200 hover:text-coral">
            {r.business}
          </Link>
        </figcaption>
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        {reviews.length > 1 ? (
          <div className="-ml-3 flex" role="group" aria-label="Choose a review">
            {reviews.map((rv, i) => (
              <button
                key={rv.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show review ${i + 1} of ${reviews.length}`}
                aria-current={i === index}
                className="group flex size-11 cursor-pointer items-center justify-center rounded-full"
              >
                <span
                  className={`block h-2 rounded-full transition-[width,background-color] duration-300 ${
                    i === index ? "w-6 bg-coral" : "w-2 bg-white/40 group-hover:bg-paper"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        <LogoMark size={44} mono className="shrink-0 text-white" bg="#3d2c8d" />
      </div>
    </figure>
  );
}
