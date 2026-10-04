import { LogoMark } from "@/components/icons";
import { container } from "@/components/ui";

/** Grey placeholder block; pulses gently (static under reduced motion). */
export function Bone({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`block animate-pulse rounded-lg bg-brand-wash ${className}`} />;
}

/** Instant stand-in for SiteHeader while a page loads (no data, so it renders immediately). */
export function HeaderSkeleton() {
  return (
    <div className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className={`${container} flex h-16 items-center justify-between`}>
        <span className="flex items-center gap-2.5 text-ink">
          <LogoMark />
          <span className="font-display text-xl font-bold tracking-tight">RatingsGhana</span>
        </span>
        <Bone className="h-10 w-24 lg:w-80" />
      </div>
    </div>
  );
}

export function BusinessCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-brand-wash p-2">
      <span className="block aspect-[16/10] animate-pulse rounded-xl bg-line" />
      <div className="flex flex-col gap-2.5 p-3 pt-4">
        <Bone className="h-5 w-3/4 bg-line" />
        <Bone className="h-4 w-1/2 bg-line" />
        <Bone className="h-4 w-2/3 bg-line" />
      </div>
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
