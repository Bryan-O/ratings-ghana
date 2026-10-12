/** A reviewer's initials in a flat violet-tint circle (reviews never show profile photos). */
export function Avatar({ name, size = "md" }: { name: string; size?: "md" | "lg" }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-brand-soft font-bold text-brand ${size === "lg" ? "size-11 text-base" : "size-9 text-sm"}`}
    >
      {initials}
    </span>
  );
}
