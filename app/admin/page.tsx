import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { btn, card, container } from "@/components/ui";
import { dismissReportsAction, hideReviewAction } from "@/lib/actions/admin";
import { PendingBusiness } from "@/app/admin/pending-business";
import { SetupCheckPanel } from "@/app/admin/setup-check";
import { setupChecks } from "@/lib/setup-status";
import { approvePhotoAction, removePhotoAction } from "@/lib/actions/photos";
import { getFeedbackCounts, getModerationQueue, getPendingPhotos } from "@/lib/queries";
import { MessageIcon } from "@/components/icons";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";


export default async function AdminPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") notFound();

  const [pending, reported, photos, feedback] = await Promise.all([
    getModerationQueue(),
    prisma.review.findMany({
      where: { status: "PUBLISHED", reports: { some: { resolvedAt: null } } },
      include: {
        business: { select: { name: true, slug: true } },
        user: { select: { name: true, email: true } },
        reports: { where: { resolvedAt: null }, select: { reason: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
    getPendingPhotos(),
    getFeedbackCounts(),
  ]);

  return (
    <>
      <SiteHeader title="Admin" crumbs={[{ label: "Home", href: "/" }]} subtitle="Approve new listings and photos, and handle reported reviews." />
      <main className={`${container} flex-1 py-10`}>
        <SetupCheckPanel checks={setupChecks()} />
        <Link
          href="/admin/feedback"
          className={`${card} mb-10 flex items-center gap-4 p-5 transition-colors duration-200 hover:border-brand-light`}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand text-white"><MessageIcon size={22} /></span>
          <span className="flex-1">
            <span className="block font-display text-lg font-semibold text-ink">Tester feedback</span>
            <span className="text-sm text-muted">{feedback.NEW} new · {feedback.ALL} total</span>
          </span>
          <span className="font-semibold text-brand">View →</span>
        </Link>
        <section className="mb-12" aria-labelledby="pending-photos">
          <h2 id="pending-photos" className="font-display text-xl font-semibold">Pending photos ({photos.length})</h2>
          {photos.length === 0 && <p className="mt-3 text-muted">No photos waiting for review.</p>}
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p) => (
              <li key={p.id} className={`${card} overflow-hidden`}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-[4/3] bg-brand-soft">
                  <Image src={p.url} alt={p.caption ?? `Photo for ${p.business.name}`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                </a>
                <div className="p-4 text-sm">
                  <p className="font-semibold text-ink">
                    <Link href={`/businesses/${p.business.slug}`} className="text-brand underline">{p.business.name}</Link>
                  </p>
                  {p.caption && <p className="mt-1 text-body">“{p.caption}”</p>}
                  <p className="mt-1 text-muted">By {p.uploader.name ?? "unknown"} ({p.uploader.email}) · {p.width}×{p.height}</p>
                  <div className="mt-3 flex gap-2">
                    <form action={approvePhotoAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className={btn.smPrimary}>Approve</button>
                    </form>
                    <form action={removePhotoAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className={btn.smOutline}>Reject</button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">Pending businesses ({pending.length})</h2>
          <p className="mt-1 text-sm text-muted">Oldest first. Check the link and look for duplicates before approving.</p>
          {pending.length === 0 && <p className="mt-3 text-muted">Nothing waiting for approval.</p>}
          <ul className="mt-4 flex flex-col gap-4">
            {pending.map((b) => (
              <li key={b.id}>
                <PendingBusiness b={b} />
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">Reported reviews ({reported.length})</h2>
          {reported.length === 0 && <p className="mt-3 text-muted">No open reports.</p>}
          <ul className="mt-4 flex flex-col gap-4">
            {reported.map((r) => (
              <li key={r.id} className={`${card} p-5`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-[700px]">
                    <p className="text-sm text-muted">
                      On <Link href={`/businesses/${r.business.slug}`} className="font-semibold text-brand underline">{r.business.name}</Link> by {r.user.name} ({r.user.email}) · {r.rating}★
                    </p>
                    <p className="mt-1 font-semibold">{r.title}</p>
                    <p className="mt-1 text-sm">{r.body}</p>
                    <p className="mt-2 text-xs text-coral-ink">
                      {r.reports.length} report{r.reports.length === 1 ? "" : "s"}: {[...new Set(r.reports.map((x) => x.reason))].join(", ")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form action={hideReviewAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className={btn.smDanger}>Hide review</button>
                    </form>
                    <form action={dismissReportsAction}>
                      <input type="hidden" name="id" value={r.id} />
                      <button className={btn.smOutline}>Dismiss</button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
