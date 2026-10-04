import Link from "next/link";
import { LogoMark, ShieldCheckIcon } from "@/components/icons";
import { container, eyebrow } from "@/components/ui";

const link = "inline-flex min-h-9 items-center transition-colors duration-200 hover:text-coral";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-white/75">
      <div className={`${container} grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]`}>
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5 text-white">
            <LogoMark className="text-white" bg="#16161a" />
            <span className="font-display text-xl font-bold tracking-tight">RatingsGhana</span>
          </Link>
          <p className="mt-5 max-w-sm font-display text-2xl leading-snug font-bold text-white">
            Real people. Real opinions. <span className="text-coral">No filters.</span>
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm">
            <ShieldCheckIcon size={16} className="text-brand-light" /> Every reviewer verifies their email and phone
          </p>
        </div>
        <nav aria-label="Explore">
          <h2 className={`${eyebrow} text-white/60`}>Explore</h2>
          <ul className="mt-3 space-y-1 text-[15px]">
            <li><Link href="/businesses" className={link}>All businesses</Link></li>
            <li><Link href="/businesses?type=ONLINE" className={link}>Online businesses</Link></li>
            <li><Link href="/businesses?category=Restaurant" className={link}>Restaurants</Link></li>
          </ul>
        </nav>
        <nav aria-label="Contribute">
          <h2 className={`${eyebrow} text-white/60`}>Contribute</h2>
          <ul className="mt-3 space-y-1 text-[15px]">
            <li><Link href="/businesses" className={link}>Rate a business</Link></li>
            <li><Link href="/businesses/new" className={link}>Add a business</Link></li>
            <li><Link href="/register" className={link}>Create an account</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className={`${container} py-5 text-sm text-white/60`}>© {new Date().getFullYear()} RatingsGhana</p>
      </div>
    </footer>
  );
}
