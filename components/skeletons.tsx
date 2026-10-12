import { LogoMark } from "@/components/icons";
import { container } from "@/components/ui";

/** Grey placeholder block; pulses gently (static under reduced motion). */
export function Bone({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`block animate-pulse rounded-lg bg-brand-wash ${className}`} />;
}

/** Instant stand-in for SiteHeader while a page loads (no data, so it renders immediately). */
export function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-40 bg-ink">
      <div className={`${container} flex h-16 items-center justify-between lg:h-[4.5rem]`}>
        <span className="flex items-center gap-2.5 text-white">
          <LogoMark mono bg="#16161a" />
          <span className="font-display text-xl font-bold tracking-[-0.01em]">RatingsGhana</span>
        </span>
        <span aria-hidden className="block h-10 w-24 animate-pulse rounded-full bg-white/10 lg:w-80" />
      </div>
    </div>
  );
}

export function BusinessCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line p-4">
      <Bone className="size-16" />
      <Bone className="h-5 w-3/4" />
      <Bone className="h-4 w-1/2" />
      <Bone className="h-4 w-2/3" />
    </div>
  );
}

export function Loading({ label }: { label: string }) {
  return (
    <p role="status" className="sr-only">
      {label}
    </p>
  );
}
