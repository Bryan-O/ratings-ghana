import Link from "next/link";
import { LogoMark, ShieldCheckIcon } from "@/components/icons";
import { container } from "@/components/ui";

const link = "inline-flex min-h-9 items-center transition-colors duration-200 hover:text-white";

const COLUMNS = [
  {
    title: "About",
    links: [
      { href: "/#trust-heading", label: "How we keep reviews real" },
      { href: "/businesses", label: "All businesses" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/businesses?type=ONLINE", label: "Online businesses" },
      { href: "/businesses?category=Restaurant", label: "Restaurants" },
      { href: "/businesses?sort=rating", label: "Highest rated" },
    ],
  },
  {
    title: "Contribute",
    links: [
      { href: "/businesses", label: "Write a review" },
      { href: "/businesses/new", label: "Add a business" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Sign up" },
    ],
  },
];

/** Ink footer: logo and the trust line, then link columns, then the small print. */
export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-white/70">
      <div className={`${container} py-14`}>
        <Link href="/" className="inline-flex min-h-11 items-center gap-2.5 text-white">
          <LogoMark className="text-white" mono bg="#16161a" />
          <span className="font-display text-xl font-bold tracking-[-0.01em]">RatingsGhana</span>
        </Link>
        <p className="mt-4 flex max-w-xl items-start gap-2 text-sm">
          <ShieldCheckIcon size={16} className="mt-0.5 shrink-0 text-brand-light" /> Every reviewer verifies their email and phone. One
          review per person per business.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-[15px] font-semibold text-white">{col.title}</h2>
              <ul className="mt-3 space-y-1 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={link}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className={`${container} py-5 text-sm text-white/60`}>
          © {new Date().getFullYear()} RatingsGhana. Real people. Real opinions. No filters.
        </p>
      </div>
    </footer>
  );
}
