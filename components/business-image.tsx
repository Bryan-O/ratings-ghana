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

// Placeholder gradients, all within the brand palette, picked per business so a grid isn't monotone.
const GRADIENTS = [
  "from-brand-light via-brand to-brand-deep",
  "from-[#8b5cf6] via-[#6d28d9] to-brand-night",
  "from-[#c084fc] via-[#9333ea] to-[#581c87]",
  "from-[#818cf8] via-[#6d28d9] to-brand-deep",
];

function pick(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
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
  return (
    <div
      role="img"
      aria-label={name}
      className={`absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-br ${pick(name)} text-white ${className}`}
    >
      <span aria-hidden className="absolute -top-10 -right-10 size-40 rounded-full bg-white/10" />
      <span aria-hidden className="absolute -bottom-14 -left-8 size-36 rounded-full bg-white/10" />
      {category && <CategoryIcon category={category} size={28} className="relative opacity-80" />}
      <span className="relative font-display text-3xl font-bold tracking-wide">{initials}</span>
    </div>
  );
}
