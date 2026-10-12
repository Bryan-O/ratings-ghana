import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchBar } from "@/components/search-bar";
import { BusinessCard } from "@/components/business-card";
import { Stars } from "@/components/stars";
import { ArrowRightIcon, BadgeCheckIcon, CategoryIcon, FlagIcon, PlusIcon, SmartphoneIcon } from "@/components/icons";
import { EmptyState } from "@/components/empty-state";
import { Rail } from "@/components/rail";
import { HeroHeadline, afterHeadline } from "@/components/hero-headline";
import { Reveal } from "@/components/reveal";
import { ReviewTicker, type TickerReview } from "@/components/review-ticker";
import { VerifiedBadge } from "@/components/verified-badge";
import { btn, card, chip, container, eyebrow, lift, tile, type } from "@/components/ui";
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

const HEADLINE = [{ text: "Real people." }, { text: "Real opinions." }, { text: "No filters.", accent: true }];
const WORDS = HEADLINE.reduce((n, l) => n + l.text.split(" ").length, 0);

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

  // Bento feature: the best-rated business with enough reviews to mean something.
  const topRated = [...popular].filter((b) => b.reviewCount >= 3).sort((a, b) => b.avgRating - a.avgRating)[0] ?? popular[0];

  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="flex-1">
        {/* Hero: one oversized statement, search as the one action */}
        <section className="overflow-hidden">
          <div className={`${container} pt-12 pb-14 sm:pt-20 sm:pb-20 lg:pt-28 lg:pb-24`}>
            <p className={`${eyebrow} animate-fade-up`}>Business reviews you can check</p>
            <HeroHeadline className={`mt-5 ${type.giant}`} lines={HEADLINE} />
            <div className="mt-10 grid grid-cols-1 items-end gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-16">
              <p
                className="max-w-md animate-fade-up text-lg leading-relaxed text-body sm:text-xl"
                style={{ animationDelay: `${afterHeadline(WORDS)}ms` }}
              >
                See how shops, restaurants and online sellers really treat their customers, from people who proved they&rsquo;re real.
              </p>
              <div className="min-w-0 animate-fade-up" style={{ animationDelay: `${afterHeadline(WORDS, 90)}ms` }}>
                <SearchBar size="lg" />
                <div className="-mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 py-1 text-sm [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
                  <span className="shrink-0 text-muted">Try:</span>
                  {POPULAR_SEARCHES.map((s) => (
                    <Link key={s.label} href={s.href} className={chip(false)}>
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento: what's happening right now */}
        <section className={`${container} pb-16 sm:pb-24`} aria-labelledby="now-heading">
          <h2 id="now-heading" className="sr-only">
            Right now on RatingsGhana
          </h2>
          <Reveal as="div" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-[minmax(13rem,auto)_minmax(13rem,auto)]">
            {ticker.length > 0 ? (
              <div className="col-span-2 min-w-0 lg:row-span-2 [&>figure]:h-full">
                <ReviewTicker reviews={ticker} />
              </div>
            ) : (
              <div className="col-span-2 lg:row-span-2 [&>div]:h-full">
                <EmptyState title="No reviews yet. You could be first." text="Share a real experience to help the next customer." />
              </div>
            )}

            {topRated && (
              <Link
                href={`/businesses/${topRated.slug}`}
                className={`${tile} group col-span-2 bg-ink p-5 text-white sm:p-7 ${lift}`}
              >
                <span className={`${eyebrow} text-white/60`}>Top rated</span>
                <span className="mt-auto flex flex-wrap items-end justify-between gap-x-6 gap-y-3 pt-6">
                  <span className="min-w-0">
                    <span className="block font-display text-2xl leading-tight font-bold sm:text-3xl">{topRated.name}</span>
                    <span className="mt-1 block text-sm text-white/70">
                      {topRated.category}
                      {topRated.city ? ` · ${topRated.city}` : ""}
                    </span>
                  </span>
                  <span className="flex items-end gap-3">
                    <span className={`${type.numeral} text-6xl sm:text-7xl`}>{topRated.avgRating.toFixed(1)}</span>
                    <span className="pb-1.5">
                      <Stars rating={topRated.avgRating} size={16} onDark />
                      <span className="mt-1 block text-xs text-white/70">{topRated.reviewCount} ratings</span>
                    </span>
                  </span>
                </span>
                <ArrowRightIcon
                  size={20}
                  className="absolute top-5 right-5 transition-transform duration-300 ease-spring group-hover:translate-x-1 group-focus-visible:translate-x-1 sm:top-7 sm:right-7"
                />
              </Link>
            )}

            <div className={`${tile} justify-between bg-coral-tint p-5 sm:p-7`}>
              <span className={`${eyebrow} text-ink/70`}>Verified reviews</span>
              <span className={`${type.numeral} mt-5 text-5xl text-ink sm:mt-6 sm:text-7xl`}>{stats.reviews}</span>
              <span className="mt-3 flex items-center gap-1.5 text-sm text-ink">
                <BadgeCheckIcon size={16} className="shrink-0 text-brand" /> Email and phone checked
              </span>
            </div>

            <Link href="/businesses" className={`${tile} group justify-between bg-brand-wash p-5 sm:p-7 ${lift}`}>
              <span className={eyebrow}>Businesses listed</span>
              <span className={`${type.numeral} mt-5 text-5xl text-ink sm:mt-6 sm:text-7xl`}>{stats.businesses}</span>
              <span className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand">
                Browse all
                <ArrowRightIcon size={16} className="transition-transform duration-300 ease-spring group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        </section>

        {/* Categories */}
        <section className={`${container} pb-16 sm:pb-24`} aria-labelledby="cat-heading">
          <div className="flex items-end justify-between gap-4">
            <h2 id="cat-heading" className={type.section}>
              Browse by category
            </h2>
            <Link href="/businesses" className="group hidden min-h-11 shrink-0 items-center gap-1 font-semibold text-brand transition-colors duration-200 hover:text-ink sm:inline-flex">
              All businesses <ArrowRightIcon size={18} className="transition-transform duration-200 ease-spring group-hover:translate-x-1" />
            </Link>
          </div>
          <Reveal as="ul" className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/businesses?category=${encodeURIComponent(c)}`}
                  className={`${tile} group h-full min-h-28 cursor-pointer justify-between gap-5 border border-transparent bg-brand-wash p-4 sm:min-h-40 sm:p-6 ${lift}`}
                >
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-paper text-ink transition-colors duration-200 group-hover:bg-coral sm:size-12">
                    <CategoryIcon category={c} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg leading-tight font-bold text-ink sm:text-xl">{c}</span>
                    <span className="mt-0.5 block text-sm text-muted">{counts.get(c) ?? 0} listed</span>
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </section>

        {/* Most reviewed */}
        {popular.length > 0 && (
          <section className="pb-16 sm:pb-24" aria-labelledby="top-heading">
            <div className={container}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 id="top-heading" className={type.section}>Most reviewed right now</h2>
                  <p className="mt-2 text-muted sm:text-lg">Where people are saying the most.</p>
                </div>
                <Link href="/businesses" className="group hidden min-h-11 items-center gap-1 font-semibold text-brand transition-colors duration-200 hover:text-ink sm:inline-flex">
                  See all <ArrowRightIcon size={18} className="transition-transform duration-200 ease-spring group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="mt-8 sm:mt-10">
                <Rail
                  label="Most reviewed businesses"
                  className="-mx-4 -mb-5 px-4 pt-2 pb-7 sm:-mx-6 sm:px-6 lg:mx-0 lg:mb-0 lg:pt-0 lg:pb-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0"
                >
                  {popular.map((b) => (
                    <li key={b.id} className="w-[78%] max-w-80 shrink-0 snap-start sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.7rem)] lg:w-auto lg:max-w-none">
                      <BusinessCard business={b} headingLevel={3} />
                    </li>
                  ))}
                </Rail>
              </div>
            </div>
          </section>
        )}

        {/* Trust, earned */}
        <section className="bg-ink py-16 text-white/80 sm:py-24" aria-labelledby="trust-heading">
          <div className={container}>
            <div className="max-w-2xl">
              <h2 id="trust-heading" className={`${type.section} text-white`}>Trust, earned.</h2>
              <p className="mt-3 text-lg">Fake reviews make review sites useless. Here&rsquo;s how we keep them out.</p>
            </div>
            <Reveal as="ul" className="mt-8 grid gap-4 sm:mt-10 lg:grid-cols-3 lg:gap-5">
              {TRUST.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4 rounded-2xl border border-white/15 p-5 transition-colors duration-200 hover:border-white/40 sm:p-6 lg:block">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
                    <Icon size={22} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-xl font-bold text-white lg:mt-5">{title}</h3>
                    <p className="mt-1.5 lg:mt-2">{text}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Recent reviews */}
        {recent.length > 0 && (
          <section className="py-16 sm:py-24" aria-labelledby="recent-heading">
            <div className={container}>
              <h2 id="recent-heading" className={type.section}>Latest reviews</h2>
              <div className="mt-8 sm:mt-10">
              <Rail
                label="Latest reviews"
                className="-mx-4 -mb-5 px-4 pt-2 pb-7 sm:-mx-6 sm:px-6 lg:mx-0 lg:mb-0 lg:pt-0 lg:pb-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0"
              >
                {recent.slice(0, 3).map((r) => (
                  <li key={r.id} className="w-[85%] max-w-96 shrink-0 snap-start sm:w-[calc(50%-0.5rem)] lg:w-auto lg:max-w-none">
                    <Link href={`/businesses/${r.business.slug}`} className={`flex h-full cursor-pointer flex-col p-6 ${card} ${lift}`}>
                      <p className="flex flex-wrap items-center gap-2 font-semibold text-ink">
                        {displayName(r.user.name)} <VerifiedBadge />
                      </p>
                      <p className="mt-3 flex items-center gap-2 text-sm">
                        <Stars rating={r.rating} size={16} />
                        <span className="font-display font-bold text-ink">{r.rating.toFixed(1)}</span>
                      </p>
                      <h3 className="mt-3 font-semibold text-ink">{r.title}</h3>
                      <p className="mt-1 line-clamp-3 text-body">{r.body}</p>
                      <p className="mt-auto pt-4 text-sm text-brand">on {r.business.name}</p>
                    </Link>
                  </li>
                ))}
              </Rail>
              </div>
            </div>
          </section>
        )}

        {/* One clear action */}
        <section className={`${container} pb-16 sm:pb-24`}>
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-ink px-6 py-10 sm:px-12 sm:py-14 lg:flex-row lg:items-end">
            <div>
              <h2 className={`${type.section} max-w-3xl text-white`}>Know a place we&rsquo;re missing?</h2>
              <p className="mt-3 max-w-xl text-lg text-white/75">Add it in a minute. Shops and online sellers are both welcome, and we check every listing.</p>
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
