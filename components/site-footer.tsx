import Link from "next/link";
import { LogoMark, ShieldCheckIcon } from "@/components/icons";
import { container } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-brand-night text-white/80">
      <div className={`${container} grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]`}>
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 text-white">
            <LogoMark className="text-brand" />
            <span className="font-display text-xl font-bold">RatingsGhana</span>
          </Link>
          <p className="mt-4 max-w-sm text-[15px]">
            A safe space to give reviews and recommendations of businesses in Ghana — physical shops and online sellers alike.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-brand-light">
            <ShieldCheckIcon size={16} /> Every reviewer is phone-verified
          </p>
        </div>
        <nav aria-label="Explore">
          <h2 className="font-display text-sm font-semibold tracking-wide text-white uppercase">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link href="/businesses" className="hover:text-white">All businesses</Link></li>
            <li><Link href="/businesses?type=ONLINE" className="hover:text-white">Online businesses</Link></li>
            <li><Link href="/businesses?category=Restaurant" className="hover:text-white">Restaurants</Link></li>
          </ul>
        </nav>
        <nav aria-label="Contribute">
          <h2 className="font-display text-sm font-semibold tracking-wide text-white uppercase">Contribute</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link href="/businesses" className="hover:text-white">Write a review</Link></li>
            <li><Link href="/businesses/new" className="hover:text-white">Add a business</Link></li>
            <li><Link href="/register" className="hover:text-white">Create an account</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className={`${container} py-5 text-sm text-white/60`}>© {new Date().getFullYear()} RatingsGhana. Made in Ghana.</p>
      </div>
    </footer>
  );
}
