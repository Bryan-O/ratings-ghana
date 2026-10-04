/**
 * The trust cue: a deep-violet pill with a white check. Wording is fixed: "Verified reviewer".
 * The check draws itself in once when the badge appears.
 */
export function VerifiedBadge({ label = "Verified reviewer", className = "" }: { label?: string; className?: string }) {
  return (
    <span
      className={`inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-brand pr-2.5 pl-2 text-xs font-semibold whitespace-nowrap text-white ${className}`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" strokeDasharray="24" className="animate-draw" />
      </svg>
      {label}
    </span>
  );
}
