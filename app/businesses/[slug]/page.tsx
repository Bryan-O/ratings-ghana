import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Breadcrumb } from "@/components/breadcrumb";
import { BusinessImage } from "@/components/business-image";
import { Stars } from "@/components/stars";
import { BadgeCheckIcon, CategoryIcon, ExternalIcon, FlagIcon, GlobeIcon, LocationIcon, PencilIcon, PhoneIcon, PlusIcon, ShieldCheckIcon } from "@/components/icons";
import { EmptyState } from "@/components/empty-state";
import { PhotoGallery } from "@/components/photo-gallery";
import { PhotoUpload } from "@/components/photo-upload";
import { RatingBars } from "@/components/rating-bars";
import { ReviewList } from "@/components/review-list";
import { ShareButton } from "@/components/share-button";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { ReviewForm } from "@/components/review-form";
import { btn, container, type } from "@/components/ui";
import { formatGhanaPhone, normalizeGhanaPhone } from "@/lib/phone";
import { countMyPendingPhotos, getBusinessBySlug, getPublishedReviews, getUserReview } from "@/lib/queries";
import { ratingDistribution, ratingLabel } from "@/lib/ratings";
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

      {/* Ink band with the breadcrumb; the page sits on a white sheet with a rounded top (Trustpilot-style). */}
      <div className="bg-ink">
        <div className={`${container} pt-1 pb-5`}>
          <Breadcrumb
            onDark
            crumbs={[
              { label: "Home", href: "/" },
              { label: business.category, href: `/businesses?category=${encodeURIComponent(business.category)}` },
              { label: business.name },
            ]}
          />
        </div>
      </div>

      <main id="main" tabIndex={-1} className="flex-1 bg-ink">
        <div className="rounded-t-3xl bg-paper sm:rounded-t-[2.5rem]">
          <div className={`${container} grid grid-cols-1 gap-x-12 gap-y-8 pt-8 pb-16 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_22.5rem]`}>
            {/* Name, score line and actions */}
            <header className="flex flex-col gap-5 sm:flex-row sm:items-start lg:col-start-1">
              <span className="relative block size-24 shrink-0 overflow-hidden rounded-xl border border-line sm:size-32">
                <BusinessImage src={imgs[0]} name={business.name} category={business.category} sizes="128px" priority />
              </span>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-0.5 text-xs font-medium text-body">
                  {business.type === "ONLINE" ? <GlobeIcon size={13} /> : <LocationIcon size={13} />}
                  {business.type === "ONLINE" ? "Online business" : "Physical location"}
                  {business.city ? ` · ${business.city}` : ""}
                </span>
                <h1 className="mt-2 font-display text-[clamp(1.875rem,6vw,2.5rem)] leading-tight font-extrabold tracking-[-0.02em] break-words">
                  {business.name}
                </h1>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-body">
                  <a href="#reviews-heading" className="underline underline-offset-4 transition-colors duration-200 hover:text-brand">
                    Reviews {business.reviewCount}
                  </a>
                  <span aria-hidden>•</span>
                  <Stars rating={business.avgRating} size={18} />
                  <span className="font-semibold text-ink">{business.reviewCount ? business.avgRating.toFixed(1) : "–"}</span>
                </p>
                <Link
                  href={`/businesses?category=${encodeURIComponent(business.category)}`}
                  className="mt-1 inline-flex min-h-9 items-center gap-1.5 text-brand transition-colors duration-200 hover:text-ink"
                >
                  <CategoryIcon category={business.category} size={16} /> {business.category}
                </Link>
                <div id="business-actions" className="mt-3 flex flex-wrap gap-2.5">
                  <a href="#write-review" className={`${btn.cta} h-11 px-5`}>
                    <PencilIcon size={16} /> {myReview ? "Edit your review" : "Rate this business"}
                  </a>
                  {business.website && (
                    <a href={business.website} target="_blank" rel="noopener noreferrer nofollow" className={btn.pill}>
                      Visit website <ExternalIcon size={16} />
                    </a>
                  )}
                  <ShareButton title={business.name} />
                </div>
              </div>
            </header>

            {/* Score card and trust notes: right column on desktop, under the header on phones */}
            <aside className="flex flex-col gap-3 lg:col-start-2 lg:row-span-6 lg:row-start-1" aria-label="Rating summary">
              <section className="rounded-2xl border border-line" aria-labelledby="score-heading">
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-6 p-6">
                  <div>
                    <h2 id="score-heading" className="sr-only">Overall rating</h2>
                    <p className={`${type.numeral} text-5xl text-ink`}>{business.reviewCount ? business.avgRating.toFixed(1) : "–"}</p>
                    <p className="mt-1 font-semibold text-ink">{ratingLabel(business.avgRating, business.reviewCount)}</p>
                    <Stars rating={business.avgRating} size={16} className="mt-1.5" />
                    <p className="mt-1.5 text-xs text-muted">
                      {business.reviewCount} verified review{business.reviewCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <RatingBars dist={dist} total={reviews.length} />
                </div>
                <p className="border-t border-line px-6 py-3 text-center text-sm">
                  <Link href="/#trust-heading" className="inline-flex min-h-9 items-center text-body underline underline-offset-4 transition-colors duration-200 hover:text-brand">
                    How we keep reviews real
                  </Link>
                </p>
              </section>
              <TrustNote icon={ShieldCheckIcon} title="Verified reviewers only">
                Everyone who rated this confirmed their email and phone number.
              </TrustNote>
              <TrustNote icon={BadgeCheckIcon} title="One review per person">
                People can edit their review, but they can&rsquo;t post twice.
              </TrustNote>
              <TrustNote icon={FlagIcon} title="Reports get checked">
                Anyone can report a review. We check every report.
              </TrustNote>
            </aside>

            <div className="min-w-0 space-y-10 border-t border-line pt-8 lg:col-start-1">
              {/* Photos */}
              <section aria-labelledby="photos-title">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="photos-title" className={type.section}>Photos</h2>
                  <a href="#add-photos" className={btn.smOutline}>
                    <PlusIcon size={16} /> Add photos
                  </a>
                </div>
                {imgs.length > 0 ? (
                  <div className="mt-4">
                    <PhotoGallery images={imgs} name={business.name} />
                    <Link href={`/businesses/${business.slug}/photos`} className="mt-2 inline-flex min-h-11 items-center font-semibold text-brand transition-colors duration-200 hover:text-ink">
                      See all {imgs.length} photo{imgs.length === 1 ? "" : "s"}
                    </Link>
                  </div>
                ) : (
                  <p className="mt-2 text-muted">No photos yet. You could add the first.</p>
                )}
              </section>

              {/* Write a review */}
              <section id="write-review" className="scroll-mt-24 rounded-2xl border border-line p-6 sm:p-8" aria-labelledby="write-heading">
                <h2 id="write-heading" className={type.section}>{myReview ? "Your review" : "How did it really go?"}</h2>
                {!myReview && <p className="mt-1 text-muted">Rate the business and tell people what mattered.</p>}
                <div className="mt-5 max-w-xl">
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

              {/* Reviews */}
              <section aria-labelledby="reviews-heading">
                <h2 id="reviews-heading" className={`${type.section} scroll-mt-24`}>Reviews ({reviews.length})</h2>
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

              {/* Details, heading on the left (Trustpilot-style) */}
              <DetailRow id="about-heading" title="About">
                <p className="whitespace-pre-line text-body">{business.description}</p>
              </DetailRow>

              <DetailRow id="contact-heading" title="Contact info">
                {where || business.website || business.phone ? (
                  <ul className="space-y-2 text-body">
                    {business.address && (
                      <li className="flex items-start gap-3">
                        <LocationIcon size={18} className="mt-0.5 shrink-0" />
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="min-w-0 underline-offset-4 transition-colors duration-200 hover:text-brand hover:underline">
                          {where} <span className="text-sm text-brand">· Open in Maps</span>
                        </a>
                      </li>
                    )}
                    {business.website && (
                      <li className="flex items-start gap-3">
                        <GlobeIcon size={18} className="mt-0.5 shrink-0" />
                        <a href={business.website} target="_blank" rel="noopener noreferrer nofollow" className="min-w-0 break-all underline underline-offset-4 transition-colors duration-200 hover:text-brand">
                          {business.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                        </a>
                      </li>
                    )}
                    {business.phone && (
                      <li className="flex items-start gap-3">
                        <PhoneIcon size={18} className="mt-0.5 shrink-0" />
                        <a href={`tel:${phoneE164 ?? business.phone}`} className="underline-offset-4 transition-colors duration-200 hover:text-brand hover:underline">
                          {phoneE164 ? formatGhanaPhone(phoneE164) : business.phone}
                        </a>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className="text-muted">No contact details yet.</p>
                )}
              </DetailRow>

              {/* Add photos */}
              <section id="add-photos" className="scroll-mt-24 rounded-2xl bg-brand-wash p-6 sm:p-8" aria-labelledby="photos-heading">
                <h2 id="photos-heading" className="text-lg font-bold">Add photos</h2>
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
            </div>
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

function TrustNote({ icon: Icon, title, children }: { icon: (p: { size?: number }) => React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-line p-5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-wash text-brand">
        <Icon size={18} />
      </span>
      <div className="min-w-0 text-sm">
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-muted">{children}</p>
      </div>
    </div>
  );
}

function DetailRow({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8" aria-labelledby={id}>
      <h2 id={id} className={type.section}>{title}</h2>
      <div className="min-w-0 sm:pt-1.5">{children}</div>
    </section>
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
      <Link href={c.href} className={`${btn.primary} mt-4 w-full sm:w-auto`}>
        {c.cta}
      </Link>
    </div>
  );
}
