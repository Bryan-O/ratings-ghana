import { StarIcon } from "@/components/icons";

/** Read-only star rating, rounded to the nearest whole star. */
export function Stars({ rating, size = 18, className = "" }: { rating: number; size?: number; className?: string }) {
  const full = Math.round(rating);
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} size={size} className={i <= full ? "text-star" : "text-star-empty"} />
      ))}
    </span>
  );
}

/** Compact "★ 4.3 (12)" badge used on cards. */
export function RatingBadge({ avg, count }: { avg: number; count: number }) {
  if (count === 0) {
    return <span className="text-sm font-medium text-muted">No reviews yet</span>;
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className="inline-flex items-center gap-1 rounded-lg bg-brand px-2 py-0.5 font-bold text-white">
        <StarIcon size={14} className="text-star" />
        {avg.toFixed(1)}
      </span>
      <span className="text-muted">
        {count} review{count === 1 ? "" : "s"}
      </span>
    </span>
  );
}
