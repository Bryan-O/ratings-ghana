import Link from "next/link";
import type { Business } from "@/lib/generated/prisma/client";
import { BusinessImage } from "@/components/business-image";
import { GlobeIcon, LocationIcon } from "@/components/icons";
import { RatingBadge } from "@/components/stars";

function whereLabel(b: Business) {
  if (b.type === "ONLINE") {
    try {
      return b.website ? new URL(b.website).hostname.replace(/^www\./, "") : "Online";
    } catch {
      return "Online";
    }
  }
  return [b.address, b.city].filter(Boolean).join(", ");
}

export function BusinessCard({ business: b }: { business: Business }) {
  return (
    <Link
      href={`/businesses/${b.slug}`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-brand-light hover:shadow-[0_12px_32px_-12px_rgba(76,29,149,0.25)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <BusinessImage src={b.images[0]} name={b.name} category={b.category} />
        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-brand-deep shadow-sm">
          {b.category}
        </span>
        {b.type === "ONLINE" && (
          <span className="absolute top-3 right-3 rounded-full bg-brand-night/85 px-3 py-1 text-xs font-bold text-white">Online</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="font-display text-lg leading-snug font-semibold text-ink transition-colors duration-200 group-hover:text-brand">
          {b.name}
        </h2>
        <RatingBadge avg={b.avgRating} count={b.reviewCount} />
        <p className="mt-auto flex items-start gap-1.5 pt-1 text-sm text-muted">
          {b.type === "ONLINE" ? <GlobeIcon size={16} className="mt-0.5 shrink-0" /> : <LocationIcon size={16} className="mt-0.5 shrink-0" />}
          <span className="line-clamp-2">{whereLabel(b)}</span>
        </p>
      </div>
    </Link>
  );
}
