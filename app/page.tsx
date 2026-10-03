import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchBar } from "@/components/search-bar";
import { BusinessCard } from "@/components/business-card";
import { Stars } from "@/components/stars";
import { ArrowRightIcon, BadgeCheckIcon, CategoryIcon, FlagIcon, PlusIcon, SmartphoneIcon } from "@/components/icons";
import { btn, container } from "@/components/ui";
import { CATEGORIES } from "@/lib/constants";
import { displayName, initials } from "@/lib/format";
import { getCategoryCounts, getPopularBusinesses, getRecentReviews, getSiteStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

const POPULAR_SEARCHES = [
  { label: "Jollof", href: "/businesses?q=jollof" },
  { label: "Fufu", href: "/businesses?q=fufu" },
  { label: "Pizza", href: "/businesses?q=pizza" },
  { label: "Hotels in Accra", href: "/businesses?category=Hotel&location=Accra" },
  { label: "Online stores", href: "/businesses?type=ONLINE" },
];

const TRUST = [
  {
    icon: SmartphoneIcon,
    title: "Phone-verified reviewers",
    text: "Every reviewer confirms a Ghana mobile number by SMS. One number, one account — no fake-account farms.",
  },
  {
    icon: BadgeCheckIcon,
    title: "One review per business",
    text: "You can review each business once and update it later. Nobody can flood a page with ratings.",
  },
  {
    icon: FlagIcon,
    title: "Community moderation",
    text: "Anyone can report a suspicious review. Our team checks reports and removes reviews that break the rules.",
  },
];

export default async function HomePage() {
  const [popular, counts, recent, stats] = await Promise.all([
    getPopularBusinesses(8),
    getCategoryCounts(),
    getRecentReviews(3),
    getSiteStats(),
  ]);
  const categories = CATEGORIES.filter((c) => c !== "Other").slice(0, 8);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero — search is the primary CTA */}
        <section className="relative overflow-hidden bg-gradient-to-b from-brand-soft to-brand-wash">
          <span aria-hidden className="absolute -top-32 -left-24 size-96 rounded-full bg-brand-light/25 blur-3xl" />
          <span aria-hidden className="absolute -right-24 -bottom-24 size-96 rounded-full bg-cta/10 blur-3xl" />
          <div className={`${container} relative py-16 text-center sm:py-24`}>
            <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/80 px-4 py-1.5 text-sm font-semibold text-brand-deep">
              <BadgeCheckIcon size={16} className="text-cta" /> 100% phone-verified reviewers
            </p>
            <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl leading-[1.1] font-bold tracking-tight sm:text-6xl">
              Honest reviews of <span className="text-brand">Ghanaian businesses</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted sm:text-xl">
              From chop bars in Kumasi to online shops in Accra — see what real customers say before you spend.
            </p>
            <SearchBar size="lg" className="mx-auto mt-10 max-w-3xl text-left" />
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-muted">Popular:</span>
              {POPULAR_SEARCHES.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  className="rounded-full bg-white px-3 py-1 font-semibold text-brand-deep ring-1 ring-line transition-colors duration-200 hover:bg-brand hover:text-white"
                >
                  {s.label}
                </Link>
              ))}
            </div>
            <dl className="mx-auto mt-12 grid max-w-md grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-line">
                <dt className="text-sm text-muted">Businesses listed</dt>
                <dd className="font-display text-3xl font-bold text-ink">{stats.businesses}</dd>
              </div>
              <div className="rounded-2xl bg-white/70 p-4 ring-1 ring-line">
                <dt className="text-sm text-muted">Verified reviews</dt>
                <dd className="font-display text-3xl font-bold text-ink">{stats.reviews}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Categories */}
        <section className={`${container} py-16`} aria-labelledby="cat-heading">
          <div className="flex items-end justify-between gap-4">
            <h2 id="cat-heading" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Browse by category</h2>
            <Link href="/businesses" className="hidden items-center gap-1 font-semibold text-brand hover:text-brand-hover sm:inline-flex">
              All businesses <ArrowRightIcon size={18} />
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/businesses?category=${encodeURIComponent(c)}`}
                  className="group flex h-full cursor-pointer items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-colors duration-200 hover:border-brand hover:bg-brand-soft"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
                    <CategoryIcon category={c} />
                  </span>
                  <span>
                    <span className="block leading-tight font-semibold text-ink">{c}</span>
                    <span className="text-sm text-muted">{counts.get(c) ?? 0} listed</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Top rated */}
        {popular.length > 0 && (
          <section className="border-y border-line bg-white py-16" aria-labelledby="top-heading">
            <div className={container}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 id="top-heading" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Most reviewed right now</h2>
                  <p className="mt-1 text-muted">Businesses the community is talking about.</p>
                </div>
                <Link href="/businesses" className="hidden items-center gap-1 font-semibold text-brand hover:text-brand-hover sm:inline-flex">
                  See all <ArrowRightIcon size={18} />
                </Link>
              </div>
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {popular.map((b) => (
                  <li key={b.id}>
                    <BusinessCard business={b} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Trust & safety */}
        <section className={`${container} py-16`} aria-labelledby="trust-heading">
          <div className="max-w-2xl">
            <h2 id="trust-heading" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Why you can trust these ratings</h2>
            <p className="mt-2 text-lg text-muted">Fake reviews ruin review sites. We built RatingsGhana to stop them from day one.</p>
          </div>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {TRUST.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl border border-line bg-white p-6">
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand text-white">
                  <Icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent reviews */}
        {recent.length > 0 && (
          <section className="bg-white py-16" aria-labelledby="recent-heading">
            <div className={container}>
              <h2 id="recent-heading" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Latest reviews</h2>
              <ul className="mt-8 grid gap-6 md:grid-cols-3">
                {recent.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/businesses/${r.business.slug}`}
                      className="flex h-full cursor-pointer flex-col rounded-2xl border border-line bg-brand-wash p-6 transition-colors duration-200 hover:border-brand-light"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-brand font-display font-bold text-white">
                          {initials(r.user.name)}
                        </span>
                        <span className="text-sm">
                          <span className="block font-semibold text-ink">{displayName(r.user.name)}</span>
                          <span className="text-muted">reviewed {r.business.name}</span>
                        </span>
                      </div>
                      <Stars rating={r.rating} className="mt-4" />
                      <p className="mt-2 font-semibold text-ink">{r.title}</p>
                      <p className="mt-1 line-clamp-3 text-muted">{r.body}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className={`${container} py-16`}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-deep px-6 py-12 text-center sm:px-12">
            <span aria-hidden className="absolute -top-20 -right-20 size-64 rounded-full bg-white/10" />
            <h2 className="relative font-display text-2xl font-bold text-white sm:text-3xl">Know a business that isn&apos;t listed?</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-lg text-white/85">
              Add it in a minute. Physical shops and online sellers are both welcome — our team checks every listing.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/businesses/new" className={btn.cta}>
                <PlusIcon size={18} /> Add a business
              </Link>
              <Link href="/businesses" className={btn.outlineOnDark}>
                Write a review
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
