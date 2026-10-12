import Link from "next/link";
import type { Business } from "@/lib/generated/prisma/client";
import { BusinessImage } from "@/components/business-image";
import { ArrowRightIcon, GlobeIcon, LocationIcon } from "@/components/icons";
import { RatingBadge, Stars } from "@/components/stars";
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

export function BusinessCard({ business: b, headingLevel = 2 }: { business: Business; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
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
        <Heading className="font-display text-xl leading-tight font-bold text-ink transition-colors duration-200 group-hover:text-brand">
          {b.name}
        </Heading>
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

/**
 * Bento feature card for the top result: spans two columns, photo beside a big rating numeral.
 * Ink surface so it reads as the lead item; stacks like a normal card on phones.
 */
export function FeaturedBusinessCard({ business: b, label }: { business: Business; label: string }) {
  return (
    <Link
      href={`/businesses/${b.slug}`}
      className={`group grid h-full cursor-pointer grid-cols-1 overflow-hidden rounded-3xl border border-transparent bg-ink text-white sm:grid-cols-2 ${lift}`}
    >
      <div className="relative m-2 aspect-[16/10] overflow-hidden rounded-2xl sm:aspect-auto sm:min-h-64">
        <BusinessImage
          src={b.images[0]}
          name={b.name}
          category={b.category}
          sizes="(max-width: 640px) 100vw, 33vw"
          className="transition-transform duration-500 ease-out-soft group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-3 p-5 sm:p-7">
        <span className="text-xs font-semibold tracking-[0.08em] text-white/60 uppercase">{label}</span>
        <h2 className="font-display text-2xl leading-tight font-bold text-white sm:text-3xl">{b.name}</h2>
        <p className="text-sm text-white/70">
          {b.category} · {whereLabel(b)}
        </p>
        <p className="line-clamp-3 text-white/80">{b.description}</p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-2">
          {b.reviewCount > 0 ? (
            <span className="flex items-end gap-3">
              <span className="font-display text-6xl leading-none font-bold tracking-[-0.04em] tabular-nums">{b.avgRating.toFixed(1)}</span>
              <span className="pb-1">
                <Stars rating={b.avgRating} size={16} onDark />
                <span className="mt-1 block text-xs text-white/70">
                  {b.reviewCount} rating{b.reviewCount === 1 ? "" : "s"}
                </span>
              </span>
            </span>
          ) : (
            <span className="text-sm text-white/70">No reviews yet. You could be first.</span>
          )}
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-[translate,background-color] duration-300 ease-spring group-hover:translate-x-1 group-hover:bg-coral group-focus-visible:translate-x-1 group-focus-visible:bg-coral"
          >
            <ArrowRightIcon size={18} />
          </span>
        </div>
      </div>
    </Link>
  );
}
