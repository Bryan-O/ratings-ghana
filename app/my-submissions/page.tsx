import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AlertIcon, CategoryIcon, CheckIcon, ClockIcon, PlusIcon } from "@/components/icons";
import { btn, card, container } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getMySubmissions } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "My submissions" };
export const dynamic = "force-dynamic";

const STATUS = {
  PENDING: { label: "Awaiting review", className: "bg-brand-soft text-brand-deep", icon: ClockIcon },
  APPROVED: { label: "Live", className: "bg-cta-soft text-green-900", icon: CheckIcon },
  REJECTED: { label: "Not approved", className: "bg-red-50 text-red-800", icon: AlertIcon },
} as const;

export default async function MySubmissionsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/my-submissions");
  const items = await getMySubmissions(user.id);

  return (
    <>
      <SiteHeader
        title="My submissions"
        crumbs={[{ label: "Home", href: "/" }, { label: "Businesses", href: "/businesses" }]}
        subtitle="Businesses you've suggested. Our team reviews each one before it goes live."
      >
        <Link href="/businesses/new" className={btn.cta}>
          <PlusIcon size={18} /> Add a business
        </Link>
      </SiteHeader>
      <main className={`${container} flex-1 py-10`}>
        {items.length === 0 ? (
          <p className={`${card} p-8 text-center text-muted`}>You haven&apos;t suggested any businesses yet.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {items.map((b) => {
              const s = STATUS[b.status];
              return (
                <li key={b.id} className={`${card} flex flex-col gap-3 p-5 sm:flex-row sm:items-start`}>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <CategoryIcon category={b.category} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-lg font-semibold">
                        {b.status === "APPROVED" ? (
                          <Link href={`/businesses/${b.slug}`} className="hover:text-brand">{b.name}</Link>
                        ) : (
                          b.name
                        )}
                      </h2>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.className}`}>
                        <s.icon size={12} /> {s.label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted">
                      {b.category} · {b.type === "ONLINE" ? "Online" : "Physical"} · Submitted {formatDate(b.createdAt)}
                      {b.reviewedAt && <> · Reviewed {formatDate(b.reviewedAt)}</>}
                    </p>
                    {b.status === "REJECTED" && b.rejectionReason && (
                      <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                        <span className="font-semibold">Reason:</span> {b.rejectionReason}
                      </p>
                    )}
                    {b.status === "APPROVED" && (
                      <Link href={`/businesses/${b.slug}`} className="mt-2 inline-block text-sm font-semibold text-brand hover:text-brand-hover">
                        View listing →
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
