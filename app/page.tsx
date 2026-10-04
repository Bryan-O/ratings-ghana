import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchBar } from "@/components/search-bar";
import { BusinessCard } from "@/components/business-card";
import { Stars } from "@/components/stars";
import { ArrowRightIcon, BadgeCheckIcon, CategoryIcon, FlagIcon, PlusIcon, SmartphoneIcon } from "@/components/icons";
import { EmptyState } from "@/components/empty-state";
import { ReviewTicker, type TickerReview } from "@/components/review-ticker";
import { VerifiedBadge } from "@/components/verified-badge";
import { btn, card, chip, container, eyebrow, lift } from "@/components/ui";
import { CATEGORIES } from "@/lib/constants";
import { displayName } from "@/lib/format";
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
    title: "Prove you're a real person",
    text: "Every reviewer confirms their email and a mobile number by text. One number, one account.",
  },
  {
    icon: BadgeCheckIcon,
    title: "One review per business",
    text: "You can rate each business once and edit it later. Nobody can flood a page with ratings.",
  },
  {
    icon: FlagIcon,
    title: "Reports get checked",
    text: "Anyone can report a review. We check every report, and reviews that break the rules come down.",
  },
];

export default async function HomePage() {
  const [popular, counts, recent, stats] = await Promise.all([
    getPopularBusinesses(8),
    getCategoryCounts(),
    getRecentReviews(5),
    getSiteStats(),
  ]);
  const categories = CATEGORIES.filter((c) => c !== "Other").slice(0, 8);

  const ticker: TickerReview[] = recent.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    name: displayName(r.user.name),
    business: r.business.name,
    slug: r.business.slug,
  }));

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {/* Hero: the proposition, search as the one action, and a live verified review */}
        <section className="border-b border-line">
          <div className={`${container} grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr]`}>
            <div className="min-w-0">
              <p className={eyebrow}>Business reviews you can check</p>
              <h1 className="mt-4 font-display text-[2.6rem] leading-[1.05] font-bold tracking-tight sm:text-6xl">
                Real people.
                <br />
                Real opinions.
                <br />
                <span className="text-coral">No filters.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-body">
                See how shops, restaurants and online sellers really treat their customers, from people who proved they&rsquo;re real.
              </p>
              <SearchBar size="lg" className="mt-8 max-w-2xl" />
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-muted">Try:</span>
                {POPULAR_SEARCHES.map((s) => (
                  <Link key={s.label} href={s.href} className={chip(false)}>
                    {s.label}
                  </Link>
                ))}
              </div>
              <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted">
                <div className="flex items-baseline gap-2">
                  <dd className="font-display text-2xl font-bold text-ink">{stats.businesses}</dd>
                  <dt>businesses listed</dt>
                </div>
                <div className="flex items-baseline gap-2">
                  <dd className="font-display text-2xl font-bold text-ink">{stats.reviews}</dd>
                  <dt>verified reviews</dt>
                </div>
              </dl>
            </div>
            {ticker.length > 0 ? (
              <ReviewTicker reviews={ticker} />
            ) : (
              <EmptyState title="No reviews yet. You could be first." text="Share a real experience to help the next customer." />
            )}
          </div>
        </section>

        {/* Categories */}
        <section className={`${container} py-16`} aria-labelledby="cat-heading">
          <div className="flex items-end justify-between gap-4">
            <h2 id="cat-heading" className="font-display text-2xl font-bold tracking-tight sm:text-[2rem]">Browse by category</h2>
            <Link href="/businesses" className="hidden min-h-11 items-center gap-1 font-semibold text-brand transition-colors duration-200 hover:text-ink sm:inline-flex">
              All businesses <ArrowRightIcon size={18} />
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/businesses?category=${encodeURIComponent(c)}`}
                  className={`group flex h-full cursor-pointer items-center gap-3 rounded-2xl border border-transparent bg-brand-wash p-4 ${lift}`}
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-paper text-ink transition-colors duration-200 group-hover:bg-coral">
                    <CategoryIcon category={c} />
                  </span>
                  <span className="min-w-0">
                    <span className="block leading-tight font-semibold text-ink">{c}</span>
                    <span className="text-sm text-muted">{counts.get(c) ?? 0} listed</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Most reviewed */}
        {popular.length > 0 && (
          <section className="pb-16" aria-labelledby="top-heading">
            <div className={container}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 id="top-heading" className="font-display text-2xl font-bold tracking-tight sm:text-[2rem]">Most reviewed right now</h2>
                  <p className="mt-1 text-muted">Where people are saying the most.</p>
                </div>
                <Link href="/businesses" className="hidden min-h-11 items-center gap-1 font-semibold text-brand transition-colors duration-200 hover:text-ink sm:inline-flex">
                  See all <ArrowRightIcon size={18} />
                </Link>
              </div>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {popular.map((b) => (
                  <li key={b.id}>
                    <BusinessCard business={b} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Trust, earned */}
        <section className="bg-ink py-16 text-white/80" aria-labelledby="trust-heading">
          <div className={container}>
            <div className="max-w-2xl">
              <h2 id="trust-heading" className="font-display text-2xl font-bold tracking-tight text-white sm:text-[2rem]">Trust, earned.</h2>
              <p className="mt-2 text-lg">Fake reviews make review sites useless. Here&rsquo;s how we keep them out.</p>
            </div>
            <ul className="mt-10 grid gap-5 md:grid-cols-3">
              {TRUST.map(({ icon: Icon, title, text }) => (
                <li key={title} className="rounded-2xl border border-white/15 p-6 transition-colors duration-200 hover:border-white/40">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-brand text-white">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-white">{title}</h3>
                  <p className="mt-2">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Recent reviews */}
        {recent.length > 0 && (
          <section className="py-16" aria-labelledby="recent-heading">
            <div className={container}>
              <h2 id="recent-heading" className="font-display text-2xl font-bold tracking-tight sm:text-[2rem]">Latest reviews</h2>
              <ul className="mt-8 grid gap-5 md:grid-cols-3">
                {recent.slice(0, 3).map((r) => (
                  <li key={r.id}>
                    <Link href={`/businesses/${r.business.slug}`} className={`flex h-full cursor-pointer flex-col p-6 ${card} ${lift}`}>
                      <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                        {displayName(r.user.name)} <VerifiedBadge />
                      </p>
                      <p className="mt-3 flex items-center gap-2 text-sm">
                        <Stars rating={r.rating} size={16} />
                        <span className="font-display font-bold text-ink">{r.rating.toFixed(1)}</span>
                      </p>
                      <p className="mt-3 font-semibold text-ink">{r.title}</p>
                      <p className="mt-1 line-clamp-3 text-body">{r.body}</p>
                      <p className="mt-auto pt-4 text-sm text-brand">on {r.business.name}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* One clear action */}
        <section className={`${container} pb-16`}>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink px-6 py-10 sm:flex-row sm:items-center sm:px-10">
            <div>
              <h2 className="font-display text-2xl font-bold text-white sm:text-[2rem]">Know a business that isn&rsquo;t listed?</h2>
              <p className="mt-2 max-w-xl text-white/75">Add it in a minute. Shops and online sellers are both welcome, and we check every listing.</p>
            </div>
            <Link href="/businesses/new" className={`${btn.coral} shrink-0`}>
              <PlusIcon size={18} /> Add a business
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
