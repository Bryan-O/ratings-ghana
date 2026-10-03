import { StarIcon } from "@/components/icons";

/** Read-only star rating; supports half-ish display by rounding to nearest whole star. */
export function Stars({ rating, size = 22, className = "" }: { rating: number; size?: number; className?: string }) {
  const full = Math.round(rating);
  return (
    <span className={`inline-flex items-center gap-[3px] text-star ${className}`} role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} size={size} filled={i <= full} />
      ))}
    </span>
  );
}
