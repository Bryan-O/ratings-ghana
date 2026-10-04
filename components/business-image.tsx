import Image from "next/image";
import { CategoryIcon } from "@/components/icons";

type Props = {
  src?: string | null;
  name: string;
  category?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

// Placeholder tiles: flat brand colours (never gradients), picked per business so a grid isn't monotone.
const TILES = [
  { bg: "bg-brand", fg: "text-white" },
  { bg: "bg-ink", fg: "text-white" },
  { bg: "bg-coral", fg: "text-ink" },
  { bg: "bg-brand-soft", fg: "text-brand" },
];

function pick(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TILES[h % TILES.length];
}

/**
 * A business photo, or a branded placeholder (category icon + initials) until a
 * photo is uploaded. Parent must be `relative` with a set size.
 */
export function BusinessImage({ src, name, category, className = "", sizes = "(max-width: 1024px) 100vw, 33vw", priority }: Props) {
  if (src) {
    return <Image src={src} alt={name} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
  }
  const initials = name
    .split(/\s+/)
    .filter((w) => /[A-Za-z0-9]/.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  const tile = pick(name);
  return (
    <div
      role="img"
      aria-label={name}
      className={`absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden ${tile.bg} ${tile.fg} ${className}`}
    >
      {category && <CategoryIcon category={category} size={28} className="relative opacity-80" />}
      <span className="relative font-display text-3xl font-bold">{initials}</span>
    </div>
  );
}
