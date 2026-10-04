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
import { ReviewCard } from "@/components/review-card";
import { ReviewForm } from "@/components/review-form";
import { btn, card, container } from "@/components/ui";
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

      {/* Business header */}
      <section className="border-b border-line">
        <div className={`${container} py-8`}>
          <Breadcrumb
            crumbs={[
              { label: "Home", href: "/" },
              { label: business.category, href: `/businesses?category=${encodeURIComponent(business.category)}` },
              { label: business.name },
            ]}
          />
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand">
                  <CategoryIcon category={business.category} size={16} /> {business.category}
                </span>
                <span className="rounded-full border border-line-strong px-3 py-1 text-sm font-semibold text-ink">
                  {business.type === "ONLINE" ? "Online business" : "Physical location"}
                </span>
              </div>
              <h1 className="mt-3 font-display text-[2rem] leading-tight font-bold tracking-tight sm:text-5xl">{business.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="inline-flex items-center gap-2">
                  <Stars rating={business.avgRating} size={22} />
                  <span className="font-display text-2xl font-bold text-ink">{business.reviewCount ? business.avgRating.toFixed(1) : "–"}</span>
                </span>
                <span className="text-muted">
                  {business.reviewCount} verified review{business.reviewCount === 1 ? "" : "s"}
                </span>
                {where && (
                  <span className="inline-flex items-center gap-1.5 text-muted">
                    <LocationIcon size={16} /> {where}
                  </span>
                )}
              </div>
            </div>
            <a href="#write-review" className={`${btn.cta} self-start lg:self-auto`}>
              {myReview ? "Edit your review" : "Rate this business"}
            </a>
          </div>
        </div>
      </section>

      <main className={`${container} flex-1 py-8`}>
        {/* Gallery */}
        {imgs.length > 0 ? (
          <PhotoGallery images={imgs} name={business.name} />
        ) : (
          <section aria-label="Photos" className="relative h-44 overflow-hidden rounded-3xl sm:h-64">
            <BusinessImage name={business.name} category={business.category} />
          </section>
        )}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            {imgs.length === 0 ? (
              "No photos yet. You could add the first."
            ) : (
              <>
                {imgs.length} photo{imgs.length === 1 ? "" : "s"} ·{" "}
                <Link href={`/businesses/${business.slug}/photos`} className="font-semibold text-brand transition-colors duration-200 hover:text-ink">
                  See all photos
                </Link>
              </>
            )}
          </p>
          <a href="#add-photos" className={btn.smOutline}>
            <PlusIcon size={16} /> Add photos
          </a>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8">
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

            <section className={`${card} p-6`} aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="font-display text-xl font-bold">
                {business.type === "ONLINE" ? "Website & contact" : "Location & contact"}
              </h2>
              <ul className="mt-4 space-y-3 text-[15px]">
                {business.address && (
                  <li className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-wash text-ink"><LocationIcon size={18} /></span>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="pt-1.5 font-medium text-ink hover:text-brand">
                      {where} <span className="text-sm text-brand">· Open in Maps</span>
                    </a>
                  </li>
                )}
                {business.website && (
                  <li className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-wash text-ink"><GlobeIcon size={18} /></span>
                    <a href={business.website} target="_blank" rel="noopener noreferrer nofollow" className="pt-1.5 font-medium break-all text-ink hover:text-brand">
                      {business.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                    </a>
                  </li>
                )}
                {business.phone && (
                  <li className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-wash text-ink"><PhoneIcon size={18} /></span>
                    <a href={`tel:${phoneE164 ?? business.phone}`} className="pt-1.5 font-medium text-ink hover:text-brand">
                      {phoneE164 ? formatGhanaPhone(phoneE164) : business.phone}
                    </a>
                  </li>
                )}
              </ul>
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
              <div className="flex shrink-0 flex-col items-center px-4">
                <p className="font-display text-6xl leading-none font-bold text-ink">{business.reviewCount ? business.avgRating.toFixed(1) : "–"}</p>
                <Stars rating={business.avgRating} size={18} className="mt-2" />
                <p className="mt-1 text-sm text-muted">
                  {business.reviewCount} verified rating{business.reviewCount === 1 ? "" : "s"}
                </p>
              </div>
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
              <ul className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <li key={r.id}>
                    <ReviewCard review={r} canReport={Boolean(user?.emailVerified) && user?.id !== r.userId} isMine={user?.id === r.userId} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
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
