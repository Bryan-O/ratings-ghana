import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumb } from "@/components/breadcrumb";
import { BusinessImage } from "@/components/business-image";
import { Stars } from "@/components/stars";
import { CategoryIcon, GlobeIcon, LocationIcon, PhoneIcon, PlusIcon, ShieldCheckIcon } from "@/components/icons";
import { EmptyState } from "@/components/empty-state";
import { PhotoGallery } from "@/components/photo-gallery";
import { PhotoUpload } from "@/components/photo-upload";
import { RatingBars } from "@/components/rating-bars";
import { Reveal } from "@/components/reveal";
import { ReviewList } from "@/components/review-list";
import { ShareButton } from "@/components/share-button";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { ReviewForm } from "@/components/review-form";
import { btn, card, container, eyebrow, lift, tile, type } from "@/components/ui";
import { formatGhanaPhone, normalizeGhanaPhone } from "@/lib/phone";
import { countMyPendingPhotos, getBusinessBySlug, getPublishedReviews, getUserReview } from "@/lib/queries";
import { ratingDistribution } from "@/lib/ratings";
import { getCurrentUser, nextVerificationStep } from "@/lib/session";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await getBusinessBySlug((await params).slug);
  return b?.status === "APPROVED" ? { title: b.name, description: b.description.slice(0, 160) } : {};
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);
  if (!business || business.status !== "APPROVED") notFound();

  const [reviews, user] = await Promise.all([getPublishedReviews(business.id), getCurrentUser()]);
  const [myReview, myPendingPhotos] = user
    ? await Promise.all([getUserReview(user.id, business.id), countMyPendingPhotos(user.id, business.id)])
    : [null, 0];
  const step = nextVerificationStep(user);
  const dist = ratingDistribution(reviews.map((r) => r.rating));
  const imgs = business.images;
  const where = [business.address, business.city].filter(Boolean).join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([business.name, business.address, business.city, "Ghana"].filter(Boolean).join(", "))}`;
  const phoneE164 = business.phone ? normalizeGhanaPhone(business.phone) : null;
  const isSubmitter = user?.id === business.submittedById;

  return (
    <>
      <SiteHeader />

      <main id="main" tabIndex={-1} className="flex-1">
      {/* Business header */}
      <section>
        <div className={`${container} pt-8 pb-6 sm:pt-10`}>
          <Breadcrumb
            crumbs={[
              { label: "Home", href: "/" },
              { label: business.category, href: `/businesses?category=${encodeURIComponent(business.category)}` },
              { label: business.name },
            ]}
          />
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand">
                  <CategoryIcon category={business.category} size={16} /> {business.category}
                </span>
                <span className="rounded-full border border-line-strong px-3 py-1 text-sm font-semibold text-ink">
                  {business.type === "ONLINE" ? "Online business" : "Physical location"}
                </span>
              </div>
              <h1 className="mt-4 font-display text-[clamp(2.25rem,9vw,4.5rem)] leading-[1.05] font-bold tracking-[-0.025em] break-words">{business.name}</h1>
            </div>
            <div id="business-actions" className="flex flex-wrap gap-3 self-start lg:self-auto">
              <a href="#write-review" className={btn.cta}>
                {myReview ? "Edit your review" : "Rate this business"}
              </a>
              <ShareButton title={business.name} />
            </div>
          </div>
        </div>
      </section>

      <div className={`${container} pb-8`}>
        {/* Bento summary: photos, the rating, who rated it, and how to reach the business */}
        <Reveal as="div" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:grid-rows-[minmax(12rem,auto)_minmax(12rem,auto)]">
          <div className={`${tile} col-span-2 bg-brand-wash p-2 lg:row-span-2`}>
            {imgs.length > 0 ? (
              <PhotoGallery images={imgs} name={business.name} variant="tile" />
            ) : (
              <div className="relative min-h-44 flex-1 overflow-hidden rounded-2xl sm:min-h-56">
                <BusinessImage name={business.name} category={business.category} />
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3 pb-1">
              <p className="text-sm text-muted">
                {imgs.length === 0 ? (
                  "No photos yet. You could add the first."
                ) : (
                  <Link href={`/businesses/${business.slug}/photos`} className="inline-flex min-h-11 items-center font-semibold text-brand transition-colors duration-200 hover:text-ink">
                    See all {imgs.length} photo{imgs.length === 1 ? "" : "s"}
                  </Link>
                )}
              </p>
              <a href="#add-photos" className={btn.smOutline}>
                <PlusIcon size={16} /> Add photos
              </a>
            </div>
          </div>

          <a href="#reviews-heading" className={`${tile} group justify-between bg-ink p-5 text-white sm:p-7 ${lift}`}>
            <span className={`${eyebrow} text-white/60`}>Rating</span>
            <span className={`${type.numeral} mt-5 text-6xl sm:text-7xl`}>{business.reviewCount ? business.avgRating.toFixed(1) : "–"}</span>
            <span className="mt-3">
              <Stars rating={business.avgRating} size={16} onDark />
              <span className="mt-1 block text-xs text-white/70">
                {business.reviewCount} verified rating{business.reviewCount === 1 ? "" : "s"}
              </span>
            </span>
          </a>

          <div className={`${tile} justify-between bg-brand p-5 text-white sm:p-7`}>
            <span className={`${eyebrow} text-white/70`}>Who rated it</span>
            <span className={`${type.numeral} mt-5 text-6xl sm:text-7xl`}>{reviews.length}</span>
            <span className="mt-3 flex items-start gap-1.5 text-sm text-white/85">
              <ShieldCheckIcon size={16} className="mt-0.5 shrink-0" /> Verified reviewers, one review each
            </span>
          </div>

          <section className={`${tile} col-span-2 bg-brand-wash p-5 sm:p-7`} aria-labelledby="contact-heading">
            <h2 id="contact-heading" className={eyebrow}>
              {business.type === "ONLINE" ? "Website & contact" : "Location & contact"}
            </h2>
            {where || business.website || business.phone ? (
              <ul className="mt-4 grid gap-3 text-[15px] sm:grid-cols-2">
                {business.address && (
                  <li className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-paper text-ink"><LocationIcon size={18} /></span>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="min-w-0 pt-1.5 font-medium text-ink transition-colors duration-200 hover:text-brand">
                      {where} <span className="text-sm text-brand">· Open in Maps</span>
                    </a>
                  </li>
                )}
                {business.website && (
                  <li className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-paper text-ink"><GlobeIcon size={18} /></span>
                    <a href={business.website} target="_blank" rel="noopener noreferrer nofollow" className="min-w-0 pt-1.5 font-medium break-all text-ink transition-colors duration-200 hover:text-brand">
                      {business.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </a>
                  </li>
                )}
                {business.phone && (
                  <li className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-paper text-ink"><PhoneIcon size={18} /></span>
                    <a href={`tel:${phoneE164 ?? business.phone}`} className="pt-1.5 font-medium text-ink transition-colors duration-200 hover:text-brand">
                      {phoneE164 ? formatGhanaPhone(phoneE164) : business.phone}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="mt-4 text-muted">No contact details yet.</p>
            )}
          </section>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
          {/* About */}
          <section className={`${card} p-6 lg:col-start-1`} aria-labelledby="about-heading">
            <h2 id="about-heading" className="font-display text-xl font-bold">About</h2>
            <p className="mt-3 whitespace-pre-line text-body">{business.description}</p>
          </section>

          {/* Sidebar: write a review + contact (after About on mobile, right column on desktop) */}
          <aside className="flex flex-col gap-6 lg:col-start-2 lg:row-span-3 lg:row-start-1">
            <section id="write-review" className="scroll-mt-24 rounded-2xl border-2 border-ink bg-paper p-6" aria-labelledby="write-heading">
              <h2 id="write-heading" className="font-display text-xl font-bold">{myReview ? "Your review" : "How did it really go?"}</h2>
              {!myReview && <p className="mt-1 text-sm text-muted">Rate the business and tell people what mattered.</p>}
              <div className="mt-4">
                {step === null && user ? (
                  isSubmitter ? (
                    <p className="text-muted">You added this business, so you can&apos;t review it.</p>
                  ) : (
                    <ReviewForm
                      businessId={business.id}
                      existing={myReview ? { rating: myReview.rating, title: myReview.title, body: myReview.body } : undefined}
                    />
                  )
                ) : (
                  <VerificationPrompt step={step} slug={business.slug} purpose="review" />
                )}
              </div>
            </section>

            <section id="add-photos" className={`${card} p-6`} aria-labelledby="photos-heading">
              <h2 id="photos-heading" className="font-display text-xl font-bold">Add photos</h2>
              <p className="mt-1 mb-4 text-sm text-muted">Been here? Share photos of the place, food, products or service.</p>
              {myPendingPhotos > 0 && (
                <p className="mb-4 rounded-xl bg-brand-soft px-4 py-3 text-sm font-medium text-brand" role="status">
                  You have {myPendingPhotos} photo{myPendingPhotos === 1 ? "" : "s"} awaiting review.
                </p>
              )}
              {step === null && user ? (
                <PhotoUpload businessId={business.id} />
              ) : (
                <VerificationPrompt step={step} slug={business.slug} purpose="photos" />
              )}
            </section>
          </aside>

          {/* Rating breakdown */}
          <section className="rounded-2xl bg-brand-wash p-6 lg:col-start-1" aria-labelledby="ratings-heading">
            <h2 id="ratings-heading" className="font-display text-xl font-bold">Rating breakdown</h2>
            <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
              <RatingBars dist={dist} total={reviews.length} />
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-muted">
              <ShieldCheckIcon size={16} className="text-brand" /> Only verified reviewers can rate. One review per person.
            </p>
          </section>

          {/* Reviews */}
          <section className="lg:col-start-1" aria-labelledby="reviews-heading">
            <h2 id="reviews-heading" className="font-display text-2xl font-bold">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="No reviews yet. You could be first." text="Share a real experience to help the next customer.">
                  <a href="#write-review" className={btn.cta}>Rate this business</a>
                </EmptyState>
              </div>
            ) : (
              <div className="mt-4">
                <ReviewList
                  reviews={reviews.map((r) => ({
                    id: r.id,
                    rating: r.rating,
                    title: r.title,
                    body: r.body,
                    createdAt: r.createdAt,
                    user: { name: r.user.name },
                    canReport: Boolean(user?.emailVerified) && user?.id !== r.userId,
                    isMine: user?.id === r.userId,
                  }))}
                />
              </div>
            )}
          </section>
        </div>
      </div>
      </main>
      <MobileActionBar watch="business-actions" target="write-review">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display font-bold text-ink">{business.name}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <Stars rating={business.avgRating} size={14} />
              <span className="font-display font-bold text-ink">{business.reviewCount ? business.avgRating.toFixed(1) : "–"}</span>· {business.reviewCount}
            </p>
          </div>
          <a href="#write-review" className={`${btn.cta} shrink-0 px-5`}>
            {myReview ? "Edit review" : "Rate it"}
          </a>
        </div>
      </MobileActionBar>
      <SiteFooter />
    </>
  );
}

function VerificationPrompt({
  step,
  slug,
  purpose,
}: {
  step: ReturnType<typeof nextVerificationStep>;
  slug: string;
  purpose: "review" | "photos";
}) {
  const next = encodeURIComponent(`/businesses/${slug}#${purpose === "review" ? "write-review" : "add-photos"}`);
  const what = purpose === "review" ? "write a review" : "add photos";
  const copy = {
    login: {
      text: purpose === "review" ? "Log in or create an account to share your experience." : "Log in or create an account to add photos.",
      href: `/login?next=${next}`,
      cta: purpose === "review" ? "Log in to review" : "Log in to add photos",
    },
    "verify-email": { text: `Verify your email address to ${what}.`, href: "/login", cta: "Verify email" },
    "verify-phone": {
      text: `Prove you're a real person to ${what}. We'll text you a code. Your number stays private.`,
      href: `/verify-phone?next=${next}`,
      cta: "Verify phone number",
    },
  } as const;
  const c = copy[step ?? "login"];
  return (
    <div>
      <p className="text-muted">{c.text}</p>
      <Link href={c.href} className={`${btn.primary} mt-4 w-full`}>
        {c.cta}
      </Link>
    </div>
  );
}
