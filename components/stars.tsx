import { StarIcon } from "@/components/icons";

/**
 * Read-only star rating, rounded to the nearest whole star.
 * Earned stars are solid coral; unearned stars are ink outlines at 40% (white on dark surfaces).
 */
export function Stars({
  rating,
  size = 18,
  className = "",
  onDark = false,
}: {
  rating: number;
  size?: number;
  className?: string;
  onDark?: boolean;
}) {
  const full = Math.round(rating);
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= full ? (
          <StarIcon key={i} size={size} className="text-star" />
        ) : (
          <StarIcon key={i} size={size} filled={false} className={onDark ? "text-white/40" : "text-star-empty"} />
        ),
      )}
    </span>
  );
}

/** Card rating signal: coral stars, then "4.8 · 86 ratings" with the numeral in the display face. */
export function RatingBadge({ avg, count }: { avg: number; count: number }) {
  if (count === 0) {
    return <span className="text-sm text-muted">No reviews yet. You could be first.</span>;
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      <Stars rating={avg} size={16} />
      <span className="text-muted">
        <span className="font-display font-bold text-ink">{avg.toFixed(1)}</span> · {count} rating{count === 1 ? "" : "s"}
      </span>
    </span>
  );
}
