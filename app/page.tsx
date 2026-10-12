import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SearchBar } from "@/components/search-bar";
import { BusinessCard, BusinessThumb, whereLabel } from "@/components/business-card";
import { Stars } from "@/components/stars";
import { ArrowRightIcon, BadgeCheckIcon, CategoryIcon, FlagIcon, PlusIcon, SmartphoneIcon } from "@/components/icons";
import { EmptyState } from "@/components/empty-state";
import { Rail } from "@/components/rail";
import { HeroHeadline, afterHeadline } from "@/components/hero-headline";
import { VerifiedBadge } from "@/components/verified-badge";
import { Avatar } from "@/components/avatar";
import { btn, container, lift, seeMore, type } from "@/components/ui";
import { CATEGORIES } from "@/lib/constants";
import { displayName } from "@/lib/format";
import { getBestInCategory, getCategoryCounts, getRecentReviews, getSiteStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

const HEADLINE = [{ text: "Real people." }, { text: "Real opinions." }, { text: "No filters.", accent: true }];
const WORDS = HEADLINE.reduce((n, l) => n + l.text.split(" ").length, 0);

const TRUST = [
  {
    icon: SmartphoneIcon,
    title: "Prove you're a real person",
    text: "Every reviewer confirms their email and a mobile number. One number, one account.",
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

const categoryHref = (c: string) => `/businesses?category=${encodeURIComponent(c)}`;

// Rows of cards: a swipe row on phones and tablets, four across on desktop.
const rowClass = "-mx-4 px-4 pt-1 pb-3 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 lg:pb-0";
const rowItem = "w-[72%] max-w-72 shrink-0 snap-start sm:w-[calc(40%-0.5rem)] lg:w-auto lg:max-w-none";

export default async function HomePage() {
  const [counts, recent, stats] = await Promise.all([getCategoryCounts(), getRecentReviews(8), getSiteStats()]);
  const categories = CATEGORIES.filter((c) => c !== "Other");

  // "Best in …" rows: the two categories with the most listings.
  const best = [...counts.entries()]
    .filter(([c, n]) => c !== "Other" && n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([c]) => c);
  const rows = await Promise.all(best.map(async (c) => ({ category: c, items: await getBestInCategory(c, 4) })));

  return (
    <>
      <SiteHeader search={false} />
      <main id="main" tabIndex={-1} className="flex-1">
        {/* Hero: centred statement and search, with flat brand shapes in the corners */}
        <section className="relative overflow-hidden bg-brand-wash">
          <span aria-hidden className="absolute -top-28 -left-24 size-40 rounded-full bg-coral sm:-top-40 sm:left-[8%] sm:size-80" />
          <span aria-hidden className="absolute -right-20 -bottom-24 size-32 rounded-[2rem] bg-brand sm:-right-16 sm:-bottom-20 sm:size-64 sm:rounded-[3rem] lg:right-[6%]" />
          <span aria-hidden className="absolute bottom-8 -left-10 hidden size-28 rounded-full bg-coral-tint sm:block" />
          <div className={`${container} relative flex flex-col items-center py-16 text-center sm:py-24`}>
            <HeroHeadline className={type.giant} lines={HEADLINE} />
            <p
              className="mt-4 max-w-xl animate-fade-up text-base text-body sm:text-lg"
              style={{ animationDelay: `${afterHeadline(WORDS)}ms` }}
            >
              See how shops, restaurants and online sellers really treat their customers, from people who proved they&rsquo;re real.
            </p>
            <div className="mt-8 w-full max-w-2xl animate-fade-up" style={{ animationDelay: `${afterHeadline(WORDS, 90)}ms` }}>
              <SearchBar size="lg" />
            </div>
            <a
              href="#trust-heading"
              className="mt-5 inline-flex min-h-11 animate-fade-up items-center gap-1 text-sm text-body transition-colors duration-200 hover:text-brand"
              style={{ animationDelay: `${afterHeadline(WORDS, 160)}ms` }}
            >
              How we keep reviews real <ArrowRightIcon size={14} />
            </a>
          </div>
        </section>

        {/* Prompt on a divider line */}
        <div className={`${container} relative py-8 sm:py-10`}>
          <span aria-hidden className="absolute inset-x-4 top-1/2 h-px bg-line sm:inset-x-6 lg:inset-x-8" />
          <p className="relative mx-auto w-fit rounded-full border border-line bg-paper px-4 py-2 text-center text-sm text-body">
            Been somewhere recently?{" "}
            <Link href="/businesses" className="inline-flex items-center gap-1 font-semibold text-brand transition-colors duration-200 hover:text-ink">
              Write a review <ArrowRightIcon size={14} />
            </Link>
          </p>
        </div>

        {/* Categories */}
        <section className={`${container} pb-12`} aria-labelledby="cat-heading">
          <div className="flex items-center justify-between gap-4">
            <h2 id="cat-heading" className={type.section}>
              What are you looking for?
            </h2>
            <Link href="/businesses" className={seeMore}>See more</Link>
          </div>
          <div className="mt-5">
            <Rail label="Categories" className="-mx-4 gap-1 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:justify-between lg:px-0">
              {categories.map((c) => (
                <li key={c} className="shrink-0 snap-start">
                  <Link
                    href={categoryHref(c)}
                    className="group flex w-[6.5rem] cursor-pointer flex-col items-center gap-2 rounded-xl px-2 py-3 text-center transition-colors duration-200 hover:bg-brand-wash active:bg-brand-soft"
                  >
                    <span className="flex size-12 items-center justify-center rounded-full bg-brand-wash text-ink transition-[background-color,translate] duration-200 ease-spring group-hover:-translate-y-0.5 group-hover:bg-coral group-active:bg-coral">
                      <CategoryIcon category={c} size={22} />
                    </span>
                    <span className="text-sm leading-tight font-medium text-ink">{c}</span>
                    <span className="text-xs text-muted">{counts.get(c) ?? 0} listed</span>
                  </Link>
                </li>
              ))}
            </Rail>
          </div>
        </section>

        {/* Promo band */}
        <section className={`${container} pb-12`}>
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-coral-soft px-6 py-6 sm:flex-row sm:items-center sm:px-8">
            <div>
              <h2 className="text-lg font-bold">Know a place we&rsquo;re missing?</h2>
              <p className="mt-0.5 text-body">Add it in a minute. Shops and online sellers are both welcome, and we check every listing.</p>
            </div>
            <Link href="/businesses/new" className={`${btn.smPrimary} shrink-0`}>
              <PlusIcon size={16} /> Add a business
            </Link>
          </div>
        </section>

        {rows[0] && <BestRow {...rows[0]} />}

        {/* Join band */}
        <section className={`${container} pb-12`} aria-labelledby="join-heading">
          <div className="grid grid-cols-1 items-center gap-8 rounded-2xl bg-brand-soft px-6 py-10 sm:px-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <h2 id="join-heading" className="font-display text-[1.75rem] leading-tight font-extrabold tracking-[-0.02em] sm:text-[2rem]">
                Help people make the right choice
              </h2>
              <p className="mt-3 max-w-md text-body">
                Share how it really went. Every reviewer proves they&rsquo;re a real person first, so what you read here counts.
              </p>
              <Link href="/register" className={`${btn.smPrimary} mt-6`}>
                Log in or sign up
              </Link>
            </div>
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-paper p-5">
                <dt className="text-sm text-muted">Verified reviews</dt>
                <dd className={`${type.numeral} mt-2 text-4xl text-ink sm:text-5xl`}>{stats.reviews}</dd>
              </div>
              <div className="rounded-xl bg-paper p-5">
                <dt className="text-sm text-muted">Businesses listed</dt>
                <dd className={`${type.numeral} mt-2 text-4xl text-ink sm:text-5xl`}>{stats.businesses}</dd>
              </div>
            </dl>
          </div>
        </section>

        {rows[1] && <BestRow {...rows[1]} />}

        {/* How we keep reviews real */}
        <section className={`${container} pb-12`} aria-labelledby="trust-heading">
          <div className="grid grid-cols-1 gap-8 rounded-2xl bg-coral-tint px-6 py-10 sm:px-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center">
            <div>
              <h2 id="trust-heading" className="scroll-mt-24 font-display text-[1.75rem] leading-tight font-extrabold tracking-[-0.02em] sm:text-[2rem]">
                We&rsquo;re RatingsGhana
              </h2>
              <p className="mt-3 max-w-md text-body">
                A review platform for businesses in Ghana, open to everyone with a real experience to share. Fake reviews make review
                sites useless, so here&rsquo;s how we keep them out.
              </p>
              <Link href="/businesses" className={`${btn.smPrimary} mt-6`}>
                Browse businesses
              </Link>
            </div>
            <ul className="space-y-4 rounded-2xl bg-ink p-6 text-white/80 sm:p-8">
              {TRUST.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white">{title}</h3>
                    <p className="mt-0.5 text-sm">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Recent reviews */}
        <section className={`${container} pb-16`} aria-labelledby="recent-heading">
          <h2 id="recent-heading" className={type.section}>Recent reviews</h2>
          <div className="mt-5">
            {recent.length === 0 ? (
              <EmptyState title="No reviews yet. You could be first." text="Share a real experience to help the next customer." />
            ) : (
              <Rail label="Recent reviews" className={rowClass}>
                {recent.map((r) => (
                  <li key={r.id} className={rowItem}>
                    <Link
                      href={`/businesses/${r.business.slug}`}
                      className={`group flex h-full cursor-pointer flex-col rounded-xl border border-line bg-paper ${lift}`}
                    >
                      <span className="flex flex-1 flex-col p-4">
                        <span className="flex items-center gap-3">
                          <Avatar name={displayName(r.user.name)} />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-ink">{displayName(r.user.name)}</span>
                            <Stars rating={r.rating} size={14} />
                          </span>
                        </span>
                        <span className="mt-3 line-clamp-4 text-sm text-body">
                          <span className="font-semibold text-ink">{r.title}.</span> {r.body}
                        </span>
                      </span>
                      <span className="flex items-center gap-3 border-t border-line p-4">
                        <BusinessThumb business={r.business} size="sm" />
                        <span className="min-w-0 text-sm">
                          <span className="block truncate font-semibold text-ink transition-colors duration-200 group-hover:text-brand">
                            {r.business.name}
                          </span>
                          <span className="block truncate text-muted">{whereLabel(r.business) || r.business.category}</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </Rail>
            )}
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            <VerifiedBadge /> Every review here comes from someone who verified their email and phone.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

/** "Best in <category>": the four best-rated listings in one category. */
function BestRow({ category, items }: { category: string; items: Awaited<ReturnType<typeof getBestInCategory>> }) {
  const id = `best-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <section className={`${container} pb-12`} aria-labelledby={id}>
      <div className="flex items-center justify-between gap-4">
        <h2 id={id} className={type.section}>
          Best in {category}
        </h2>
        <Link href={`${categoryHref(category)}&sort=rating`} className={seeMore}>See more</Link>
      </div>
      <div className="mt-5">
        <Rail label={`Best in ${category}`} className={rowClass}>
          {items.map((b) => (
            <li key={b.id} className={rowItem}>
              <BusinessCard business={b} headingLevel={3} />
            </li>
          ))}
        </Rail>
      </div>
    </section>
  );
}

