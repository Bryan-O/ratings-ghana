import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { btn, card, container } from "@/components/ui";
import { approveBusinessAction, dismissReportsAction, hideReviewAction, rejectBusinessAction } from "@/lib/actions/admin";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";


export default async function AdminPage() {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") notFound();

  const [pending, reported] = await Promise.all([
    prisma.business.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { submittedBy: { select: { name: true, email: true } } },
    }),
    prisma.review.findMany({
      where: { status: "PUBLISHED", reports: { some: { resolvedAt: null } } },
      include: {
        business: { select: { name: true, slug: true } },
        user: { select: { name: true, email: true } },
        reports: { where: { resolvedAt: null }, select: { reason: true } },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <>
      <SiteHeader title="Admin" crumbs={[{ label: "Home", href: "/" }]} subtitle="Approve new listings and handle reported reviews." />
      <main className={`${container} flex-1 py-10`}>
        <section>
          <h2 className="font-display text-xl font-semibold">Pending businesses ({pending.length})</h2>
          {pending.length === 0 && <p className="mt-3 text-muted">Nothing waiting for approval.</p>}
          <ul className="mt-4 flex flex-col gap-4">
            {pending.map((b) => (
              <li key={b.id} className={`${card} p-5`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      {b.name} <span className="text-sm font-normal text-muted">· {b.category} · {b.type === "ONLINE" ? "Online" : "Physical"}</span>
                    </p>
                    <p className="mt-1 text-sm">{b.description}</p>
                    <p className="mt-1 text-sm text-muted">
                      {[b.address, b.city, b.region].filter(Boolean).join(", ")} {b.website && <>· {b.website}</>} {b.phone && <>· {b.phone}</>}
                    </p>
                    <p className="mt-1 text-xs text-muted">Suggested by {b.submittedBy?.name ?? "unknown"} ({b.submittedBy?.email})</p>
                  </div>
                  <div className="flex gap-2">
                    <form action={approveBusinessAction}>
                      <input type="hidden" name="id" value={b.id} />
                      <button className={btn.smPrimary}>Approve</button>
                    </form>
                    <form action={rejectBusinessAction}>
                      <input type="hidden" name="id" value={b.id} />
                      <button className={btn.smOutline}>Reject</button>
                    </form>
                  </div>
                </div>
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
                    <p className="mt-2 text-xs text-red-700">
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
