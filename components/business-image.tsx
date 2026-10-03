import Image from "next/image";

type Props = {
  src?: string | null;
  name: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/**
 * A business photo, or a neutral tile with the business initials when no photo
 * has been uploaded yet. Parent must be `relative` with a set size.
 */
export function BusinessImage({ src, name, className = "", sizes = "(max-width: 1024px) 100vw, 33vw", priority }: Props) {
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
      className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3a3a3a] to-btn ${className}`}
    >
      <span className="text-4xl font-semibold tracking-wider text-white/80">{initials}</span>
    </div>
  );
}
