import Link from "next/link";
import type { Business } from "@/lib/generated/prisma/client";
import { BusinessImage } from "@/components/business-image";
import { Stars } from "@/components/stars";
import { lift } from "@/components/ui";

export function whereLabel(b: Pick<Business, "type" | "website" | "address" | "city">) {
  if (b.type === "ONLINE") {
    try {
      return b.website ? new URL(b.website).hostname.replace(/^www\./, "") : "Online";
    } catch {
      return "Online";
    }
  }
  return [b.address, b.city].filter(Boolean).join(", ");
}

/** Square logo-style thumbnail: the cover photo, or the brand placeholder with initials. */
export function BusinessThumb({ business: b, size = "md" }: { business: Pick<Business, "images" | "name" | "category">; size?: "sm" | "md" }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-lg border border-line ${size === "sm" ? "size-10" : "size-16"}`}>
      <BusinessImage src={b.images[0]} name={b.name} category={b.category} sizes="64px" compact />
    </span>
  );
}

/** Rating line used on cards: coral stars, then "4.7 (15)". */
export function CardRating({ avg, count }: { avg: number; count: number }) {
  if (count === 0) return <span className="text-sm text-muted">No reviews yet</span>;
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted">
      <Stars rating={avg} size={15} />
      <span>
        <span className="font-semibold text-ink">{avg.toFixed(1)}</span> ({count})
      </span>
    </span>
  );
}

/**
 * Compact business card (Trustpilot-style arrangement): logo-style thumbnail, name, where it is,
 * then stars with the score and review count. White with a hairline border; lifts on hover/focus.
 */
export function BusinessCard({ business: b, headingLevel = 2 }: { business: Business; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <Link
      href={`/businesses/${b.slug}`}
      className={`group flex h-full cursor-pointer flex-col gap-3 rounded-xl border border-line bg-paper p-4 ${lift}`}
    >
      <span className="flex items-start justify-between gap-3">
        <BusinessThumb business={b} />
        {b.type === "ONLINE" && <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">Online</span>}
      </span>
      <span className="min-w-0">
        <Heading className="text-base leading-snug font-bold text-ink transition-colors duration-200 group-hover:text-brand">{b.name}</Heading>
        <span className="mt-0.5 block truncate text-sm text-muted">{whereLabel(b) || b.category}</span>
      </span>
      <span className="mt-auto">
        <CardRating avg={b.avgRating} count={b.reviewCount} />
      </span>
    </Link>
  );
}
