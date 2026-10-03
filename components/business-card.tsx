import Link from "next/link";
import type { Business } from "@/lib/generated/prisma/client";
import { BusinessImage } from "@/components/business-image";
import { StarIcon } from "@/components/icons";

/** Figma "Frame 21" business card. */
export function BusinessCard({ business: b }: { business: Business }) {
  const where = b.type === "ONLINE" ? (b.website ? new URL(b.website).hostname.replace(/^www\./, "") : "Online") : [b.address, b.city].filter(Boolean).join(", ");
  return (
    <Link
      href={`/businesses/${b.slug}`}
      className="group flex flex-col overflow-hidden rounded-[32px] bg-white transition hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <div className="relative h-[200px] overflow-hidden rounded-[32px] bg-btn sm:h-[245px]">
        <BusinessImage src={b.images[0]} name={b.name} className="rounded-[32px] transition group-hover:scale-[1.02]" />
      </div>
      <div className="flex flex-1 flex-col gap-[5px] px-6 pt-3.5 pb-5">
        <h2 className="text-xl font-semibold text-ink sm:text-2xl">{b.name}</h2>
        <p className="flex items-center gap-1.5 text-base font-medium text-ink">
          {b.reviewCount > 0 ? (
            <>
              {b.avgRating.toFixed(1)} <StarIcon size={18} /> ({b.reviewCount})
            </>
          ) : (
            <span className="text-muted">No reviews yet</span>
          )}
        </p>
        <p className="max-w-[260px] text-[15px] font-semibold text-ink underline">{where}</p>
        <div className="mt-auto flex gap-2 pt-6">
          <span className="rounded-full border border-ink px-3 py-1 text-sm font-medium text-ink">{b.category}</span>
          {b.type === "ONLINE" && (
            <span className="rounded-full border border-ink bg-ink px-3 py-1 text-sm font-medium text-white">Online</span>
          )}
        </div>
      </div>
    </Link>
  );
}
