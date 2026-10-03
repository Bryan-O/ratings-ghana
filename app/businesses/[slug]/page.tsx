import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { BusinessImage } from "@/components/business-image";
import { Stars } from "@/components/stars";
import { GlobeIcon, LocationIcon, PhoneIcon } from "@/components/icons";
import { ReviewCard } from "@/components/review-card";
import { ReviewForm } from "@/components/review-form";
import { formatGhanaPhone, normalizeGhanaPhone } from "@/lib/phone";
import { getBusinessBySlug, getPublishedReviews, getUserReview } from "@/lib/queries";
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
  const myReview = user ? await getUserReview(user.id, business.id) : null;
  const step = nextVerificationStep(user);
  const dist = ratingDistribution(reviews.map((r) => r.rating));
  const imgs = business.images;
  const mapsQuery = encodeURIComponent([business.name, business.address, business.city, "Ghana"].filter(Boolean).join(", "));
  const phoneE164 = business.phone ? normalizeGhanaPhone(business.phone) : null;

  return (
    <>
      <SiteHeader
        title={business.name}
        crumbs={[
          { label: "Home", href: "/" },
          { label: business.category, href: `/businesses?category=${encodeURIComponent(business.category)}` },
          { label: business.name },
        ]}
      />
      <main className="mx-auto w-full max-w-[1512px] flex-1 bg-page px-4 py-5 lg:px-[34px]">
        {/* Gallery: large left, one wide + two small on the right (Figma frames 35–38) */}
        <section aria-label="Photos" className="grid gap-4 lg:grid-cols-[689px_403px] lg:gap-x-[19px]">
          <div className="relative h-[240px] overflow-hidden rounded-[12px] bg-btn sm:h-[449px]">
            <BusinessImage src={imgs[0]} name={business.name} sizes="(max-width: 1024px) 100vw, 689px" priority />
          </div>
          <div className="hidden gap-2 lg:grid lg:grid-rows-[251px_181px]">
            <div className="relative overflow-hidden rounded-[12px] bg-btn">
              <BusinessImage src={imgs[1]} name={business.name} sizes="403px" />
            </div>
            <div className="grid grid-cols-2 gap-[21px]">
              <div className="relative overflow-hidden rounded-[12px] bg-btn">
                <BusinessImage src={imgs[2]} name={business.name} sizes="191px" />
              </div>
              <div className="relative overflow-hidden rounded-[12px] bg-btn">
                <BusinessImage src={imgs[3]} name={business.name} sizes="191px" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-6 lg:grid-cols-[296px_minmax(0,1fr)] lg:gap-[30px]">
          {/* Location and Contact (Figma frame 45) */}
          <aside className="flex flex-col gap-[15px] self-start rounded-[4px] border-2 border-subtle bg-white px-4 py-8">
            <h2 className="text-base font-medium text-black">{business.type === "ONLINE" ? "Website and Contact" : "Location and Contact"}</h2>
            {business.type === "PHYSICAL" && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[116px] items-center justify-center rounded-[12px] bg-[#2f4a3a] bg-[radial-gradient(circle_at_30%_40%,#6f8f5a_0,transparent_45%),radial-gradient(circle_at_75%_70%,#3d6b8c_0,transparent_40%)] text-sm font-semibold text-white hover:opacity-90"
              >
                Open in Google Maps ↗
              </a>
            )}
            {business.address && (
              <p className="flex items-start gap-1 text-[15px] font-medium text-black">
                <LocationIcon className="mt-0.5 shrink-0" />
                <a href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noopener noreferrer" className="underline">
                  {[business.address, business.city].filter(Boolean).join(", ")}
                </a>
              </p>
            )}
            {business.website && (
              <p className="flex items-start gap-1 text-[15px] font-medium text-black">
                <GlobeIcon className="mt-0.5 shrink-0" />
                <a href={business.website} target="_blank" rel="noopener noreferrer nofollow" className="break-all underline">
                  {business.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                </a>
              </p>
            )}
            {business.phone && (
              <p className="flex items-center gap-1.5 text-[15px] font-medium text-black">
                <PhoneIcon className="shrink-0" />
                <a href={`tel:${phoneE164 ?? business.phone}`}>{phoneE164 ? formatGhanaPhone(phoneE164) : business.phone}</a>
              </p>
            )}
          </aside>

          <div className="max-w-[700px]">
            <h2 className="text-2xl font-medium text-black">About</h2>
            <p className="mt-1 text-lg leading-snug whitespace-pre-line text-black lg:text-xl">{business.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-6 rounded-[12px] bg-white p-5">
              <div>
                <p className="text-4xl font-semibold">{business.reviewCount ? business.avgRating.toFixed(1) : "–"}</p>
                <Stars rating={business.avgRating} size={18} />
                <p className="mt-1 text-sm text-muted">
                  {business.reviewCount} verified review{business.reviewCount === 1 ? "" : "s"}
                </p>
              </div>
              <dl className="min-w-[220px] flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const n = dist[star - 1];
                  const pct = reviews.length ? Math.round((n / reviews.length) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <dt className="w-10 shrink-0">{star} star</dt>
                      <dd className="flex flex-1 items-center gap-2">
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#e6e6e6]">
                          <span className="block h-full rounded-full bg-ink" style={{ width: `${pct}%` }} />
                        </span>
                        <span className="w-6 text-right text-muted">{n}</span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[421px_minmax(0,1fr)] lg:gap-10" aria-labelledby="reviews-heading">
          <div className="lg:sticky lg:top-6 lg:self-start" id="write-review">
            <h2 className="mb-3 text-2xl font-semibold text-ink">{myReview ? "Your review" : "Give a review here"}</h2>
            {step === null && user ? (
              user.id === business.submittedById ? (
                <p className="rounded-[4px] bg-white p-4 text-sm">You added this business, so you can&apos;t review it.</p>
              ) : (
                <ReviewForm
                  businessId={business.id}
                  existing={myReview ? { rating: myReview.rating, title: myReview.title, body: myReview.body } : undefined}
                />
              )
            ) : (
              <VerificationPrompt step={step} slug={business.slug} />
            )}
          </div>

          <div>
            <h2 id="reviews-heading" className="sr-only">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="rounded-[12px] bg-white p-6 text-muted">No reviews yet. Be the first to share your experience.</p>
            ) : (
              <ul className="masonry columns-1 sm:columns-2 xl:columns-3">
                {reviews.map((r) => (
                  <li key={r.id}>
                    <ReviewCard
                      review={r}
                      canReport={Boolean(user?.emailVerified) && user?.id !== r.userId}
                      isMine={user?.id === r.userId}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

function VerificationPrompt({ step, slug }: { step: ReturnType<typeof nextVerificationStep>; slug: string }) {
  const next = encodeURIComponent(`/businesses/${slug}#write-review`);
  const copy = {
    login: { text: "Log in or create an account to write a review.", href: `/login?next=${next}`, cta: "Log in to review" },
    "verify-email": { text: "Verify your email address to write a review.", href: "/login", cta: "Verify email" },
    "verify-phone": {
      text: "To keep reviews genuine, every reviewer verifies a Ghana phone number. It takes a minute.",
      href: `/verify-phone?next=${next}`,
      cta: "Verify phone number",
    },
  } as const;
  const c = copy[step ?? "login"];
  return (
    <div className="rounded-[4px] bg-white p-5">
      <p className="text-sm text-ink">{c.text}</p>
      <Link href={c.href} className="mt-4 flex h-[45px] items-center justify-center rounded-[4px] bg-btn-dark text-sm font-semibold text-white hover:bg-black">
        {c.cta}
      </Link>
    </div>
  );
}
