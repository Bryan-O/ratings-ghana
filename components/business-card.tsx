import Link from "next/link";
import type { Business } from "@/lib/generated/prisma/client";
import { BusinessImage } from "@/components/business-image";
import { ArrowRightIcon, GlobeIcon, LocationIcon } from "@/components/icons";
import { RatingBadge } from "@/components/stars";
import { lift } from "@/components/ui";

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
      className={`group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-transparent bg-brand-wash ${lift}`}
    >
      <div className="relative m-2 mb-0 aspect-[16/10] overflow-hidden rounded-xl">
        <BusinessImage src={b.images[0]} name={b.name} category={b.category} className="transition-transform duration-500 ease-out-soft group-hover:scale-[1.04]" />
        <span className="absolute top-2.5 left-2.5 rounded-full bg-paper px-2.5 py-1 text-xs font-semibold text-brand">
          {b.category}
        </span>
        {b.type === "ONLINE" && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white">Online</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="font-display text-xl leading-tight font-bold text-ink transition-colors duration-200 group-hover:text-brand">
          {b.name}
        </h2>
        <RatingBadge avg={b.avgRating} count={b.reviewCount} />
        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <p className="flex min-w-0 items-start gap-1.5 text-sm text-muted">
            {b.type === "ONLINE" ? <GlobeIcon size={16} className="mt-0.5 shrink-0" /> : <LocationIcon size={16} className="mt-0.5 shrink-0" />}
            <span className="line-clamp-2">{whereLabel(b)}</span>
          </p>
          <span
            aria-hidden
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-[translate,background-color] duration-300 ease-spring group-hover:translate-x-1 group-hover:bg-coral group-focus-visible:translate-x-1 group-focus-visible:bg-coral"
          >
            <ArrowRightIcon size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
