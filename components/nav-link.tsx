"use client";

import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";

/** Header link that marks the current section and underlines itself while its page loads. */
export function NavLink({
  href,
  children,
  className = "",
  matchable = true,
  exclude = [],
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** False for links that share a destination with another nav item. */
  matchable?: boolean;
  /** Sub-pages that belong to a different nav item. */
  exclude?: string[];
}) {
  const pathname = usePathname();
  const current =
    matchable &&
    !exclude.some((e) => pathname === e || pathname.startsWith(`${e}/`)) &&
    (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  return (
    <Link href={href} aria-current={current ? "page" : undefined} className={`group relative ${className}`}>
      {children}
      <Underline current={current} />
    </Link>
  );
}

function Underline({ current }: { current: boolean }) {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-coral transition-transform duration-300 ${
        current || pending ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      } ${pending ? "opacity-60" : ""}`}
    />
  );
}
